'use strict';
const crypto = require('crypto');
const util = require('util');

const SCRYPT_SALT_SIZE = 16;
const SCRYPT_KEYLEN = 64;

const randomBytes = util.promisify(crypto.randomBytes);
const scrypt = util.promisify(crypto.scrypt);

async function scryptHash(password) {
    const salt = await randomBytes(SCRYPT_SALT_SIZE);
    const hash = await scrypt(password, salt, SCRYPT_KEYLEN);
    const res = Buffer.alloc(hash.length + salt.length + 4);
    res.writeUInt32BE(salt.length, 0, true);
    salt.copy(res, 4);
    hash.copy(res, salt.length + 4);
    return res.toString('base64');
}

async function scryptVerify(password, passwordHash) {
    const buf = Buffer.from(passwordHash, 'base64');
    const saltLength = buf.readUInt32BE(0);
    const hash = await scrypt(password, buf.slice(4, saltLength + 4), buf.length - saltLength - 4);
    return !hash.compare(buf, saltLength + 4);
}

module.exports = (sequelize, Sequelize) => {
    const model = sequelize.define(
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
};
