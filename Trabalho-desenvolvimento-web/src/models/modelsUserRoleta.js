const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const PremioUsuario = sequelize.define('premio_usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  premio_id: { type: DataTypes.INTEGER, allowNull: false },
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  desconto_percentual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  resgatado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  resgatado_em: { type: DataTypes.DATE, allowNull: true },
  expira_em: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'premios_usuario',
  timestamps: true,
});

module.exports = PremioUsuario;
