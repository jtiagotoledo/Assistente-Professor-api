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

// Buscar frequências por classe e data
exports.getFrequenciasPorClasseEData = (req, res) => {
  const { id_classe, data } = req.params;

  console.log('Classe:', id_classe);
  console.log('Data:', data);

  db.query(
    'SELECT df.id as id_data_frequencia FROM datas_frequencia df WHERE df.id_classe = ? AND df.data = ?',
    [id_classe, data],
    (err, resultados) => {
      if (err) {
        console.error('Erro ao buscar data_frequencia:', err);
        return res.status(500).json({ erro: err.message });
      }

      console.log('Resultado da busca em datas_frequencia:', resultados);

      if (resultados.length === 0) {
        return res.status(404).json({ erro: 'Data de frequência não encontrada para essa classe' });
      }

      const id_data_frequencia = resultados[0].id_data_frequencia;
      console.log('ID da data_frequencia:', id_data_frequencia);

      db.query(
        `SELECT f.id, f.presente, a.id as id_aluno, a.nome, a.numero 
         FROM frequencias f
         JOIN alunos a ON f.id_aluno = a.id
         WHERE f.id_data_frequencia = ?
         ORDER BY a.numero ASC`,
        [id_data_frequencia],
        (err, frequencias) => {
          if (err) {
            console.error('Erro ao buscar frequencias:', err);
            return res.status(500).json({ erro: err.message });
          }

          console.log('Resultado da busca em frequencias:', frequencias);
          res.json(frequencias);
        }
      );
    }
  );
};

