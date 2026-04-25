const { ItemMenu } = require('../models');

async function listarItens() {
  return ItemMenu.findAll({ where: { ativo: true }, order: [['id', 'ASC']] });
}

async function criarItem(dados) {
  const { nome, descricao, preco, categoria, url_imagem } = dados;
  if (!nome || !preco) {
    const error = new Error('Nome e preço são obrigatórios.');
    error.status = 400;
    throw error;
  }

  return ItemMenu.create({
    nome,
    descricao: descricao || '',
    preco,
    categoria: categoria || 'Prato',
    url_imagem: url_imagem || '',
    ativo: true,
  });
}

async function atualizarItem(id, dados) {
  const item = await ItemMenu.findByPk(id);
  if (!item) {
    const error = new Error('Item de menu não encontrado.');
    error.status = 404;
    throw error;
  }
  await item.update(dados);
  return item;
}

async function removerItem(id) {
  const item = await ItemMenu.findByPk(id);
  if (!item) {
    const error = new Error('Item de menu não encontrado.');
    error.status = 404;
    throw error;
  }
  await item.update({ ativo: false });
  return item;
}

module.exports = {
  listarItens,
  criarItem,
  atualizarItem,
  removerItem,
};
