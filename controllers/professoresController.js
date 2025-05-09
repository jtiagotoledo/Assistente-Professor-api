const db = require('../config/db');
const generateUUID = require('../utils/uuid');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM professores', (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
};

exports.create = (req, res) => {
  const { nome, email } = req.body;
  const id = generateUUID();

  db.query('INSERT INTO professores (id, nome, email) VALUES (?, ?, ?)',
    [id, nome, email],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, nome, email });
    }
  );
};