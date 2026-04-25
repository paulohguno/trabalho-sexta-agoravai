const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Endereco = sequelize.define('endereco', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  logradouro: { type: DataTypes.STRING, allowNull: false },
  numero: { type: DataTypes.STRING, allowNull: false },
  bairro: { type: DataTypes.STRING, allowNull: false },
  complemento: { type: DataTypes.STRING, allowNull: true },
  referencia: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'enderecos',
  timestamps: true,
});

module.exports = Endereco;
