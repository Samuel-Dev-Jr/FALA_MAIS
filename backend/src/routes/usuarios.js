const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

// Lista os funcionários sem devolver a senha criptografada.
router.get('/', async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      `SELECT u.id, u.nome, u.email, u.telefone, p.nome AS perfil, u.ativo
       FROM usuarios u
       JOIN perfis p ON p.id = u.perfil_id
       ORDER BY u.nome`
    );

    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os funcionários' });
  }
});

// Cadastra um novo funcionário.
router.post('/', async (req, res) => {
  const { nome, email, senha, telefone, perfil_id } = req.body;

  if (!nome || !email || !senha || !perfil_id) {
    return res.status(400).json({
      erro: 'Nome, e-mail, senha e perfil são obrigatórios',
    });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const [resultado] = await pool.query(
      `INSERT INTO usuarios
        (nome, email, senha_hash, telefone, perfil_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, email, senha_hash, telefone || null, perfil_id]
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Já existe um funcionário com esse e-mail' });
    }
    if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Perfil não encontrado' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar o funcionário' });
  }
});

// Desativa um funcionário sem apagá-lo do histórico.
router.patch('/:id/desativar', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'UPDATE usuarios SET ativo = FALSE WHERE id = ?',
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Funcionário não encontrado' });
    }

    res.json({ mensagem: 'Funcionário desativado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao desativar o funcionário' });
  }
});

module.exports = router;
