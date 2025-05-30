const express = require('express');
const router = express.Router();
const controller = require('../controllers/professoresController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/id/:id', controller.getById);
router.delete('/:id', controller.delete);

module.exports = router;