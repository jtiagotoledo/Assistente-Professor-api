const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { v4: uuidv4 } = require('uuid');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const nodemailer = require('nodemailer');

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

    // Apenas dados necessários no token
    const userPayload = {
      id: professor.id,
      nome: professor.nome,
      email: professor.email,
    };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    res.json({
      accessToken,
      refreshToken,
      id: professor.id,
      nome: professor.nome,
      email: professor.email
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ erro: 'Refresh token não fornecido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userPayload = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
    };

    const accessToken = generateAccessToken(userPayload);

    res.json({ accessToken });
  } catch (err) {
    console.error('Erro ao renovar token:', err);
    res.status(403).json({ erro: 'Refresh token inválido ou expirado' });
  }
};

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

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

    const [results] = await pool.query('SELECT * FROM professores WHERE email = ?', [email]);

    let professor;

    if (results.length === 0) {
      const id = uuidv4();
      const senha = 'GOOGLE_AUTH'; // Senha dummy

      await pool.query(
        'INSERT INTO professores (id, email, nome, senha, foto) VALUES (?, ?, ?, ?, ?)',
        [id, email, nome, senha, foto]
      );

      professor = { id, email, nome, foto };
    } else {
      professor = results[0];
    }

    const userPayload = {
      id: professor.id,
      nome: professor.nome,
      email: professor.email,
    };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    res.json({ accessToken, refreshToken, professor: userPayload });
  } catch (err) {
    console.error('Erro na autenticação Google:', err);
    res.status(401).json({ erro: 'Token Google inválido.' });
  }
};

exports.esqueciSenha = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: 'Email é obrigatório.' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM professores WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Email não encontrado.' });
    }

    const professor = results[0];

    const token = jwt.sign(
      { id: professor.id, email: professor.email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: '15m' } // token válido por 15 minutos
    );

    const link = `${process.env.FRONTEND_URL}/redefinir-senha/${token}`;

    // Configure o transporter (exemplo com Gmail e senha de app)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Assistente do Professor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Redefinição de senha',
      html: `
        <p>Olá, ${professor.nome}!</p>
        <p>Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova:</p>
        <a href="${link}" style="color: #1a73e8; text-decoration: underline;">Clique aqui para redefinir sua senha</a>
        <p>Este link expira em 15 minutos.</p>
      `,
    });

    res.json({ mensagem: 'Email de redefinição enviado com sucesso.' });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ erro: 'Erro ao enviar email.' });
  }
};
