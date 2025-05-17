const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nota
exports.create = (req, res) => {
  const { id_data_nota, id_aluno, valor } = req.body;

  if (!id_data_nota || !id_aluno || valor === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_data_nota, id_aluno, valor' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO notas (id, id_data_nota, id_aluno, valor) VALUES (?, ?, ?, ?)',
    [id, id_data_nota, id_aluno, valor],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, id_data_nota, id_aluno, valor });
    }
  );
};

// Buscar notas por data
exports.getByDataNota = (req, res) => {
  const { id_data_nota } = req.params;

  db.query(
    'SELECT * FROM notas WHERE id_data_nota = ?',
    [id_data_nota],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    }
  );
};
