'use strict';
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://:memory:', {
    logging: false,
});

Object.values(
    require('require-all')({
        dirname: __dirname,
        filter: filename => {
            if (!filename.endsWith('.js')) return false;
            if (filename == 'index.js') return false;
            return filename;
        },
    })
).forEach(controller => controller(sequelize, Sequelize));

Object.values(sequelize.models)
    .filter(({associate}) => associate)
    .forEach(model => model.associate(sequelize.models));

module.exports = sequelize;
