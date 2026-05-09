const { syncModels } = require('../models');
const { criarDadosIniciais } = require('../services/seedService');

(async () => {
  try {
    await syncModels();
    await criarDadosIniciais();
    console.log('Banco sincronizado e dados iniciais criados.');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao sincronizar banco:', error);
    process.exit(1);
  }
})();
