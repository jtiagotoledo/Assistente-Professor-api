const db = require('../config/db');
const generateUUID = require('../utils/uuid'); // sua função para gerar UUIDs

// Buscar todos os períodos de um professor
exports.getByProfessor = (req, res) => {
  const { id_professor } = req.params;

  db.query(
    'SELECT * FROM periodos WHERE id_professor = ?',
    [id_professor],
    (err, results) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.json(results);
    }
  );
};

// Criar um novo período
exports.create = (req, res) => {
  const { nome, id_professor } = req.body;

  if (!nome || !id_professor) {
    return res.status(400).json({ erro: 'Nome e id_professor são obrigatórios.' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO periodos (id, nome, id_professor) VALUES (?, ?, ?)',
    [id, nome, id_professor],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({ id, nome, id_professor });
    }
  );
};
