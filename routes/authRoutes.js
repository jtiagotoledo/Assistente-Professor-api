const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);       
router.post('/refresh', authController.refreshToken);  
router.post('/google', authController.googleLogin); 
router.post('/esqueci-senha', authController.esqueciSenha);   
router.get('/redefinir-senha', authController.redirecionarRedefinicaoSenha);
router.post('/redefinir-senha', authController.redefinirSenha);

module.exports = router;