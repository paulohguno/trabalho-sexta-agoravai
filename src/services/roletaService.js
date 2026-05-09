const crypto = require('crypto');
const {
  Usuario,
  PremioRoleta,
  PremioUsuario,
  TransacaoPonto,
} = require('../models');

const CUSTO_GIRO = 100;

function sortearPremio(premios) {
  const total = premios.reduce((acc, premio) => acc + Number(premio.probabilidade_vitoria), 0);
  let sorteado = Math.random() * total;

  for (const premio of premios) {
    sorteado -= Number(premio.probabilidade_vitoria);
    if (sorteado <= 0) return premio;
  }

  return premios[premios.length - 1];
}

function gerarCodigoCupom(desconto) {
  return `RODA${desconto}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

async function listarPremios() {
  return PremioRoleta.findAll({ where: { ativo: true }, order: [['id', 'ASC']] });
}

async function listarCuponsUsuario(usuarioId) {
  return PremioUsuario.findAll({
    where: { usuario_id: usuarioId },
    include: [{ model: PremioRoleta, as: 'premio' }],
    order: [['created_at', 'DESC']],
  });
}

async function girarRoleta(usuarioId) {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    const error = new Error('Usuário não encontrado.');
    error.status = 404;
    throw error;
  }

  if (usuario.pontos < CUSTO_GIRO) {
    const error = new Error(`Você precisa de ${CUSTO_GIRO} pontos para girar a roleta.`);
    error.status = 400;
    throw error;
  }

  const premios = await listarPremios();
  if (!premios.length) {
    const error = new Error('Nenhum prêmio ativo foi cadastrado.');
    error.status = 400;
    throw error;
  }

  const premio = sortearPremio(premios);
  await usuario.decrement('pontos', { by: CUSTO_GIRO });
  await TransacaoPonto.create({
    usuario_id: usuario.id,
    valor: -CUSTO_GIRO,
    tipo: 'debito',
    descricao: 'Troca de pontos por giro na roleta',
  });

  let cupom = null;
  if (premio.desconto_percentual > 0) {
    cupom = await PremioUsuario.create({
      usuario_id: usuario.id,
      premio_id: premio.id,
      codigo: gerarCodigoCupom(premio.desconto_percentual),
      desconto_percentual: premio.desconto_percentual,
      expira_em: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  }

  await usuario.reload();

  return {
    premio,
    cupom,
    usuario,
    pontos_gastos: CUSTO_GIRO,
  };
}

module.exports = {
  CUSTO_GIRO,
  listarPremios,
  listarCuponsUsuario,
  girarRoleta,
};
