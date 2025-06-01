const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const controller = require('../controllers/professoresController');

router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: 'Autorizado', user: req.user });
});

router.get('/', authMiddleware, controller.getAll);
router.post('/', controller.create);
router.get('/id/:id', authMiddleware, controller.getById);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;