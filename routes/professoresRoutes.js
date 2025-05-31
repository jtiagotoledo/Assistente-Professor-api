const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const controller = require('../controllers/professoresController');

// Rota para pegar os dados do professor autenticado
router.get('/me', authMiddleware, (req, res) => {
  // Aqui você pode retornar as infos que tem no token (req.user)
  // Ou buscar no banco se quiser mais dados
  res.json({ message: 'Autorizado', user: req.user });
});

// Rotas protegidas (exigem token)
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/id/:id', controller.getById);
router.delete('/:id', controller.delete);

module.exports = router;