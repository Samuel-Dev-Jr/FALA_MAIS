// =====================================================
// ROTAS DE TURMAS (tabelas turmas, aulas e presencas)
// =====================================================
// Opcional para a entrega (o obrigatório está em alunos.js).
// Aqui ficam as turmas, o lançamento de aula com presença e os relatórios 1 a 4.
// No server.js: app.use('/turmas', require('./routes/turmas'));
//
// Regra importante ("só vê o que é seu"):
//   o professor só pode mexer nas turmas dele. Quem é o dono da turma é a
//   coluna turmas.professor_id. Se quem chamou é professor, eu filtro com
//   WHERE professor_id = <id de quem está logado>. Esse id vem do login,
//   nunca de algo que a pessoa digita.
//
// -----------------------------------------------------
// GET /turmas?semestre=2026-2  →  relatório 2 (turmas com vagas)
// -----------------------------------------------------
// Lógica:
//   1. Pego o semestre de req.query.semestre (o que vem depois do ? na URL).
//   2. Uso a consulta 2 do database/03-consultas.sql, trocando '2026-2' por ?.
//   3. Se quem chamou é professor, acrescento AND t.professor_id = ?.
//   4. Devolvo a lista em JSON.
//
// Resposta (exemplo):
//   [ { "turma": 3, "idioma": "Espanhol", "nivel": "Básico 1", "professor": "Carlos Méndez",
//       "dias_semana": "ter e qui", "hora_inicio": "19:00:00", "hora_fim": "20:30:00",
//       "vagas_restantes": 0 } ]
//
// -----------------------------------------------------
// POST /turmas  →  cria uma turma (secretaria e coordenação)
// -----------------------------------------------------
// Corpo (exemplo):
//   { "curso_id": 1, "professor_id": 4, "semestre": "2026-2", "dias_semana": "seg e qua",
//     "hora_inicio": "19:00", "hora_fim": "20:30", "sala": "Sala 1", "max_alunos": 12 }
//
// Lógica:
//   1. Confiro os obrigatórios. Se faltar, devolvo 400.
//   2. Faço o INSERT com ?. Curso ou professor que não existe faz a FK dar erro:
//      nesse caso devolvo 400.
//   3. Devolvo 201 com o id novo.
//
// -----------------------------------------------------
// GET /turmas/:id/chamada  →  relatório 1 (lista de chamada)
// -----------------------------------------------------
//   1. Pego o id da turma em req.params.id.
//   2. Uso a consulta 1 do 03-consultas.sql (só matrícula ativa, em ordem alfabética).
//   3. Devolvo também o id da matrícula: é ele que o professor usa para lançar a presença.
//
// -----------------------------------------------------
// GET /turmas/:id/presenca  →  relatório 3 (só coordenação)
// GET /turmas/:id/resultado →  relatório 4 (só coordenação)
// -----------------------------------------------------
//   Uso as consultas 3 e 4 do 03-consultas.sql, trocando o número da turma por ?.
//
// -----------------------------------------------------
// POST /turmas/:id/aulas  →  registra uma aula com a presença (professor da turma e coordenação)
// -----------------------------------------------------
// Corpo (exemplo):
//   { "data_aula": "2026-08-11", "conteudo": "Números",
//     "presencas": [ { "matricula_id": 7, "presente": true },
//                    { "matricula_id": 8, "presente": false } ] }
//
// Lógica:
//   1. Faço o INSERT em aulas e pego o id da aula (resultado.insertId).
//   2. Para cada item de presencas, faço um INSERT em presencas com esse id.
//   3. Devolvo 201.
//
// -----------------------------------------------------
// IMPLEMENTAÇÃO DAS ROTAS
// -----------------------------------------------------
const express = require('express');
const pool = require('../db');

const router = express.Router();

// Consulta turmas de um semestre e limita os dados ao professor autenticado.
router.get('/', async (req, res) => {
  const { semestre } = req.query;

  if (!semestre) {
    return res.status(400).json({ erro: 'Informe o semestre' });
  }

  let sql = `SELECT t.id AS turma, c.idioma, c.nivel, u.nome AS professor,
                    t.dias_semana, t.hora_inicio, t.hora_fim,
                    t.max_alunos - COUNT(m.id) AS vagas_restantes
             FROM turmas t
             JOIN cursos c ON c.id = t.curso_id
             JOIN usuarios u ON u.id = t.professor_id
             LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
             WHERE t.semestre = ?`;
  const params = [semestre];

  if (req.usuario && req.usuario.perfil === 'professor') {
    sql += ' AND t.professor_id = ?';
    params.push(req.usuario.id);
  }

  sql += ` GROUP BY t.id, c.idioma, c.nivel, u.nome, t.dias_semana,
            t.hora_inicio, t.hora_fim, t.max_alunos
           ORDER BY t.id`;

  try {
    const [turmas] = await pool.query(sql, params);
    res.json(turmas);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar as turmas' });
  }
});

