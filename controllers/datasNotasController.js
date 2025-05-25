const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nova data de nota
exports.create = async (req, res) => {
  const { data, id_classe, titulo } = req.body;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO datas_nota (id, data, id_classe, titulo) VALUES (?, ?, ?, ?)',
      [id, data, id_classe, titulo || '']
    );
    res.status(201).json({ id, data, id_classe, titulo: titulo || '' });
  } catch (err) {
    console.error('Erro ao criar data de nota:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar datas de nota por classe
exports.getByClasse = async (req, res) => {
  const { id_classe } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM datas_nota WHERE id_classe = ? ORDER BY data ASC',
      [id_classe]
    );
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar datas de nota:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar título por data e id_classe
exports.getTituloByDataAndClasse = async (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  try {
    const [results] = await pool.query(
      'SELECT titulo FROM datas_nota WHERE data = ? AND id_classe = ?',
      [data, id_classe]
    );

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Título não encontrado' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar título:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

exports.updateTitulo = async (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: 'Campo obrigatório: titulo' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE datas_nota SET titulo = ? WHERE id = ?',
      [titulo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Data de nota não encontrada' });
    }

    res.status(200).json({ mensagem: 'Título atualizado com sucesso', id, titulo });
  } catch (err) {
    console.error('Erro ao atualizar título:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar ID e título por data e id_classe
exports.getIdTituloByDataAndClasse = async (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: data e id_classe' });
  }

  try {
    const [results] = await pool.query(
      'SELECT id, titulo FROM datas_nota WHERE data = ? AND id_classe = ? LIMIT 1',
      [data, id_classe]
    );

    if (results.length === 0) {
      return res.status(404).json({ erro: 'ID não encontrado para os parâmetros informados' });
    }

    res.json({ id: results[0].id, titulo: results[0].titulo });
  } catch (err) {
    console.error('Erro ao buscar ID e título:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Deletar uma data de nota pelo ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM datas_nota WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Data de nota não encontrada.' });
    }

    res.json({ mensagem: 'Data de nota excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir data de nota:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
