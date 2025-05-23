const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nova data de nota
exports.create = (req, res) => {
  const { data, id_classe, titulo } = req.body;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO datas_nota (id, data, id_classe, titulo) VALUES (?, ?, ?, ?)',
    [id, data, id_classe, titulo || ''],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, data, id_classe, titulo: titulo || '' });
    }
  );
};

// Buscar datas de nota por classe
exports.getByClasse = (req, res) => {
  const { id_classe } = req.params;

  db.query(
    'SELECT * FROM datas_nota WHERE id_classe = ? ORDER BY data ASC',
    [id_classe],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    }
  );
};

// Buscar título por data e id_classe
exports.getTituloByDataAndClasse = (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  db.query(
    'SELECT titulo FROM datas_nota WHERE data = ? AND id_classe = ?',
    [data, id_classe],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (results.length === 0) {
        return res.status(404).json({ erro: 'Título não encontrado' });
      }
      res.json(results[0]);
    }
  );
};

exports.updateTitulo = (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: 'Campo obrigatório: titulo' });
  }

  db.query(
    'UPDATE datas_nota SET titulo = ? WHERE id = ?',
    [titulo, id],
    (err, resultado) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: 'Data de nota não encontrada' });
      }

      res.status(200).json({ mensagem: 'Título atualizado com sucesso', id, titulo });
    }
  );
};

// Buscar ID e título por data e id_classe
exports.getIdTituloByDataAndClasse = (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: data e id_classe' });
  }

  db.query(
    'SELECT id, titulo FROM datas_nota WHERE data = ? AND id_classe = ? LIMIT 1',
    [data, id_classe],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (results.length === 0) {
        return res.status(404).json({ erro: 'ID não encontrado para os parâmetros informados' });
      }

      res.json({ 
        id: results[0].id,
        titulo: results[0].titulo
      });
    }
  );
};

// Função para deletar uma data de nota pelo ID
exports.delete = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  db.query(
    'DELETE FROM datas_nota WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Data de nota não encontrada.' });
      }

      res.json({ mensagem: 'Data de nota excluída com sucesso.' });
    }
  );
};