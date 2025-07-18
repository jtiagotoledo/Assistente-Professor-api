const pool = require('../config/db');
const generateUUID = require('../utils/uuid');
const fs = require('fs');
const path = require('path');

// Criar aluno
exports.create = async (req, res) => {
  const { numero, nome, inativo = false, id_classe } = req.body;

  if (!numero || !nome || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: numero, nome e id_classe' });
  }

  // Converte os campos opcionais para null caso estejam vazios ou não enviados
  const media_notas = req.body.media_notas === undefined || req.body.media_notas === ''
    ? null
    : parseFloat(req.body.media_notas);

  const porc_frequencia = req.body.porc_frequencia === undefined || req.body.porc_frequencia === ''
    ? null
    : parseFloat(req.body.porc_frequencia);

  const id = generateUUID();

  // Se houver uma foto enviada, cria a URL pública
  const foto_url = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null;

  try {
    await pool.query(
      'INSERT INTO alunos (id, numero, nome, inativo, media_notas, porc_frequencia, id_classe, foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, numero, nome, inativo, media_notas, porc_frequencia, id_classe, foto_url]
    );

    res.status(201).json({ id, numero, nome, inativo, media_notas, porc_frequencia, id_classe, foto_url });
  } catch (err) {
    console.error('Erro ao criar aluno:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

exports.importarEmLote = async (req, res) => {
  const { alunos } = req.body;

  if (!Array.isArray(alunos) || alunos.length === 0) {
    return res.status(400).json({ erro: 'É necessário enviar um array com os alunos.' });
  }

  try {
    const valores = alunos.map(aluno => {
      const id = generateUUID();

      return [
        id,
        aluno.numero,
        aluno.nome,
        aluno.inativo || false,
        aluno.media_notas ?? null,
        aluno.porc_frequencia ?? null,
        aluno.id_classe,
        null // foto_url (não usamos aqui)
      ];
    });

    await pool.query(
      `INSERT INTO alunos 
        (id, numero, nome, inativo, media_notas, porc_frequencia, id_classe, foto_url) 
       VALUES ?`,
      [valores]
    );

    res.status(201).json({ mensagem: 'Alunos importados com sucesso.', quantidade: valores.length });
  } catch (err) {
    console.error('Erro ao importar alunos em lote:', err);
    res.status(500).json({ erro: 'Erro interno ao importar alunos.' });
  }
};

// Buscar alunos por classe
exports.getByClasse = async (req, res) => {
  const { id_classe } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM alunos WHERE id_classe = ? ORDER BY numero ASC',
      [id_classe]
    );

    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar alunos:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Atualizar aluno
exports.update = async (req, res) => {
  const { id } = req.params;
  const { numero, nome, inativo, media_notas, porc_frequencia, id_classe } = req.body;

  if (!numero || !nome || !id_classe) {
    return res.status(400).json({ erro: 'Campos obrigatórios: numero, nome e id_classe' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE alunos SET numero = ?, nome = ?, inativo = ?, media_notas = ?, porc_frequencia = ?, id_classe = ? WHERE id = ?`,
      [numero, nome, inativo, media_notas, porc_frequencia, id_classe, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    res.json({ mensagem: 'Aluno atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Deletar aluno pelo ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  try {
    // 1. Buscar foto_url antes de deletar o aluno
    const [rows] = await pool.query('SELECT foto_url FROM alunos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    const foto_url = rows[0].foto_url;

    // 2. Deletar o aluno
    const [result] = await pool.query('DELETE FROM alunos WHERE id = ?', [id]);

    // 3. Excluir foto do disco, se existir
    if (foto_url) {
      const nomeArquivo = foto_url.split('/').pop(); // ex: 'resized-123.jpg'
      const caminhoFoto = path.join(__dirname, '..', 'uploads', nomeArquivo);

      fs.unlink(caminhoFoto, (err) => {
        if (err) {
          console.warn('⚠️ Erro ao excluir foto:', err.message);
        } else {
          console.log('🗑️ Foto excluída com sucesso:', nomeArquivo);
        }
      });
    }

    res.json({ mensagem: 'Aluno excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir aluno:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
