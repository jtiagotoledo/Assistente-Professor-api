const db = require('../config/db');
const generateUUID = require('../utils/uuid');

// Criar nota
exports.create = (req, res) => {
  const { id_data_nota, id_aluno, nota } = req.body;
  console.log('req.body criar nota', req.body);


  if (!id_data_nota || !id_aluno || nota === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_data_nota, id_aluno, valor' });
  }

  const id = generateUUID();

  db.query(
    'INSERT INTO notas (id, id_data_nota, id_aluno, nota) VALUES (?, ?, ?, ?)',
    [id, id_data_nota, id_aluno, nota],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id, id_data_nota, id_aluno, nota });
    }
  );
};

// Buscar notas por data
exports.getByDataNota = (req, res) => {
  const { id_data_nota } = req.params;

  db.query(
    'SELECT * FROM notas WHERE id_data_nota = ?',
    [id_data_nota],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    }
  );
};

// Atualizar nota
exports.update = (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;

  if (nota === undefined || isNaN(nota)) {
    return res.status(400).json({ erro: 'Nota inválida' });
  }

  db.query(
    'UPDATE notas SET nota = ? WHERE id = ?',
    [nota, id],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: 'Nota atualizada com sucesso' });
    }
  );
};

// Buscar notas por classe e data
exports.getNotasPorClasseEData = (req, res) => {
  const { id_classe, data } = req.params;

  console.log('Classe:', id_classe);
  console.log('Data:', data);

  db.query(
    'SELECT dn.id as id_data_nota FROM datas_nota dn WHERE dn.id_classe = ? AND dn.data = ?',
    [id_classe, data],
    (err, resultados) => {
      if (err) {
        console.error('Erro ao buscar data_nota:', err);
        return res.status(500).json({ erro: err.message });
      }

      console.log('Resultado da busca em datas_nota:', resultados);

      if (resultados.length === 0) {
        return res.status(404).json({ erro: 'Data de nota não encontrada para essa classe' });
      }

      const id_data_nota = resultados[0].id_data_nota;
      console.log('ID da data_nota:', id_data_nota);

      db.query(
        `SELECT n.id, n.nota, a.id as id_aluno, a.nome, a.numero 
         FROM notas n
         JOIN alunos a ON n.id_aluno = a.id
         WHERE n.id_data_nota = ?
         ORDER BY a.numero ASC`,
        [id_data_nota],
        (err, notas) => {
          if (err) {
            console.error('Erro ao buscar notas:', err);
            return res.status(500).json({ erro: err.message });
          }

          console.log('Resultado da busca em notas:', notas);
          res.json(notas);
        }
      );
    }
  );
};

// Buscar todas as notas por classe
exports.getNotasPorClasse = async (req, res) => {
  const { id_classe } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT n.id_aluno, n.nota
       FROM notas n
       INNER JOIN datas_nota dn ON n.id_data_nota = dn.id
       WHERE dn.id_classe = ?`,
      [id_classe]
    );

    res.json(rows);
  } catch (erro) {
    console.error('Erro ao buscar notas da classe:', erro);
    res.status(500).json({ erro: 'Erro ao buscar notas da classe.' });
  }
};