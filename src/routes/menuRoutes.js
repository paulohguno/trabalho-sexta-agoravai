const express = require('express');
const menuController = require('../controllers/menuController');
const { autenticar, exigirAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', menuController.listar);
router.post('/', autenticar, exigirAdmin, menuController.criar);
router.put('/:id', autenticar, exigirAdmin, menuController.atualizar);
router.delete('/:id', autenticar, exigirAdmin, menuController.remover);

module.exports = router;
