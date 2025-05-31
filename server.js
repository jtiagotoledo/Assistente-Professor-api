require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();

require('./init-db');

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', require('./routes/authRoutes'));
app.use('/professores', require('./routes/professoresRoutes'));
app.use('/professores/acesso', require('./routes/acessosRoutes'));
app.use('/periodos', require('./routes/periodosRoutes'));
app.use('/classes', require('./routes/classesRoutes'));
app.use('/alunos', require('./routes/alunosRoutes'));
app.use('/datas-frequencia', require('./routes/datasFrequenciaRoutes'));
app.use('/datas-notas', require('./routes/datasNotasRoutes'));
app.use('/frequencias', require('./routes/frequenciasRoutes'));
app.use('/notas', require('./routes/notasRoutes'));


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
