const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Pedido = sequelize.define('pedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  cupom_id: { type: DataTypes.INTEGER, allowNull: true },
  valor_bruto: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  valor_desconto: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  preco_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  pontos_gerados: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  situacao: {
    type: DataTypes.ENUM('pendente', 'pago', 'preparando', 'entregue', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendente',
  },
}, {
  tableName: 'pedidos',
  timestamps: true,
});

module.exports = Pedido;
