// =====================================================
// ROTAS DE CURSOS (tabela cursos)
// =====================================================
// Opcional para a entrega (o obrigatório está em alunos.js).
// Quem pode usar: listar → secretaria e coordenação (a secretaria precisa
// da lista para criar turmas). Cadastrar → só coordenação.
// No server.js: app.use('/cursos', require('./routes/cursos'));
//
// -----------------------------------------------------
// GET /cursos  →  lista os cursos
// -----------------------------------------------------
// Lógica:
//   1. Faço um SELECT em cursos, ordenando por idioma e nível.
//   2. Devolvo a lista em JSON.
//
// SQL:
//   SELECT id, idioma, nivel, carga_horaria FROM cursos ORDER BY idioma, nivel
//
// Resposta (exemplo):
//   [ { "id": 4, "idioma": "Espanhol", "nivel": "Básico 1", "carga_horaria": 60 },
//     { "id": 1, "idioma": "Inglês", "nivel": "Básico 1", "carga_horaria": 60 } ]
//
// -----------------------------------------------------
// POST /cursos  →  cadastra um curso
// -----------------------------------------------------
// Corpo (exemplo):
//   { "idioma": "Inglês", "nivel": "Avançado 1", "carga_horaria": 80 }
//
// Lógica:
//   1. Pego idioma, nivel e carga_horaria de req.body.
//   2. Se faltar algum, devolvo 400.
//   3. Faço o INSERT com ?.
//   4. Devolvo 201 com o id novo.
//
// SQL:
//   INSERT INTO cursos (idioma, nivel, carga_horaria) VALUES (?, ?, ?)
//
// -----------------------------------------------------
// Exemplo de código do POST
// -----------------------------------------------------
// router.post('/', async (req, res) => {
//   const { idioma, nivel, carga_horaria } = req.body;
//   if (!idioma || !nivel || !carga_horaria) {
//     return res.status(400).json({ erro: 'Informe idioma, nível e carga horária' });
//   }
//   try {
//     const [resultado] = await pool.query(
//       'INSERT INTO cursos (idioma, nivel, carga_horaria) VALUES (?, ?, ?)',
//       [idioma, nivel, carga_horaria]
//     );
//     res.status(201).json({ id: resultado.insertId });
//   } catch (erro) {
//     res.status(500).json({ erro: 'Erro ao cadastrar o curso' });
//   }
// });

const express = require('express');
const pool = require('../db');

const router = express.Router();

// Lista os cursos em ordem alfabética de idioma e nível.
router.get('/', async (req, res) => {
  try {
    const [cursos] = await pool.query(
      'SELECT id, idioma, nivel, carga_horaria FROM cursos ORDER BY idioma, nivel'
    );
    res.json(cursos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os cursos' });
  }
});

// Cadastra um novo curso.
router.post('/', async (req, res) => {
  const { idioma, nivel, carga_horaria } = req.body;

  if (!idioma || !nivel || carga_horaria === undefined || carga_horaria === null || carga_horaria === '') {
    return res.status(400).json({ erro: 'Informe idioma, nível e carga horária' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO cursos (idioma, nivel, carga_horaria) VALUES (?, ?, ?)',
      [idioma, nivel, carga_horaria]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar o curso' });
  }
});

module.exports = router;
