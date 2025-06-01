const express = require('express');
const router = express.Router();
const controller = require('../controllers/datasNotasController');
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/', authMiddleware, controller.create);
router.get('/buscar-titulo', authMiddleware, controller.getTituloByDataAndClasse);
router.get('/buscar-id-titulo', authMiddleware, controller.getIdTituloByDataAndClasse);
router.get('/:id_classe', authMiddleware, controller.getByClasse);
router.put('/:id', authMiddleware, controller.updateTitulo);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;