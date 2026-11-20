require('dotenv').config();

const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'ok', banco: 'ok' });
  } catch (erro) {
    res.status(500).json({ api: 'ok', banco: 'erro', detalhe: erro.message });
  }
});

app.use(require('./routes/auth'));
app.use('/alunos', require('./routes/alunos'));
app.use('/cursos', require('./routes/cursos'));
app.use('/turmas', require('./routes/turmas'));
app.use('/matriculas', require('./routes/matriculas'));
app.use('/usuarios', require('./routes/usuarios'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
