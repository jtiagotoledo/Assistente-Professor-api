const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Buscar classes por id_periodo
exports.getByPeriodo = async (req, res) => {
  const { id_periodo } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM classes WHERE id_periodo = ? ORDER BY nome ASC',
      [id_periodo]
    );

    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar classes:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Criar nova classe
exports.create = async (req, res) => {
  const { nome, id_periodo } = req.body;

  if (!nome || !id_periodo) {
    return res.status(400).json({ erro: 'Nome e id_periodo são obrigatórios.' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO classes (id, nome, id_periodo) VALUES (?, ?, ?)',
      [id, nome, id_periodo]
    );

    res.status(201).json({ id, nome, id_periodo });
  } catch (err) {
    console.error('Erro ao criar classe:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Atualizar uma classe
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, id_periodo } = req.body;

  if (!nome || !id_periodo) {
    return res.status(400).json({ erro: 'Nome e id_periodo são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE classes SET nome = ?, id_periodo = ? WHERE id = ?',
      [nome, id_periodo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Classe não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Classe atualizada com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar classe:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Deletar uma classe pelo ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM classes WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Classe não encontrada.' });
    }

    res.json({ mensagem: 'Classe excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir classe:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
