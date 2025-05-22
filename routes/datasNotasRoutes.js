const express = require('express');
const router = express.Router();
const controller = require('../controllers/datasNotasController');

router.post('/', controller.create);
router.get('/buscar-titulo', controller.getTituloByDataAndClasse);
router.get('/buscar-id-titulo', controller.getIdTituloByDataAndClasse);
router.get('/:id_classe', controller.getByClasse);
router.put('/:id', controller.updateTitulo);

module.exports = router;