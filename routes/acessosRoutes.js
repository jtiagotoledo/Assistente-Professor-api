const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const acessosController = require('../controllers/acessosController');

router.post('/', authMiddleware, acessosController.registrarAcesso);

module.exports = router;