// =====================================================
// ROTAS DE MATRÍCULAS (tabela matriculas)
// =====================================================
// Opcional para a entrega (o obrigatório está em alunos.js).
// Matricular e cancelar: secretaria e coordenação.
// Lançar nota: professor da turma e coordenação.
// No server.js: app.use('/matriculas', require('./routes/matriculas'));
//
// -----------------------------------------------------
// POST /matriculas  →  matricula um aluno em uma turma
// -----------------------------------------------------
// Corpo (exemplo):
//   { "aluno_id": 2, "turma_id": 4 }
//
// Lógica:
//   1. Conto quantas matrículas ativas a turma já tem e comparo com max_alunos.
//      Se não sobrou vaga, devolvo 409 "Turma lotada" (RN03).
//      Faço isso aqui porque o banco não tem uma regra simples para contar registros.
//   2. Faço o INSERT com a data de hoje (CURDATE()).
//   3. Se o aluno já está nessa turma, o UNIQUE (aluno_id, turma_id) dá o erro
//      'ER_DUP_ENTRY' e eu devolvo 409 (RN04).
//   4. Devolvo 201 com o id da matrícula.
//
// SQL para contar as vagas:
//   SELECT t.max_alunos - COUNT(m.id) AS vagas
//   FROM turmas t
//   LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
//   WHERE t.id = ?
//   GROUP BY t.id, t.max_alunos
//
// SQL da matrícula:
//   INSERT INTO matriculas (aluno_id, turma_id, data_matricula) VALUES (?, ?, CURDATE())
//
// -----------------------------------------------------
// PATCH /matriculas/:id/cancelar  →  cancela uma matrícula
// -----------------------------------------------------
// Lógica:
//   1. Não apago a matrícula, só mudo a situação (RN06):
//      UPDATE matriculas SET situacao = 'cancelada' WHERE id = ? AND situacao = 'ativa'
//   2. Se resultado.affectedRows for 0, a matrícula não existe ou já não estava ativa: devolvo 404.
//
// -----------------------------------------------------
// PATCH /matriculas/:id/nota  →  lança a nota final
// -----------------------------------------------------
// Corpo (exemplo):
//   { "nota_final": 8.5 }
//
// Lógica:
//   1. Confiro se a nota está entre 0 e 10. Se não estiver, devolvo 400.
//   2. UPDATE matriculas SET nota_final = ? WHERE id = ?
//   3. Corrigir uma nota já lançada é só da coordenação.
//
// -----------------------------------------------------
// Exemplo de código do POST
// -----------------------------------------------------
// router.post('/', async (req, res) => {
//   const { aluno_id, turma_id } = req.body;
//   try {
//     const [linhas] = await pool.query(
//       `SELECT t.max_alunos - COUNT(m.id) AS vagas
//        FROM turmas t
//        LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
//        WHERE t.id = ?
//        GROUP BY t.id, t.max_alunos`,
//       [turma_id]
//     );
//     if (linhas.length === 0) return res.status(404).json({ erro: 'Turma não encontrada' });
//     if (linhas[0].vagas <= 0) return res.status(409).json({ erro: 'Turma lotada' });
//
//     const [resultado] = await pool.query(
//       'INSERT INTO matriculas (aluno_id, turma_id, data_matricula) VALUES (?, ?, CURDATE())',
//       [aluno_id, turma_id]
//     );
//     res.status(201).json({ id: resultado.insertId });
//   } catch (erro) {
//     if (erro.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({ erro: 'O aluno já está matriculado nesta turma' });
//     }
//     res.status(500).json({ erro: 'Erro ao matricular' });
//   }
// });

const express = require('express');
const pool = require('../db');

const router = express.Router();

// Matricula um aluno em uma turma, respeitando o limite de vagas e a regra de não duplicar a matrícula.
router.post('/', async (req, res) => {
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

// Cancela uma matrícula ativa sem apagar seu histórico.
router.patch('/:id/cancelar', async (req, res) => {
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

// Lança ou corrige a nota final da matrícula.
router.patch('/:id/nota', async (req, res) => {
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
