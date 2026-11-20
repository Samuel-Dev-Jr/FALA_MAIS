// =====================================================
// ROTAS DE ALUNOS (tabela alunos)
// =====================================================
const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /alunos -> lista os alunos em ordem alfabética
router.get('/', async (req, res) => {
  try {
    const [alunos] = await pool.query(
      'SELECT id, nome, cpf, telefone, email FROM alunos ORDER BY nome'
    );
    res.json(alunos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os alunos' });
  }
});

// POST /alunos -> cadastra um aluno
router.post('/', async (req, res) => {
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    responsavel_nome,
    responsavel_telefone,
  } = req.body;

  if (!nome || !cpf || !data_nascimento) {
    return res.status(400).json({
      erro: 'Nome, CPF e data de nascimento são obrigatórios',
    });
  }

  // RN08: menores de 18 anos precisam informar nome e telefone do responsável.
  const nascimento = String(data_nascimento).slice(0, 10);
  const partes = nascimento.split('-').map(Number);
  if (partes.length === 3 && partes.every(Number.isFinite)) {
    const [ano, mes, dia] = partes;
    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;
    if (
      hoje.getMonth() + 1 < mes ||
      (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)
    ) {
      idade--;
    }

    if (idade < 18 && (!responsavel_nome || !responsavel_telefone)) {
      return res.status(400).json({
        erro: 'Menores de idade precisam informar responsável_nome e responsavel_telefone',
      });
    }
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO alunos
       (nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone]
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Já existe um aluno com esse CPF' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar o aluno' });
  }
});

// GET /alunos/:id/historico -> relatório 5
router.get('/:id/historico', async (req, res) => {
  try {
    const [historico] = await pool.query(
      `SELECT c.idioma, c.nivel, t.semestre, m.nota_final, m.situacao
       FROM matriculas m
       JOIN turmas t ON t.id = m.turma_id
       JOIN cursos c ON c.id = t.curso_id
       WHERE m.aluno_id = ?
       ORDER BY t.semestre`,
      [req.params.id]
    );

    if (historico.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado ou sem histórico' });
    }

    res.json(historico);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar o histórico do aluno' });
  }
});

module.exports = router;
