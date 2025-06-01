const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classesController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/:id_periodo', authMiddleware, classesController.getByPeriodo);
router.post('/', authMiddleware, classesController.create);
router.put('/:id', authMiddleware, classesController.update);
router.delete('/:id', authMiddleware, classesController.delete);

module.exports = router;