const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar aluno
exports.create = (req, res) => {
  const { numero, nome, inativo = false, media_notas, porc_frequencia, id_classe } = req.body;

  if (!numero || !nome || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: numero, nome e id_classe' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO alunos (id, numero, nome, inativo, media_notas, porc_frequencia, id_classe) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, numero, nome, inativo, media_notas, porc_frequencia, id_classe],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, numero, nome, inativo, media_notas, porc_frequencia, id_classe });
    }
  );
};

// Buscar alunos por classe
exports.getByClasse = (req, res) => {
  const { id_classe } = req.params;

  db.query('SELECT * FROM alunos WHERE id_classe = ? ORDER BY numero ASC', [id_classe], (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
};

// Atualizar aluno
exports.update = (req, res) => {
  const { id } = req.params;
  const { numero, nome, inativo, media_notas, porc_frequencia, id_classe } = req.body;

  db.query(
    `UPDATE alunos SET numero = ?, nome = ?, inativo = ?, media_notas = ?, porc_frequencia = ?, id_classe = ? WHERE id = ?`,
    [numero, nome, inativo, media_notas, porc_frequencia, id_classe, id],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: 'Aluno atualizado com sucesso' });
    }
  );
};

// Função para deletar um aluno pelo ID
exports.delete = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  db.query(
    'DELETE FROM alunos WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Aluno não encontrado.' });
      }

      res.json({ mensagem: 'Aluno excluído com sucesso.' });
    }
  );
};
