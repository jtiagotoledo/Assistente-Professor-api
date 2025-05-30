const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM professores WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const professor = results[0];

    const senhaValida = await bcrypt.compare(senha, professor.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const accessToken = generateAccessToken(professor);
    const refreshToken = generateRefreshToken(professor);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;  // alterar aqui

  if (!refreshToken) {
    return res.status(401).json({ erro: 'Token de atualização é obrigatório.' });
  }

  const jwt = require('jsonwebtoken');

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, professor) => {  // usar refreshToken aqui também
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }

    const newAccessToken = generateAccessToken(professor);
    res.json({ accessToken: newAccessToken });
  });
};
