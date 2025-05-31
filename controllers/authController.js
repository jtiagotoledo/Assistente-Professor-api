const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  const { refreshToken } = req.body;  

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

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  console.log('idToken',idToken);
  

  if (!idToken) {
    return res.status(400).json({ erro: 'ID Token é obrigatório.' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const nome = payload.name;
    const foto = payload.picture;

    // Verifica se professor já existe
    const [results] = await pool.query('SELECT * FROM professores WHERE email = ?', [email]);

    let professor;

    if (results.length === 0) {
      const id = uuidv4();
      const senha = 'GOOGLE_AUTH';

      await pool.query(
        'INSERT INTO professores (id, email, nome, senha, foto) VALUES (?, ?, ?, ?, ?)',
        [id, email, nome, senha, foto]
      );

      professor = { id, email, nome, foto };
    } else {
      professor = results[0];
    }

    // Geração dos tokens
    const accessToken = generateAccessToken({ id: professor.id, email: professor.email });
    const refreshToken = generateRefreshToken({ id: professor.id, email: professor.email });

    res.json({ accessToken, refreshToken, professor });
  } catch (err) {
    console.error('Erro na autenticação Google:', err);
    res.status(401).json({ erro: 'Token Google inválido.' });
  }
};