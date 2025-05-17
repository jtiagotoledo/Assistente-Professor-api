const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar frequência
exports.create = (req, res) => {
  const { id_data_frequencia, id_aluno, presente } = req.body;

  if (!id_data_frequencia || !id_aluno || typeof presente !== 'boolean') {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_data_frequencia, id_aluno, presente' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO frequencias (id, id_data_frequencia, id_aluno, presente) VALUES (?, ?, ?, ?)',
    [id, id_data_frequencia, id_aluno, presente],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, id_data_frequencia, id_aluno, presente });
    }
  );
};

// Buscar frequências por data
exports.getByDataFrequencia = (req, res) => {
  const { id_data_frequencia } = req.params;

  db.query(
    'SELECT * FROM frequencias WHERE id_data_frequencia = ?',
    [id_data_frequencia],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    }
  );
};


// Atualizar frequência
exports.update = (req, res) => {
  const { id } = req.params;
  const { presente } = req.body;

  if (typeof presente !== 'boolean') {
    return res.status(400).json({ erro: 'Campo "presente" deve ser booleano (true ou false)' });
  }

  db.query(
    'UPDATE frequencias SET presente = ? WHERE id = ?',
    [presente, id],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: 'Frequência atualizada com sucesso' });
    }
  );
};

exports.getFrequenciasPorClasseEData = async (req, res) => {
  const { id_classe, data } = req.params;

  try {
    const [frequencias] = await db.execute(
      `SELECT 
         f.id AS id_frequencia,
         f.presente,
         a.id AS id_aluno,
         a.nome,
         a.numero
       FROM frequencias f
       JOIN alunos a ON f.id_aluno = a.id
       JOIN datas_frequencia df ON f.id_data_frequencia = df.id
       WHERE df.id_classe = ? AND df.data = ?`,
      [id_classe, data]
    );

    res.status(200).json(frequencias);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar frequências' });
  }
};
