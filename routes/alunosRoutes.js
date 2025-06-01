const express = require('express');
const router = express.Router();
const controller = require('../controllers/alunosController');
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/', authMiddleware, controller.create);                      // Criar aluno
router.get('/:id_classe', authMiddleware, controller.getByClasse);        // Buscar alunos por classe
router.put('/:id', authMiddleware, controller.update);                    // Atualizar aluno
router.delete('/:id', authMiddleware, controller.delete);                // Deletar aluno

module.exports = router;
