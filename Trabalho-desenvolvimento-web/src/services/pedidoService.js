const {
  sequelize,
  Usuario,
  ItemMenu,
  Pedido,
  ItemPedido,
  Pagamento,
  PremioUsuario,
  TransacaoPonto,
} = require('../models');

function arredondar(valor) {
  return Number(Number(valor).toFixed(2));
}

async function listarPedidosUsuario(usuarioId) {
  return Pedido.findAll({
    where: { usuario_id: usuarioId },
    include: [
      { model: ItemPedido, as: 'itens', include: [{ model: ItemMenu, as: 'item_menu' }] },
      { model: Pagamento },
      { model: PremioUsuario, as: 'cupom' },
    ],
    order: [['created_at', 'DESC']],
  });
}

async function criarPedido(usuarioId, dados) {
  const { itens, cupom_id, metodo_pagamento = 'pix' } = dados;

  if (!Array.isArray(itens) || itens.length === 0) {
    const error = new Error('Informe ao menos um item para criar o pedido.');
    error.status = 400;
    throw error;
  }

  return sequelize.transaction(async (transaction) => {
    const usuario = await Usuario.findByPk(usuarioId, { transaction });
    if (!usuario) {
      const error = new Error('Usuário não encontrado.');
      error.status = 404;
      throw error;
    }

    let valorBruto = 0;
    const itensCalculados = [];

    for (const itemPedido of itens) {
      const quantidade = Number(itemPedido.quantidade || 1);
      const item = await ItemMenu.findByPk(itemPedido.item_menu_id, { transaction });

      if (!item || !item.ativo) {
        const error = new Error('Um dos itens selecionados não existe ou está inativo.');
        error.status = 400;
        throw error;
      }

      const precoUnitario = Number(item.preco);
      const subtotal = arredondar(precoUnitario * quantidade);
      valorBruto += subtotal;

      itensCalculados.push({
        item_menu_id: item.id,
        quantidade,
        preco_unitario: precoUnitario,
        subtotal,
      });
    }

    valorBruto = arredondar(valorBruto);

    let cupom = null;
    let valorDesconto = 0;

    if (cupom_id) {
      cupom = await PremioUsuario.findOne({
        where: { id: cupom_id, usuario_id: usuario.id, resgatado: false },
        transaction,
      });

      if (!cupom) {
        const error = new Error('Cupom inválido ou já utilizado.');
        error.status = 400;
        throw error;
      }

      if (new Date(cupom.expira_em) < new Date()) {
        const error = new Error('Cupom expirado.');
        error.status = 400;
        throw error;
      }

      valorDesconto = arredondar(valorBruto * (cupom.desconto_percentual / 100));
    }

    const total = arredondar(Math.max(valorBruto - valorDesconto, 0));
    const pontosGerados = Math.floor(total);

    const pedido = await Pedido.create({
      usuario_id: usuario.id,
      cupom_id: cupom ? cupom.id : null,
      valor_bruto: valorBruto,
      valor_desconto: valorDesconto,
      preco_total: total,
      pontos_gerados: pontosGerados,
      situacao: 'pago',
    }, { transaction });

    for (const item of itensCalculados) {
      await ItemPedido.create({ ...item, pedido_id: pedido.id }, { transaction });
    }

    await Pagamento.create({
      pedido_id: pedido.id,
      metodo: metodo_pagamento,
      valor: total,
      situacao: 'aprovado',
      codigo_pix: metodo_pagamento === 'pix' ? `PIX-${pedido.id}-${Date.now()}` : null,
    }, { transaction });

    if (cupom) {
      await cupom.update({ resgatado: true, resgatado_em: new Date() }, { transaction });
    }

    await usuario.increment('pontos', { by: pontosGerados, transaction });
    await TransacaoPonto.create({
      usuario_id: usuario.id,
      pedido_id: pedido.id,
      valor: pontosGerados,
      tipo: 'credito',
      descricao: `Pontos gerados pelo pedido #${pedido.id}`,
    }, { transaction });

    await usuario.reload({ transaction });

    return {
      pedido: await Pedido.findByPk(pedido.id, {
        include: [{ model: ItemPedido, as: 'itens', include: [{ model: ItemMenu, as: 'item_menu' }] }, { model: Pagamento }, { model: PremioUsuario, as: 'cupom' }],
        transaction,
      }),
      usuario,
      pontos_gerados: pontosGerados,
    };
  });
}

module.exports = {
  listarPedidosUsuario,
  criarPedido,
};
