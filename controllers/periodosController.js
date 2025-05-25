const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Buscar todos os períodos de um professor
exports.getByProfessor = async (req, res) => {
  const { id_professor } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM periodos WHERE id_professor = ? ORDER BY nome ASC',
      [id_professor]
    );
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar períodos:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Criar um novo período
exports.create = async (req, res) => {
  const { nome, id_professor } = req.body;

  if (!nome || !id_professor) {
    return res.status(400).json({ erro: 'Nome e id_professor são obrigatórios.' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO periodos (id, nome, id_professor) VALUES (?, ?, ?)',
      [id, nome, id_professor]
    );
    res.status(201).json({ id, nome, id_professor });
  } catch (err) {
    console.error('Erro ao criar período:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Atualizar um período
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'O nome é obrigatório.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE periodos SET nome = ? WHERE id = ?',
      [nome, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Período não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Período atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar período:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Deletar um período pelo ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM periodos WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Período não encontrado.' });
    }

    res.json({ mensagem: 'Período excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar período:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
