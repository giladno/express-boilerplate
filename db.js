'use strict';
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://:memory:', {
    operatorsAliases: false,
    logging: false,
});

module.exports = Object.entries(
    require('require-all')({dirname: path.resolve(__dirname, './models'), recursive: false})
)
    .map(([, controller]) => controller(sequelize))
    .reduce((db, model) => ({...db, [model.name]: model}), {Sequelize, sequelize});
