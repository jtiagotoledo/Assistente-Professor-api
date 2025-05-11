const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Registrar um novo acesso (id e email do professor vêm na requisição)
exports.registrarAcesso = (req, res) => {
  const { id_professor, email_professor } = req.body;

  if (!id_professor || !email_professor) {
    return res.status(400).json({ erro: 'id_professor e email_professor são obrigatórios.' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO acessos (id, id_professor, email_professor) VALUES (?, ?, ?)',
    [id, id_professor, email_professor],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({ mensagem: 'Acesso registrado com sucesso.' });
    }
  );
};
