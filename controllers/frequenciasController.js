const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar frequência
exports.create = (req, res) => {
  const { id_data_frequencia, id_aluno, presente } = req.body;

  if (!id_data_frequencia || !id_aluno || typeof presente !== 'boolean') {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_data_frequencia, id_aluno, presente' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO frequencias (id, id_data_frequencia, id_aluno, presente) VALUES (?, ?, ?, ?)',
    [id, id_data_frequencia, id_aluno, presente],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, id_data_frequencia, id_aluno, presente });
    }
  );
};

// Buscar frequências por data
exports.getByDataFrequencia = (req, res) => {
  const { id_data_frequencia } = req.params;

  db.query(
    'SELECT * FROM frequencias WHERE id_data_frequencia = ?',
    [id_data_frequencia],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    }
  );
};
