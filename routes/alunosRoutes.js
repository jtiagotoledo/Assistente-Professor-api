const express = require('express');
const router = express.Router();
const controller = require('../controllers/alunosController');

router.post('/', controller.create);                      // Criar aluno
router.get('/:id_classe', controller.getByClasse);        // Buscar alunos por classe
router.put('/:id', controller.update);                    // Atualizar aluno
router.delete('/:id', controller.delete);                // Deletar aluno

module.exports = router;
