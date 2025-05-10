const db = require('../config/db');
const generateUUID = require('../utils/uuid'); // Importar a função para gerar UUID

// Função para obter todos os professores
exports.getAll = (req, res) => {
  db.query('SELECT * FROM professores', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
};

// Função para criar um novo professor
exports.create = (req, res) => {
  const { nome, email, uuid, foto } = req.body;

  console.log('nome email uuid foto', nome, email, uuid, foto)

  // Verificar se todos os campos obrigatórios estão presentes
  if (!nome || !email || !uuid) {
    return res.status(400).json({ erro: 'Nome, email e uuid são obrigatórios.' });
  }

  // Verificar se o professor já existe com esse UUID
  db.query('SELECT * FROM professores WHERE uuid = ?', [uuid], (err, results) => {
    if (err) {
      console.log('err consilta professor', err.message);
      
      return res.status(500).json({ erro: err.message });
    }

    // Se o professor já existe, retorna um erro
    if (results.length > 0) {
      console.log('resultados', results);

      return res.status(400).json({ erro: 'Professor já existe.' });
    }

    // Gerar um novo ID para o professor (ID do banco de dados)
    const id = generateUUID(); // Gerar UUID para o novo professor
    console.log('id gerado: ', id);

    // Inserir o novo professor no banco de dados
    db.query(
      'INSERT INTO professores (id, uuid, nome, email, foto) VALUES (?, ?, ?, ?, ?)',
      [id, uuid, nome, email, foto],
      (err) => {
        if (err) {
          return res.status(500).json({ erro: err.message });
        }

        // Resposta de sucesso
        res.status(201).json({ id, uuid, nome, email, foto });
      }
    );
  });
};
