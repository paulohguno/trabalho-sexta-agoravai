const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const TransacaoPonto = sequelize.define('transacao_ponto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  pedido_id: { type: DataTypes.INTEGER, allowNull: true },
  valor: { type: DataTypes.INTEGER, allowNull: false },
  tipo: {
    type: DataTypes.ENUM('credito', 'debito'),
    allowNull: false,
    defaultValue: 'credito',
  },
  descricao: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'transacoes_pontos',
  timestamps: true,
  updatedAt: false,
});

module.exports = TransacaoPonto;
