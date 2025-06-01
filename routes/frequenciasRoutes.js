const express = require('express');
const router = express.Router();
const controller = require('../controllers/frequenciasController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/porcentagem', authMiddleware, controller.getPorcentagemFrequencia);
router.get('/classe/:id_classe/todas', authMiddleware, controller.getTodasFrequenciasPorClasse);
router.get('/classe/:id_classe/data/:data', authMiddleware, controller.getFrequenciasPorClasseEData);
router.post('/', authMiddleware, controller.create);
router.get('/:id_data_frequencia', authMiddleware, controller.getByDataFrequencia);
router.put('/:id', authMiddleware, controller.update);

module.exports = router;