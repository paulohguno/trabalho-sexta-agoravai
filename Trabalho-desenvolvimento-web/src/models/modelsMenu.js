const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const ItemMenu = sequelize.define('item_menu', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Prato' },
  url_imagem: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'itens_menu',
  timestamps: true,
});

module.exports = ItemMenu;
