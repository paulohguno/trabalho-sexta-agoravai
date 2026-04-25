const sequelize = require('../config');
const Usuario = require('./modelsUser');
const Endereco = require('./modelsEndereco');
const CartaoCredito = require('./modelsCartoes');
const ItemMenu = require('./modelsMenu');
const Pedido = require('./modelsMenuOrden');
const ItemPedido = require('./modelsCarinho');
const Pagamento = require('./modelsPagamento');
const PremioRoleta = require('./modelsRolleta');
const PremioUsuario = require('./modelsUserRoleta');
const TransacaoPonto = require('./modelsPontos');

Usuario.hasMany(Endereco, { foreignKey: 'usuario_id' });
Endereco.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(CartaoCredito, { foreignKey: 'usuario_id' });
CartaoCredito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });
ItemMenu.hasMany(ItemPedido, { foreignKey: 'item_menu_id' });
ItemPedido.belongsTo(ItemMenu, { foreignKey: 'item_menu_id', as: 'item_menu' });

Pedido.hasOne(Pagamento, { foreignKey: 'pedido_id' });
Pagamento.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Usuario.hasMany(PremioUsuario, { foreignKey: 'usuario_id', as: 'cupons' });
PremioUsuario.belongsTo(Usuario, { foreignKey: 'usuario_id' });
PremioRoleta.hasMany(PremioUsuario, { foreignKey: 'premio_id' });
PremioUsuario.belongsTo(PremioRoleta, { foreignKey: 'premio_id', as: 'premio' });
Pedido.belongsTo(PremioUsuario, { foreignKey: 'cupom_id', as: 'cupom' });

Usuario.hasMany(TransacaoPonto, { foreignKey: 'usuario_id', as: 'extrato_pontos' });
TransacaoPonto.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Pedido.hasMany(TransacaoPonto, { foreignKey: 'pedido_id' });
TransacaoPonto.belongsTo(Pedido, { foreignKey: 'pedido_id' });

async function syncModels(options = {}) {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true, ...options });
}

module.exports = {
  sequelize,
  syncModels,
  Usuario,
  Endereco,
  CartaoCredito,
  ItemMenu,
  Pedido,
  ItemPedido,
  Pagamento,
  PremioRoleta,
  PremioUsuario,
  TransacaoPonto,
};
