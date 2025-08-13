require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('🔐 API rodando com Nginx como proxy HTTPS!');
});

// Apenas HTTP na porta interna
app.listen(3000, () => {
  console.log('Servidor Node rodando em http://localhost:3000');
});
