const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/login', authMiddleware, authController.login);
router.post('/refresh', authMiddleware, authController.refreshToken);
router.post('/google', authMiddleware, authController.googleLogin); 

module.exports = router;
