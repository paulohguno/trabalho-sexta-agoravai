require('./env');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'restaurante_db',
  process.env.POSTGRES_USERNAME || 'postgres',
  process.env.POSTGRES_PASSWORD || 'postgres',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
      freezeTableName: true,
    },
  }
);

module.exports = sequelize;
