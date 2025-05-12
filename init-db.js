require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

(async () => {
  try {
    const sql = fs.readFileSync('schema.sql', 'utf8');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS assistente_professor');
    await connection.query('USE assistente_professor');

    await connection.query(sql);
    console.log('Banco de dados criado com sucesso!');
    await connection.end();
  } catch (err) {
    console.error('Erro ao criar o banco de dados:', err.message);
  }
})();
