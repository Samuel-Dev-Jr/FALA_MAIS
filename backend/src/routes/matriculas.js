const express = require('express');
const pool = require('../db');
const autenticar = require('../middlewares/autenticar');
const permitir = require('../middlewares/permitir');

const router = express.Router();

router.use(autenticar);

router.post('/', permitir('secretaria', 'coordenacao'), async (req, res) => {
  const { aluno_id, turma_id } = req.body;

  if (!aluno_id || !turma_id) {
    return res.status(400).json({ erro: 'Informe o aluno e a turma' });
  }

  try {
    const [linhas] = await pool.query(
      `SELECT t.max_alunos - COUNT(m.id) AS vagas
       FROM turmas t
       LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
       WHERE t.id = ?
       GROUP BY t.id, t.max_alunos`,
      [turma_id]
    );

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }

    if (linhas[0].vagas <= 0) {
      return res.status(409).json({ erro: 'Turma lotada' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO matriculas (aluno_id, turma_id, data_matricula) VALUES (?, ?, CURDATE())',
      [aluno_id, turma_id]
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'O aluno já está matriculado nesta turma' });
    }
    if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ erro: 'Aluno ou turma não encontrada' });
    }
    res.status(500).json({ erro: 'Erro ao matricular' });
  }
});

router.patch('/:id/cancelar', permitir('secretaria', 'coordenacao'), async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "UPDATE matriculas SET situacao = 'cancelada' WHERE id = ? AND situacao = 'ativa'",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Matrícula não encontrada ou já não está ativa' });
    }

    res.json({ mensagem: 'Matrícula cancelada' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cancelar a matrícula' });
  }
});

router.patch('/:id/nota', permitir('professor', 'coordenacao'), async (req, res) => {
  const { nota_final } = req.body;

  if (nota_final === undefined || nota_final === null || nota_final === '' ||
      Number.isNaN(Number(nota_final)) || Number(nota_final) < 0 || Number(nota_final) > 10) {
    return res.status(400).json({ erro: 'A nota deve estar entre 0 e 10' });
  }

  try {
    const [resultado] = await pool.query(
      'UPDATE matriculas SET nota_final = ? WHERE id = ?',
      [Number(nota_final), req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Matrícula não encontrada' });
    }

    res.json({ mensagem: 'Nota final lançada' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao lançar a nota final' });
  }
});

module.exports = router;
