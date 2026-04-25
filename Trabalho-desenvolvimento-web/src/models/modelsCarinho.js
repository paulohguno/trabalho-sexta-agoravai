const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const ItemPedido = sequelize.define('item_pedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  item_menu_id: { type: DataTypes.INTEGER, allowNull: false },
  quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  preco_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'itens_pedido',
  timestamps: true,
});

module.exports = ItemPedido;
