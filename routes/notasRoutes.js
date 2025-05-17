const express = require('express');
const router = express.Router();
const controller = require('../controllers/notasController');

router.post('/', controller.create);
router.get('/:id_data_nota', controller.getByDataNota);
router.put('/:id', controller.update);

module.exports = router;