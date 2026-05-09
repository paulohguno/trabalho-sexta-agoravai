const express = require('express');
const pedidoController = require('../controllers/pedidoController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', autenticar, pedidoController.listar);
router.post('/', autenticar, pedidoController.criar);

module.exports = router;
