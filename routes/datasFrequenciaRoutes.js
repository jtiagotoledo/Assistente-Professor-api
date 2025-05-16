const express = require('express');
const router = express.Router();
const controller = require('../controllers/datasFrequenciaController');

router.post('/', controller.create);
router.get('/:id_classe', controller.getByClasse);

module.exports = router;