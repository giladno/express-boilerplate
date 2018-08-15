'use strict';
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite://:memory:', {
    operatorsAliases: false,
    logging: false,
});

module.exports = {sequelize};

for (const controller of Object.values(
    require('require-all')({dirname: path.resolve(__dirname, './models'), recursive: false})
)) {
    let model = controller(sequelize);
    module.exports[model.name] = model;
}
