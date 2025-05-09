require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
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

// Sua rota de exemplo
app.get('/', (req, res) => {
  res.send('🔐 API com HTTPS funcionando!');
});

app.get('/professores', (req, res) => {
  db.query('SELECT * FROM professores', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
});

// Carregar os certificados SSL
const options = {
  key: fs.readFileSync('/etc/ssl/duckdns/key.pem'),
  cert: fs.readFileSync('/etc/ssl/duckdns/fullchain.pem'),
};

// Iniciar servidor HTTPS
https.createServer(options, app).listen(3000, () => {
  console.log('Servidor HTTPS rodando em https://assistente-professor.duckdns.org:3000');
});
