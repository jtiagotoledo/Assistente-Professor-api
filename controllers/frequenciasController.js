const pool = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar frequência
exports.create = async (req, res) => {
  const { id_data_frequencia, id_aluno, presente } = req.body;

  if (!id_data_frequencia || !id_aluno || typeof presente !== 'boolean') {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_data_frequencia, id_aluno, presente' });
  }

  const id = generateUUID();

  try {
    await pool.query(
      'INSERT INTO frequencias (id, id_data_frequencia, id_aluno, presente) VALUES (?, ?, ?, ?)',
      [id, id_data_frequencia, id_aluno, presente]
    );
    res.status(201).json({ id, id_data_frequencia, id_aluno, presente });
  } catch (err) {
    console.error('Erro ao criar frequência:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar frequências por data
exports.getByDataFrequencia = async (req, res) => {
  const { id_data_frequencia } = req.params;

  try {
    const [results] = await pool.query(
      'SELECT * FROM frequencias WHERE id_data_frequencia = ?',
      [id_data_frequencia]
    );
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar frequências:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Atualizar frequência
exports.update = async (req, res) => {
  const { id } = req.params;
  const { presente } = req.body;

  if (typeof presente !== 'boolean') {
    return res.status(400).json({ erro: 'Campo "presente" deve ser booleano (true ou false)' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE frequencias SET presente = ? WHERE id = ?',
      [presente, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Frequência não encontrada' });
    }

    res.json({ mensagem: 'Frequência atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar frequência:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar frequências por classe e data
exports.getFrequenciasPorClasseEData = async (req, res) => {
  const { id_classe, data } = req.params;

  try {
    const [resultados] = await pool.query(
      'SELECT df.id as id_data_frequencia FROM datas_frequencia df WHERE df.id_classe = ? AND df.data = ?',
      [id_classe, data]
    );

    if (resultados.length === 0) {
      return res.status(404).json({ erro: 'Data de frequência não encontrada para essa classe' });
    }

    const id_data_frequencia = resultados[0].id_data_frequencia;

    const [frequencias] = await pool.query(
      `SELECT f.id, f.presente, a.id as id_aluno, a.nome, a.numero 
       FROM frequencias f
       JOIN alunos a ON f.id_aluno = a.id
       WHERE f.id_data_frequencia = ?
       ORDER BY a.numero ASC`,
      [id_data_frequencia]
    );

    res.json(frequencias);
  } catch (err) {
    console.error('Erro ao buscar frequências por classe e data:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Calcular porcentagem de frequência do aluno em uma classe
exports.getPorcentagemFrequencia = async (req, res) => {
  const { id_aluno, id_classe } = req.query;

  if (!id_aluno || !id_classe) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios: id_aluno e id_classe' });
  }

  try {
    // Total de datas da classe
    const [result1] = await pool.query(
      'SELECT COUNT(*) AS total_datas FROM datas_frequencia WHERE id_classe = ?',
      [id_classe]
    );

    const total_datas = result1[0].total_datas;

    if (total_datas === 0) {
      return res.json({ porcentagem: 0 });
    }

    // Total de presenças do aluno nesta classe
    const [result2] = await pool.query(
      `SELECT COUNT(*) AS total_presencas 
       FROM frequencias 
       WHERE presente = TRUE
       AND id_aluno = ? 
       AND id_data_frequencia IN (
         SELECT id FROM datas_frequencia WHERE id_classe = ?
       )`,
      [id_aluno, id_classe]
    );

    const total_presencas = result2[0].total_presencas;
    const porcentagem = ((total_presencas / total_datas) * 100).toFixed(2);

    res.json({ porcentagem: Number(porcentagem) });
  } catch (err) {
    console.error('Erro ao calcular porcentagem de frequência:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// Buscar todas as frequências por classe
exports.getTodasFrequenciasPorClasse = async (req, res) => {
  const { id_classe } = req.params;

  if (!id_classe) {
    return res.status(400).json({ erro: 'Parâmetro obrigatório: id_classe' });
  }

  const sql = `
    SELECT f.id_aluno, f.presente, f.id_data_frequencia 
    FROM frequencias f
    JOIN datas_frequencia df ON f.id_data_frequencia = df.id
    WHERE df.id_classe = ?
  `;

  try {
    const [results] = await pool.query(sql, [id_classe]);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar todas as frequências por classe:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
