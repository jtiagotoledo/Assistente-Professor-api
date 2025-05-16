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
const classesRoutes = require('./routes/classesRoutes');
app.use('/classes', classesRoutes);
const alunosRoutes = require('./routes/alunosRoutes');
app.use('/alunos', alunosRoutes);
const datasFrequenciaRoutes = require('./routes/datasFrequenciaRoutes');
app.use('/datas-frequencia', datasFrequenciaRoutes);
const datasNotasRoutes = require('./routes/datasNotasRoutes');
app.use('/datas-notas', datasNotasRoutes);


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
