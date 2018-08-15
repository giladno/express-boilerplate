'use strict';
const crypto = require('crypto');
const util = require('util');
const Sequelize = require('sequelize');

const SCRYPT_SALT_SIZE = 16;
const SCRYPT_KEYLEN = 64;

const randomBytes = util.promisify(crypto.randomBytes);
const scrypt = util.promisify(crypto.scrypt);

async function scryptHash(password) {
    let salt = await randomBytes(SCRYPT_SALT_SIZE);
    let hash = await scrypt(password, salt, SCRYPT_KEYLEN);
    let res = Buffer.alloc(hash.length + salt.length + 4);
    res.writeUInt32BE(salt.length, 0, true);
    salt.copy(res, 4);
    hash.copy(res, salt.length + 4);
    return res.toString('base64');
}

async function scryptVerify(password, passwordHash) {
    let buf = Buffer.from(passwordHash, 'base64');
    let saltLength = buf.readUInt32BE(0);
    let hash = await scrypt(password, buf.slice(4, saltLength + 4), buf.length - saltLength - 4);
    return !hash.compare(buf, saltLength + 4);
}

module.exports = sequelize => {
    let model = sequelize.define(
        'User',
        {
            email: {type: Sequelize.STRING, unique: true},
            password: Sequelize.VIRTUAL,
            password_digest: Sequelize.STRING,
            logout: Sequelize.DATE,
        },
        {
            hooks: {
                async beforeCreate(user) {
                    if (user.password) user.set('password_digest', await scryptHash(user.password));
                },
                async beforeUpdate(user) {
                    if (user.password) user.set('password_digest', await scryptHash(user.password));
                },
            },
        }
    );
    model.prototype.authenticate = async function(password) {
        return this.password_digest && (await scryptVerify(password, this.password_digest));
    };
    return model;
};