// Cria uma turma.
router.post('/', async (req, res) => {
  const {
    curso_id,
    professor_id,
    semestre,
    dias_semana,
    hora_inicio,
    hora_fim,
    sala,
    max_alunos,
  } = req.body;

  if (
    !curso_id ||
    !professor_id ||
    !semestre ||
    !dias_semana ||
    !hora_inicio ||
    !hora_fim ||
    !sala
  ) {
    return res.status(400).json({
      erro: 'Informe curso, professor, semestre, dias, horários e sala',
    });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO turmas
        (curso_id, professor_id, semestre, dias_semana, hora_inicio, hora_fim, sala, max_alunos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        curso_id,
        professor_id,
        semestre,
        dias_semana,
        hora_inicio,
        hora_fim,
        sala,
        max_alunos || 12,
      ]
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Curso ou professor não encontrado' });
    }
    res.status(500).json({ erro: 'Erro ao criar a turma' });
  }
});

// Lista de chamada de uma turma.
router.get('/:id/chamada', async (req, res) => {
  try {
    const [alunos] = await pool.query(
      `SELECT m.id AS matricula_id, a.nome
       FROM matriculas m
       JOIN alunos a ON a.id = m.aluno_id
       JOIN turmas t ON t.id = m.turma_id
       WHERE m.turma_id = ? AND m.situacao = 'ativa'
       ORDER BY a.nome`,
      [req.params.id]
    );

    if (req.usuario && req.usuario.perfil === 'professor') {
      const [turma] = await pool.query(
        'SELECT id FROM turmas WHERE id = ? AND professor_id = ?',
        [req.params.id, req.usuario.id]
      );
      if (turma.length === 0) {
        return res.status(403).json({ erro: 'Acesso permitido somente às turmas do professor' });
      }
    }

    res.json(alunos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar a lista de chamada' });
  }
});

// Percentual de presença da turma.
router.get('/:id/presenca', async (req, res) => {
  try {
    const [presencas] = await pool.query(
      `SELECT a.nome, ROUND(SUM(p.presente) * 100 / COUNT(*), 1) AS percentual_presenca
       FROM presencas p
       JOIN matriculas m ON m.id = p.matricula_id
       JOIN alunos a ON a.id = m.aluno_id
       WHERE m.turma_id = ?
       GROUP BY a.id, a.nome
       ORDER BY a.nome`,
      [req.params.id]
    );

    res.json(presencas);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar a presença da turma' });
  }
});

// Resultado dos alunos aprovados e reprovados da turma.
router.get('/:id/resultado', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      `SELECT m.turma_id AS turma, a.nome, m.nota_final, m.situacao
       FROM matriculas m
       JOIN alunos a ON a.id = m.aluno_id
       WHERE m.turma_id = ? AND m.situacao IN ('aprovado', 'reprovado')
       ORDER BY m.situacao, a.nome`,
      [req.params.id]
    );

    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar o resultado da turma' });
  }
});

// Registra uma aula e a presença dos alunos matriculados.
router.post('/:id/aulas', async (req, res) => {
  const { data_aula, conteudo, presencas } = req.body;

  if (!data_aula || !conteudo) {
    return res.status(400).json({ erro: 'Informe a data da aula e o conteúdo' });
  }

  try {
    const [turma] = await pool.query(
      'SELECT id, professor_id FROM turmas WHERE id = ?',
      [req.params.id]
    );

    if (turma.length === 0) {
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }

    if (
      req.usuario &&
      req.usuario.perfil === 'professor' &&
      turma[0].professor_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: 'Acesso permitido somente às turmas do professor' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO aulas (turma_id, data_aula, conteudo) VALUES (?, ?, ?)',
      [req.params.id, data_aula, conteudo]
    );

    if (Array.isArray(presencas)) {
      for (const item of presencas) {
        await pool.query(
          'INSERT INTO presencas (aula_id, matricula_id, presente) VALUES (?, ?, ?)',
          [resultado.insertId, item.matricula_id, item.presente ? 1 : 0]
        );
      }
    }

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Matrícula não encontrada' });
    }
    res.status(500).json({ erro: 'Erro ao registrar a aula' });
  }
});

module.exports = router;
