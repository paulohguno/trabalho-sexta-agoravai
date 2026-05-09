function notFound(req, res) {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    mensagem: error.message || 'Erro interno no servidor.',
  });
}

module.exports = { notFound, errorHandler };
