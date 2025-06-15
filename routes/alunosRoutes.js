const express = require('express');
const router = express.Router();
const controller = require('../controllers/alunosController');
const authMiddleware = require('../middlewares/authmiddleware');
const upload = require('../utils/upload');

router.post('/', authMiddleware, upload.single('foto'), resizeImage, controller.create);
router.get('/:id_classe', authMiddleware, controller.getByClasse);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;
