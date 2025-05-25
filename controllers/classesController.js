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

// Atualizar uma classe
exports.update = (req, res) => {
  const { id } = req.params; 
  const { nome, id_periodo } = req.body; 

  if (!nome || !id_periodo) {
    return res.status(400).json({ erro: 'Nome e id_periodo são obrigatórios.' });
  }

  db.query(
    'UPDATE classes SET nome = ?, id_periodo = ? WHERE id = ?',
    [nome, id_periodo, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Classe não encontrada.' });
      }

      res.status(200).json({ mensagem: 'Classe atualizada com sucesso.' });
    }
  );
};

// Função para deletar uma classe pelo ID
exports.delete = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  db.query(
    'DELETE FROM classes WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Classe não encontrada.' });
      }

      res.json({ mensagem: 'Classe excluída com sucesso.' });
    }
  );
};

// Função para deletar um período pelo ID
exports.delete = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  db.query(
    'DELETE FROM periodos WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Período não encontrado.' });
      }

      res.json({ mensagem: 'Período excluído com sucesso.' });
    }
  );
};
