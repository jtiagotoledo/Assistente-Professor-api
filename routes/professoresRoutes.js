const express = require('express');
const router = express.Router();
const controller = require('../controllers/professoresController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/uuid/:uuid', professorController.getByUUID);

module.exports = router;