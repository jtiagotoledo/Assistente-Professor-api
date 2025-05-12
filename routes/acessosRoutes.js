const express = require('express');
const router = express.Router();

const acessosController = require('../controllers/acessosController');

// Rota para registrar um acesso
router.post('/', acessosController.registrarAcesso);

module.exports = router;