const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nova data de frequência
exports.create = (req, res) => {
  const { data, id_classe } = req.body;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO datas_frequencia (id, data, id_classe) VALUES (?, ?, ?)',
    [id, data, id_classe],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, data, id_classe });
    }
  );
};

// Buscar datas de frequência por classe
exports.getByClasse = (req, res) => {
  const { id_classe } = req.params;

  db.query(
    'SELECT * FROM datas_frequencia WHERE id_classe = ? ORDER BY data ASC',
    [id_classe],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    }
  );
};
