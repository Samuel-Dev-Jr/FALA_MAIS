const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
  }

  try {
    const [linhas] = await pool.query(
      `SELECT u.id, u.nome, u.senha_hash, u.ativo, p.nome AS perfil
       FROM usuarios u
       JOIN perfis p ON p.id = u.perfil_id
       WHERE u.email = ?`,
      [email]
    );

    const usuario = linhas[0];
    const senhaCerta = usuario &&
      usuario.ativo &&
      await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCerta) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      nome: usuario.nome,
      perfil: usuario.perfil,
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no login' });
  }
});

module.exports = router;
