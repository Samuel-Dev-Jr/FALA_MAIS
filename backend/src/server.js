// Carrega o .env antes de tudo, para o db.js já encontrar as variáveis.
require('dotenv').config();

const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Verifica se a API e o banco estão respondendo.
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'ok', banco: 'ok' });
  } catch (erro) {
    res.status(500).json({ api: 'ok', banco: 'erro', detalhe: erro.message });
  }
});

// Adicione aqui as rotas do projeto.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
