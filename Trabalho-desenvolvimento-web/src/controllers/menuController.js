const menuService = require('../services/menuService');

async function listar(req, res, next) {
  try {
    res.json(await menuService.listarItens());
  } catch (error) {
    next(error);
  }
}

async function criar(req, res, next) {
  try {
    res.status(201).json(await menuService.criarItem(req.body));
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    res.json(await menuService.atualizarItem(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function remover(req, res, next) {
  try {
    res.json(await menuService.removerItem(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, criar, atualizar, remover };
