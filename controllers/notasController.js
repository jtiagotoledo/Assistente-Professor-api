const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nota
exports.create = async (req, res) => {
  const { id_data_nota, id_aluno, nota } = req.body;

  if (!id_data_nota || !id_aluno || nota === undefined || isNaN(nota)) {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_data_nota, id_aluno e nota válida' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO notas (id, id_data_nota, id_aluno, nota) VALUES (?, ?, ?, ?)',
      [id, id_data_nota, id_aluno, nota]
    );
    res.status(201).json({ id, id_data_nota, id_aluno, nota });
  } catch (err) {
    console.error('Erro ao criar nota:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar notas por data
exports.getByDataNota = async (req, res) => {
  const { id_data_nota } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM notas WHERE id_data_nota = ?',
      [id_data_nota]
    );
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar notas por data:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Atualizar nota
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;

  if (nota === undefined || isNaN(nota)) {
    return res.status(400).json({ erro: 'Nota inválida' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE notas SET nota = ? WHERE id = ?',
      [nota, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Nota não encontrada' });
    }

    res.json({ mensagem: 'Nota atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar nota:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar notas por classe e data
exports.getNotasPorClasseEData = async (req, res) => {
  const { id_classe, data } = req.params;

  try {
    const [resultados] = await pool.query(
      'SELECT dn.id as id_data_nota FROM datas_nota dn WHERE dn.id_classe = ? AND dn.data = ?',
      [id_classe, data]
    );

    if (resultados.length === 0) {
      return res.status(404).json({ erro: 'Data de nota não encontrada para essa classe' });
    }

    const id_data_nota = resultados[0].id_data_nota;

    const [notas] = await pool.query(
      `SELECT n.id, n.nota, a.id as id_aluno, a.nome, a.numero 
       FROM notas n
       JOIN alunos a ON n.id_aluno = a.id
       WHERE n.id_data_nota = ?
       ORDER BY a.numero ASC`,
      [id_data_nota]
    );

    res.json(notas);
  } catch (err) {
    console.error('Erro ao buscar notas por classe e data:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar todas as notas por classe
exports.getTodasNotasPorClasse = async (req, res) => {
  const { id_classe } = req.params;

  if (!id_classe) {
    return res.status(400).json({ erro: 'Parâmetro obrigatório: id_classe' });
  }

  const sql = `
    SELECT n.id_aluno, n.nota, n.id_data_nota 
    FROM notas n
    JOIN datas_nota dn ON n.id_data_nota = dn.id
    WHERE dn.id_classe = ?
  `;

  try {
    const [results] = await pool.query(sql, [id_classe]);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar todas as notas da classe:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
