'use strict';
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');

const BCRYPT_SALT = 11;

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://:memory:', {
    operatorsAliases: false,
    logging: false,
});

module.exports = [
    sequelize.define(
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
                    if (user.password) user.set('password_digest', await bcrypt.hash(user.password, BCRYPT_SALT));
                },
                async beforeUpdate(user) {
                    if (user.password) user.set('password_digest', await bcrypt.hash(user.password, BCRYPT_SALT));
                },
            },
        }
    ),
].reduce((db, model) => ({...db, [model.name]: model}), {Sequelize, sequelize});

(({User}) => {
    User.prototype.authenticate = async function(password) {
        return this.password_digest && (await bcrypt.compare(password, this.password_digest));
    };
})(module.exports);
