const db = require('../config/db');
const generateUUID = require('../utils/uuid'); // Importar a função para gerar UUID

// Função para obter todos os professores
exports.getAll = (req, res) => {
  db.query('SELECT * FROM professores', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
};

// Função para criar um novo professor
exports.create = (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios.' });
  }

  const id = generateUUID(); // Gerar UUID para o novo professor

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
