require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();
const db = require('./config/db');

require('./init-db');

app.use(cors());
app.use(express.json());

// Rotas
const professoresRoutes = require('./routes/professoresRoutes');
app.use('/professores', professoresRoutes);
const acessosRoutes = require('./routes/acessosRoutes');
app.use('/professores/acesso', acessosRoutes);
const periodosRoutes = require('./routes/periodosRoutes');
app.use('/periodos', periodosRoutes);

app.get('/', (req, res) => {
  res.send('🔐 API com HTTPS funcionando!');
});

// Certificados SSL
const options = {
  key: fs.readFileSync('/etc/ssl/duckdns/key.pem'),
  cert: fs.readFileSync('/etc/ssl/duckdns/fullchain.pem'),
};

// Iniciar servidor HTTPS
https.createServer(options, app).listen(3000, () => {
  console.log('Servidor rodando em https://assistente-professor.duckdns.org:3000');
});
