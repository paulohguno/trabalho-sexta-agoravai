const { TransacaoPonto } = require('../models');

async function listarExtrato(usuarioId) {
  return TransacaoPonto.findAll({
    where: { usuario_id: usuarioId },
    order: [['created_at', 'DESC']],
  });
}

module.exports = { listarExtrato };
