const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classesController');

// Buscar todas as classes de um período
router.get('/:id_periodo', classesController.getByPeriodo);

// Criar nova classe
router.post('/', classesController.create);

// Atualizar uma classe
router.put('/:id', classesController.update);

// deletar classe
// router.delete('/:id', classesController.delete);

module.exports = router;