const pedidoService = require('../services/pedidoService');
const authService = require('../services/authService');

async function listar(req, res, next) {
  try {
    res.json(await pedidoService.listarPedidosUsuario(req.usuario.id));
  } catch (error) {
    next(error);
  }
}

async function criar(req, res, next) {
  try {
    const resultado = await pedidoService.criarPedido(req.usuario.id, req.body);
    res.status(201).json({
      ...resultado,
      usuario: authService.limparUsuario(resultado.usuario),
      message: `Pedido finalizado! Você ganhou ${resultado.pontos_gerados} pontos.`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, criar };
