const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Buscar classes por id_periodo
exports.getByPeriodo = (req, res) => {
  const { id_periodo } = req.params;

  db.query(
    'SELECT * FROM classes WHERE id_periodo = ? ORDER BY nome ASC',
    [id_periodo],
    (err, results) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.json(results);
    }
  );
};

// Criar nova classe
exports.create = (req, res) => {
  const { nome, id_periodo } = req.body;

  if (!nome || !id_periodo) {
    return res.status(400).json({ erro: 'Nome e id_periodo são obrigatórios.' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO classes (id, nome, id_periodo) VALUES (?, ?, ?)',
    [id, nome, id_periodo],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({ id, nome, id_periodo });
    }
  );
};
