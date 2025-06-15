const pool = require('../config/db');
const generateUUID = require('../utils/uuid');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const path = require('path');
const fs = require('fs');

// Buscar professor pelo ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: 'ID é obrigatório.' });
  }

  try {
    const [results] = await pool.query('SELECT id, nome, email, foto, criado_em FROM professores WHERE id = ?', [id]);

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
    const [results] = await pool.query('SELECT id, nome, email, foto, criado_em FROM professores');
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar professores:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// criar um professor
exports.create = async (req, res) => {
  const { nome, email, senha, foto } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  const id = generateUUID()

  try {
    // Confere se já existe
    const [existente] = await pool.query('SELECT * FROM professores WHERE email = ?', [email]);
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'Email já em uso.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO professores (id, nome, email, senha, foto) VALUES (?, ?, ?, ?, ?)',
      [id, nome, email, senhaHash, foto || '']
    );

    // Gera tokens
    const professor = { id, nome, email }; // dados necessários
    const accessToken = generateAccessToken(professor);
    const refreshToken = generateRefreshToken(professor);

    res.status(201).json({ id, nome, email, foto, accessToken, refreshToken });
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
    // 1. Buscar URLs das fotos dos alunos do professor
    const [alunos] = await pool.query(`
      SELECT a.foto_url
      FROM alunos a
      JOIN classes c ON a.id_classe = c.id
      WHERE c.id_professor = ?
    `, [id]);

    // 2. Excluir fotos do sistema de arquivos
    alunos.forEach(aluno => {
      if (aluno.foto_url) {
        const nomeArquivo = aluno.foto_url.split('/').pop();
        const caminhoFoto = path.join(__dirname, '..', 'uploads', nomeArquivo);
        fs.unlink(caminhoFoto, err => {
          if (err) {
            console.warn(` Erro ao excluir foto ${nomeArquivo}:`, err.message);
          } else {
            console.log(`Foto ${nomeArquivo} excluída.`);
          }
        });
      }
    });

    // 3. Deletar o professor (e os dados relacionados por ON DELETE CASCADE no banco)
    const [result] = await pool.query('DELETE FROM professores WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    res.json({ mensagem: 'Professor e todos os dados relacionados foram excluídos com sucesso.' });
  } catch (err) {
    console.error(' Erro ao deletar professor:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

