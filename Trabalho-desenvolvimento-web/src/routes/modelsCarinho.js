const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ mensagem: 'Rota antiga mantida apenas por compatibilidade. Use as rotas /api/*.' }));
module.exports = router;
