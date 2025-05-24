const express = require('express');
const router = express.Router();
const controller = require('../controllers/professoresController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/uuid/:uuid', controller.getByUUID);
router.delete('/:id', controller.delete);

module.exports = router;