const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nova data de frequência
exports.create = (req, res) => {
  const { data, id_classe, atividade } = req.body;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: data e id_classe' });
  }

  const id = generateUUID();
  const atividadeFinal = atividade || ''; // usa string vazia se não for enviada

  db.query(
    'INSERT INTO datas_frequencia (id, data, id_classe, atividade) VALUES (?, ?, ?, ?)',
    [id, data, id_classe, atividadeFinal],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, data, id_classe, atividade: atividadeFinal });
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

// Buscar atividade por data e id_classe
exports.getAtividadeByDataAndClasse = (req, res) => {
  const { data, id_classe } = req.query;

  if (!data || !id_classe) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: data e id_classe' });
  }

  db.query(
    'SELECT atividade FROM datas_frequencia WHERE data = ? AND id_classe = ? LIMIT 1',
    [data, id_classe],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Atividade não encontrada' });
      }

      res.json({ atividade: results[0].atividade });
    }
  );
};

exports.updateAtividade = (req, res) => {
  const { id } = req.params;
  const { atividade } = req.body;

  try {
    const [resultado] = db.query(
      'UPDATE datas_frequencia SET atividade = ? WHERE id = ?',
      [atividade, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Data de frequência não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Atividade atualizada com sucesso.' });
  } catch (erro) {
    console.error('Erro ao atualizar atividade:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar atividade.' });
  }
};


