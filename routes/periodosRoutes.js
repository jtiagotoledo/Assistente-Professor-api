const express = require('express');
const router = express.Router();
const periodosController = require('../controllers/periodosController');
const authMiddleware = require('../middlewares/authmiddleware');

// Buscar todos os períodos de um professor
router.get('/:id_professor', authMiddleware, periodosController.getByProfessor);

// Criar novo período
router.post('/', authMiddleware, periodosController.create);

// atualizar período
router.put('/:id', authMiddleware, periodosController.update);

// deletar período
router.delete('/:id', authMiddleware, periodosController.delete);

module.exports = router;