const express = require('express');
const router = express.Router();
const controller = require('../controllers/alunosController');
const authMiddleware = require('../middlewares/authmiddleware');
const upload = require('../utils/upload');
const resizeImage = require('../utils/resizeImage');

router.post('/', authMiddleware, upload.single('foto'), resizeImage, controller.create);
router.post('/importar', authMiddleware, controller.importarEmLote);
router.get('/:id_classe', authMiddleware, controller.getByClasse);
router.put('/:id', authMiddleware, controller.update);
router.put('/:id/foto', authMiddleware, upload.single('foto'), resizeImage, controller.updateFoto);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;
