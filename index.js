require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('./init-db');

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Erro de conexão ao banco:', err.message);
  } else {
    console.log('Conectado ao MariaDB');
  }
});


app.get('/professores', (req, res) => {
  db.query('SELECT * FROM professores', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
