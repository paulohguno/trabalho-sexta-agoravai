const { Usuario } = require('../models');
const { hashSenha, compararSenha, gerarToken } = require('../utils/auth');

function limparUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    telefone: usuario.telefone,
    pontos: usuario.pontos,
    id_funcao: usuario.id_funcao,
    perfil: usuario.id_funcao === 2 ? 'ADMIN' : 'CLIENTE',
  };
}

async function cadastrar(dados) {
  const { nome, email, senha, cpf, telefone } = dados;
  if (!nome || !email || !senha) {
    const error = new Error('Nome, e-mail e senha são obrigatórios.');
    error.status = 400;
    throw error;
  }

  const existente = await Usuario.findOne({ where: { email } });
  if (existente) {
    const error = new Error('Já existe um usuário cadastrado com este e-mail.');
    error.status = 409;
    throw error;
  }

  const usuario = await Usuario.create({
    nome,
    email,
    senha_hash: hashSenha(senha),
    cpf: cpf || null,
    telefone: telefone || null,
    pontos: 0,
    id_funcao: 1,
  });

  return {
    usuario: limparUsuario(usuario),
    token: gerarToken(usuario),
  };
}

async function login({ email, senha }) {
  if (!email || !senha) {
    const error = new Error('E-mail e senha são obrigatórios.');
    error.status = 400;
    throw error;
  }

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario || !compararSenha(senha, usuario.senha_hash)) {
    const error = new Error('E-mail ou senha inválidos.');
    error.status = 401;
    throw error;
  }

  return {
    usuario: limparUsuario(usuario),
    token: gerarToken(usuario),
  };
}

module.exports = {
  cadastrar,
  login,
  limparUsuario,
};
