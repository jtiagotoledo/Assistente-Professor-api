const express = require('express');
const router = express.Router();
const controller = require('../controllers/notasController');

router.get('/classe/:id_classe/todas', controller.getTodasNotasPorClasse);
router.post('/', controller.create);
router.get('/:id_data_nota', controller.getByDataNota);
router.put('/:id', controller.update);
router.get('/classe/:id_classe/data/:data', controller.getNotasPorClasseEData)

module.exports = router;