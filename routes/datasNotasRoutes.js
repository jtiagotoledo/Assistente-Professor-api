const express = require('express');
const router = express.Router();
const controller = require('../controllers/datasNotasController');

router.post('/', controller.create);
router.get('/:id_classe', controller.getByClasse);
router.get('/buscar/titulo', controller.getTituloByDataAndClasse);

module.exports = router;