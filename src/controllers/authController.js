const authService = require('../services/authService');

async function cadastrar(req, res, next) {
  try {
    const resultado = await authService.cadastrar(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const resultado = await authService.login(req.body);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({ usuario: authService.limparUsuario(req.usuario) });
}

module.exports = { cadastrar, login, me };
