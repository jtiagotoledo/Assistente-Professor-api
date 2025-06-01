const express = require('express');
const router = express.Router();
const controller = require('../controllers/notasController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/classe/:id_classe/todas', authMiddleware, controller.getTodasNotasPorClasse);
router.post('/', authMiddleware, controller.create);
router.get('/:id_data_nota', authMiddleware, controller.getByDataNota);
router.put('/:id', authMiddleware, controller.update);
router.get('/classe/:id_classe/data/:data', authMiddleware, controller.getNotasPorClasseEData)

module.exports = router;