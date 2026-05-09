const { Usuario, ItemMenu, PremioRoleta } = require('../models');
const { hashSenha } = require('../utils/auth');

async function criarDadosIniciais() {
  const adminExistente = await Usuario.findOne({ where: { email: 'admin@rodaesabor.com' } });
  if (!adminExistente) {
    await Usuario.create({
      nome: 'Administrador Roda & Sabor',
      email: 'admin@rodaesabor.com',
      senha_hash: hashSenha('admin123'),
      cpf: '00000000000',
      telefone: '49999999999',
      id_funcao: 2,
      pontos: 500,
    });
  }

  const qtdItens = await ItemMenu.count();
  if (qtdItens === 0) {
    await ItemMenu.bulkCreate([
      {
        nome: 'Burger Volta Rápida',
        descricao: 'Hambúrguer artesanal com cheddar, bacon crocante e molho especial da casa.',
        preco: 34.9,
        categoria: 'Lanches',
        url_imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
      },
      {
        nome: 'Batata Pit Stop',
        descricao: 'Batata frita crocante com queijo, bacon e tempero especial.',
        preco: 22.9,
        categoria: 'Porções',
        url_imagem: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=80',
      },
      {
        nome: 'Pizza Grid de Largada',
        descricao: 'Pizza média com calabresa, queijo e cebola caramelizada.',
        preco: 49.9,
        categoria: 'Pizzas',
        url_imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
      },
      {
        nome: 'Brownie Pódio',
        descricao: 'Brownie quente com sorvete e calda de chocolate.',
        preco: 18.9,
        categoria: 'Sobremesas',
        url_imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
      },
      {
        nome: 'Refri Turbo',
        descricao: 'Refrigerante lata 350ml.',
        preco: 7.9,
        categoria: 'Bebidas',
        url_imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80',
      },
    ]);
  }

  const qtdPremios = await PremioRoleta.count();
  if (qtdPremios === 0) {
    await PremioRoleta.bulkCreate([
      { nome: '5% OFF', descricao: 'Cupom de 5% de desconto.', desconto_percentual: 5, probabilidade_vitoria: 35, cor: '#ffb347' },
      { nome: '10% OFF', descricao: 'Cupom de 10% de desconto.', desconto_percentual: 10, probabilidade_vitoria: 25, cor: '#ff8a00' },
      { nome: '15% OFF', descricao: 'Cupom de 15% de desconto.', desconto_percentual: 15, probabilidade_vitoria: 18, cor: '#ff6a00' },
      { nome: '20% OFF', descricao: 'Cupom de 20% de desconto.', desconto_percentual: 20, probabilidade_vitoria: 12, cor: '#ff9f43' },
      { nome: '25% OFF', descricao: 'Cupom de 25% de desconto.', desconto_percentual: 25, probabilidade_vitoria: 7, cor: '#f97316' },
      { nome: 'TENTE NOVAMENTE', descricao: 'Não foi dessa vez, mas você pode acumular pontos e tentar novamente.', desconto_percentual: 0, probabilidade_vitoria: 3, cor: '#2b2b2b' },
    ]);
  }
}

module.exports = { criarDadosIniciais };
