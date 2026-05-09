const express = require('express');
const pontosController = require('../controllers/pontosController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/extrato', autenticar, pontosController.extrato);

module.exports = router;
