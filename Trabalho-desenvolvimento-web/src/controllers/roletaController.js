const roletaService = require('../services/roletaService');
const authService = require('../services/authService');

function premioToResponse(premio) {
  return {
    id: premio.id,
    label: premio.nome,
    nome: premio.nome,
    descricao: premio.descricao,
    desconto_percentual: premio.desconto_percentual,
    probabilidade_vitoria: premio.probabilidade_vitoria,
    color: premio.cor,
    cor: premio.cor,
  };
}

async function premios(req, res, next) {
  try {
    const lista = await roletaService.listarPremios();
    res.json(lista.map(premioToResponse));
  } catch (error) {
    next(error);
  }
}

async function cupons(req, res, next) {
  try {
    const lista = await roletaService.listarCuponsUsuario(req.usuario.id);
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

async function girar(req, res, next) {
  try {
    const resultado = await roletaService.girarRoleta(req.usuario.id);
    const premio = premioToResponse(resultado.premio);
    res.json({
      success: true,
      prizeLabel: premio.label,
      premio,
      couponCode: resultado.cupom ? resultado.cupom.codigo : null,
      cupom: resultado.cupom,
      message: resultado.cupom
        ? `Você ganhou ${premio.label}! Cupom ${resultado.cupom.codigo} criado.`
        : 'Não foi dessa vez. Continue comprando para acumular pontos e tentar novamente!',
      usuario: authService.limparUsuario(resultado.usuario),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { premios, cupons, girar };
