const db = require('../config/db');
const generateUUID = require('../utils/uuid'); // sua função para gerar UUIDs

// Buscar todos os períodos de um professor
exports.getByProfessor = (req, res) => {
  const { id_professor } = req.params;

  db.query(
    'SELECT * FROM periodos WHERE id_professor = ? ORDER BY nome ASC',
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
  console.log(req.body)
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

// atualizar um período
exports.update = (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'O nome é obrigatório.' });
  }

  db.query(
    'UPDATE periodos SET nome = ? WHERE id = ?',
    [nome, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Período não encontrado.' });
      }
      res.status(200).json({ mensagem: 'Período atualizado com sucesso.' });
    }
  );
};
