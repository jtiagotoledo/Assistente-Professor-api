const db = require('../config/db');
const generateUUID = require('../utils/uuid'); 

// Função para buscar um professor pelo UUID (uid do Firebase)
exports.getByUUID = (req, res) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res.status(400).json({ erro: 'UUID é obrigatório.' });
  }

  db.query(
    'SELECT * FROM professores WHERE uuid = ?',
    [uuid],
    (err, results) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Professor não encontrado.' });
      }

      res.json(results[0]);
    }
  );
};

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
  const { nome, email, uuid, foto } = req.body;

  console.log('nome email uuid foto', nome, email, uuid, foto)

  if (!nome || !email || !uuid) {
    return res.status(400).json({ erro: 'Nome, email e uuid são obrigatórios.' });
  }

  const id = generateUUID(); 
  console.log('id gerado: ', id);

  db.query(
    'INSERT INTO professores (id, uuid, nome, email, foto) VALUES (?, ?, ?, ?, ?)',
    [id, uuid, nome, email, foto],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      // Resposta de sucesso
      res.status(201).json({ id, uuid, nome, email, foto });
    }
  );
};
