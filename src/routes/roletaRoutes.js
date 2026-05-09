const express = require('express');
const roletaController = require('../controllers/roletaController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/premios', roletaController.premios);
router.get('/cupons', autenticar, roletaController.cupons);
router.post('/girar', autenticar, roletaController.girar);

module.exports = router;
