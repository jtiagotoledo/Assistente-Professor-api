const express = require('express');
const router = express.Router();
const mapaSalaController = require('../controllers/mapaSalaController');
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/', authMiddleware, mapaSalaController.salvarOuAtualizar);
router.get('/:id_classe', authMiddleware, mapaSalaController.getByClasseId);

module.exports = router;