const express = require('express');
const router = express.Router();
const controller = require('../controllers/datasFrequenciaController');
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/', authMiddleware, controller.create);
router.get('/buscar-atividade', authMiddleware, controller.getAtividadeByDataAndClasse);
router.get('/buscar-id-atividade', authMiddleware, controller.getIdAtivByDataAndClasse);
router.get('/:id_classe', authMiddleware, controller.getByClasse);
router.put('/:id', authMiddleware, controller.updateAtividade);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;