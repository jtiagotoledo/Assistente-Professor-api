const { verifyAccessToken } = require('../utils/auth');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;  // Aqui você pode ter: { id, email, ... }
    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;

