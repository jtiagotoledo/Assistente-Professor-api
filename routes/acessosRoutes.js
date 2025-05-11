const express = require('express');
const router = express.Router();

const acessoController = require('../controllers/acessoController');

// Rota para registrar um acesso
router.post('/', acessoController.registrarAcesso);

module.exports = router;