const db = require('../config/db');
const generateUUID = require('../utils/uuid'); // Função que gera UUID

exports.create = (req, res) => {
  const { nome, email } = req.body;

  // Validação básica
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios.' });
  }

  // Gerar UUID para o novo professor
  const id = generateUUID(); 

  // Inserir no banco de dados
  db.query(
    'INSERT INTO professores (id, nome, email) VALUES (?, ?, ?)',
    [id, nome, email],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({ id, nome, email });
    }
  );
};
