const path = require('path');
const express = require('express');
require('./config/env');
const { syncModels } = require('./models');
const { criarDadosIniciais } = require('./services/seedService');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const roletaRoutes = require('./routes/roletaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const pontosRoutes = require('./routes/pontosRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
const porta = process.env.API_PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', projeto: 'Roda & Sabor' });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/roleta', roletaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pontos', pontosRoutes);

app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) return notFound(req, res);
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await syncModels();
    await criarDadosIniciais();

    app.listen(porta, () => {
      console.log(`Servidor rodando em http://localhost:${porta}`);
      console.log('Login admin: admin@rodaesabor.com / admin123');
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor. Confira o PostgreSQL e o arquivo .env.');
    console.error(error);
    process.exit(1);
  }
};

startServer();
