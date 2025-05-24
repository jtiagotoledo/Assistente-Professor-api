const express = require('express');
const router = express.Router();
const periodosController = require('../controllers/periodosController');

// Buscar todos os períodos de um professor
router.get('/:id_professor', periodosController.getByProfessor);

// Criar novo período
router.post('/', periodosController.create);

// atualizar período
router.put('/:id', periodosController.update);

// deletar período
router.delete('/:id', periodosController.delete);

module.exports = router;