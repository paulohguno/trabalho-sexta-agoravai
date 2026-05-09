const pontosService = require('../services/pontosService');

async function extrato(req, res, next) {
  try {
    res.json(await pontosService.listarExtrato(req.usuario.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { extrato };
