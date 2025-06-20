const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

exports.registrarAcesso = async (req, res) => {
  console.log("reg acesso", req.body);

  const { id_professor, email_professor } = req.body;

  if (!id_professor || !email_professor) {
    return res.status(400).json({ erro: 'id_professor e email_professor são obrigatórios.' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO acessos (id, id_professor, email_professor) VALUES (?, ?, ?)',
      [id, id_professor, email_professor]
    );

    res.status(201).json({ mensagem: 'Acesso registrado com sucesso.' });

  } catch (err) {
    console.error('Erro ao registrar acesso:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
