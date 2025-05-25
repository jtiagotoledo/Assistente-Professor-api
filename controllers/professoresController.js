const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Buscar professor pelo UUID do Firebase
exports.getByUUID = async (req, res) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res.status(400).json({ erro: 'UUID é obrigatório.' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM professores WHERE uuid = ?', [uuid]);

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar professor:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Obter todos os professores
exports.getAll = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM professores');
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar professores:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Criar novo professor
exports.create = async (req, res) => {
  const { nome, email, uuid, foto } = req.body;

  if (!nome || !email || !uuid) {
    return res.status(400).json({ erro: 'Nome, email e uuid são obrigatórios.' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO professores (id, uuid, nome, email, foto) VALUES (?, ?, ?, ?, ?)',
      [id, uuid, nome, email, foto]
    );

    res.status(201).json({ id, uuid, nome, email, foto });
  } catch (err) {
    console.error('Erro ao criar professor:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Excluir professor pelo ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID do professor é obrigatório.' });
  }

  try {
    const [result] = await pool.query('DELETE FROM professores WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    res.json({ mensagem: 'Professor e todos os dados relacionados foram excluídos com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar professor:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
