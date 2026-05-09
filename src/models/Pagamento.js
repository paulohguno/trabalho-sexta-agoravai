const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Pagamento = sequelize.define('pagamento', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  metodo: {
    type: DataTypes.ENUM('cartao_credito', 'pix', 'dinheiro'),
    allowNull: false,
  },
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  situacao: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado'),
    allowNull: false,
    defaultValue: 'aprovado',
  },
  codigo_pix: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'pagamentos',
  timestamps: true,
});

module.exports = Pagamento;
