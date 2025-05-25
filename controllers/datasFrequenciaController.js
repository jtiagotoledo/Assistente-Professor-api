const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nova data de frequência
exports.create = async (req, res) => {
  const { data, id_classe, atividade } = req.body;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  const id = generateUUID();
  const atividadeFinal = atividade || '';

  try {
    await pool.query(
      'INSERT INTO datas_frequencia (id, data, id_classe, atividade) VALUES (?, ?, ?, ?)',
      [id, data, id_classe, atividadeFinal]
    );

    res.status(201).json({ id, data, id_classe, atividade: atividadeFinal });
  } catch (err) {
    console.error('Erro ao criar data de frequência:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar datas de frequência por classe
exports.getByClasse = async (req, res) => {
  const { id_classe } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM datas_frequencia WHERE id_classe = ? ORDER BY data ASC',
      [id_classe]
    );

    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar datas de frequência:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar atividade por data e id_classe
exports.getAtividadeByDataAndClasse = async (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: data e id_classe' });
  }

  try {
    const [results] = await pool.query(
      'SELECT atividade FROM datas_frequencia WHERE data = ? AND id_classe = ? LIMIT 1',
      [data, id_classe]
    );

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Atividade não encontrada' });
    }

    res.json({ atividade: results[0].atividade });
  } catch (err) {
    console.error('Erro ao buscar atividade:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Atualizar atividade
exports.updateAtividade = async (req, res) => {
  const { id } = req.params;
  const { atividade } = req.body;

  if (!atividade) {
    return res.status(400).json({ erro: 'Campo obrigatório: atividade' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE datas_frequencia SET atividade = ? WHERE id = ?',
      [atividade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Data de frequência não encontrada' });
    }

    res.status(200).json({ mensagem: 'Atividade atualizada com sucesso', id, atividade });
  } catch (err) {
    console.error('Erro ao atualizar atividade:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar ID por data e id_classe
exports.getIdAtivByDataAndClasse = async (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: data e id_classe' });
  }

  try {
    const [results] = await pool.query(
      'SELECT id, atividade FROM datas_frequencia WHERE data = ? AND id_classe = ? LIMIT 1',
      [data, id_classe]
    );

    if (results.length === 0) {
      return res.status(404).json({ erro: 'ID não encontrado para os parâmetros informados' });
    }

    res.json({ id: results[0].id, atividade: results[0].atividade });
  } catch (err) {
    console.error('Erro ao buscar ID:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Deletar uma data de frequência pelo ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM datas_frequencia WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Data de frequência não encontrada.' });
    }

    res.json({ mensagem: 'Data de frequência excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir data de frequência:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
