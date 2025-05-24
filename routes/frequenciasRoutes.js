const express = require('express');
const router = express.Router();
const controller = require('../controllers/frequenciasController');

router.get('/porcentagem', controller.getPorcentagemFrequencia);
router.get('/classe/:id_classe/todas', controller.getTodasFrequenciasPorClasse);
router.get('/classe/:id_classe/data/:data', controller.getFrequenciasPorClasseEData);
router.post('/', controller.create);
router.get('/:id_data_frequencia', controller.getByDataFrequencia);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;