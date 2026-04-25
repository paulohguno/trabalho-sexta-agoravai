const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const CartaoCredito = sequelize.define('cartao_credito', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  numero_cartao: { type: DataTypes.STRING, allowNull: false },
  nome_cartao: { type: DataTypes.STRING, allowNull: false },
  data_validade: { type: DataTypes.STRING, allowNull: false },
  cvv: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'cartoes_credito',
  timestamps: true,
});

module.exports = CartaoCredito;
