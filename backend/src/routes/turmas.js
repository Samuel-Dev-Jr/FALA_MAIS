const express = require('express');
const pool = require('../db');
const autenticar = require('../middlewares/autenticar');
const permitir = require('../middlewares/permitir');

const router = express.Router();

router.use(autenticar);

router.get('/', permitir('secretaria', 'professor', 'coordenacao'), async (req, res) => {
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

router.post('/', permitir('secretaria', 'coordenacao'), async (req, res) => {
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

router.get('/:id/chamada', permitir('secretaria', 'professor', 'coordenacao'), async (req, res) => {
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

router.get('/:id/presenca', permitir('coordenacao'), async (req, res) => {
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

router.get('/:id/resultado', permitir('coordenacao'), async (req, res) => {
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

router.post('/:id/aulas', permitir('professor', 'coordenacao'), async (req, res) => {
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
