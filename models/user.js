'use strict';
const crypto = require('crypto');
const util = require('util');

const SCRYPT_SALT_SIZE = 10;
const SCRYPT_ROUNDS = 8;
const SCRYPT_MEM_COST = 14;

const randomBytes = util.promisify(crypto.randomBytes);
const scrypt = util.promisify(crypto.scrypt);

const calculateDigest = async function(password, salt) {
    const cipher = crypto.createCipheriv(
        'aes-256-ctr',
        await scrypt(password, Buffer.from(salt, 'base64'), 32, {
            N: 1 << SCRYPT_MEM_COST,
            p: 1,
            r: SCRYPT_ROUNDS,
        }),
        Buffer.alloc(16, 0)
    );
    return cipher.update(process.env.SIGNER_KEY || 'c2VjcmV0', 'base64', 'base64') + cipher.final('base64');
};

module.exports = (sequelize, Sequelize) => {
    const model = sequelize.define(
        'User',
        {
            email: {type: Sequelize.STRING, unique: true},
            password: Sequelize.VIRTUAL,
            password_digest: Sequelize.STRING,
            salt: Sequelize.STRING,
            logout: Sequelize.DATE,
        },
        {
            hooks: {
                async beforeCreate(user) {
                    if (user.password) {
                        user.salt = (await randomBytes(SCRYPT_SALT_SIZE)).toString('base64');
                        user.set('password_digest', await calculateDigest(user.password, user.salt));
                    }
                },
                async beforeUpdate(user) {
                    if (user.password) {
                        user.salt = (await randomBytes(SCRYPT_SALT_SIZE)).toString('base64');
                        user.set('password_digest', await calculateDigest(user.password, user.salt));
                    }
                },
            },
        }
    );

    model.prototype.authenticate = async function(password) {
        return this.password_digest && this.password_digest === (await calculateDigest(String(password), this.salt));
    };
};
