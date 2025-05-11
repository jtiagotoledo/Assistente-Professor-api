const express = require('express');
const router = express.Router();

const acessoController = require('../controllers/acessoController');

// Rota para registrar um acesso
router.post('/professores/acesso', acessoController.registrarAcesso);

module.exports = router;