const express = require('express');
const router = express.Router();
const controller = require('../controllers/frequenciasController');

router.post('/', controller.create);
router.get('/:id_data_frequencia', controller.getByDataFrequencia);
router.put('/:id', controller.update);

module.exports = router;