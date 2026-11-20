const express = require('express');
const pool = require('../db');
const autenticar = require('../middlewares/autenticar');
const permitir = require('../middlewares/permitir');

const router = express.Router();

router.use(autenticar);

router.get('/', permitir('secretaria', 'coordenacao'), async (req, res) => {
  try {
    const [cursos] = await pool.query(
      'SELECT id, idioma, nivel, carga_horaria FROM cursos ORDER BY idioma, nivel'
    );
    res.json(cursos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os cursos' });
  }
});

router.post('/', permitir('coordenacao'), async (req, res) => {
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
