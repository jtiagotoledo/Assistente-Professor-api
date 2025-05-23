const express = require('express');
const router = express.Router();
const controller = require('../controllers/datasFrequenciaController');

router.post('/', controller.create);
router.get('/buscar-atividade', controller.getAtividadeByDataAndClasse);
router.get('/buscar-id-atividade', controller.getIdAtivByDataAndClasse);
router.get('/:id_classe', controller.getByClasse);
router.put('/:id', controller.updateAtividade);
router.delete('/:id', controller.delete);

module.exports = router;