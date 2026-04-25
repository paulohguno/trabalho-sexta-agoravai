const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const PremioRoleta = sequelize.define('premio_roleta', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  desconto_percentual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  probabilidade_vitoria: { type: DataTypes.FLOAT, allowNull: false },
  cor: { type: DataTypes.STRING, allowNull: false, defaultValue: '#ff8a00' },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'premios_roleta',
  timestamps: true,
});

module.exports = PremioRoleta;
