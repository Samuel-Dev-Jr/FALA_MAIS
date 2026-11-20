// =====================================================
// ROTA DE LOGIN
// =====================================================
// Opcional para a entrega (o obrigatório está em alunos.js).
// É a única rota que qualquer pessoa pode chamar, porque ainda não está logada.
// No server.js: app.use(require('./routes/auth'));
// Precisa instalar: npm install bcryptjs jsonwebtoken
// E colocar no .env uma linha JWT_SECRET= com um texto longo qualquer.
//
// -----------------------------------------------------
// POST /login  →  confere e-mail e senha e devolve um token
// -----------------------------------------------------
// Corpo (exemplo):
//   { "email": "marcos.ribeiro@falamais.com.br", "senha": "falamais123" }
//
// Lógica:
//   1. Busco o funcionário pelo e-mail, com JOIN em perfis para saber o perfil.
//   2. Se não achei, se ele está inativo ou se a senha não bate (bcrypt.compare),
//      devolvo 401 com a mesma mensagem nos três casos. Assim ninguém descobre
//      quais e-mails existem.
//   3. Gero um token com o id e o perfil (jwt.sign). Ele vale por 8 horas.
//   4. Devolvo o token, o nome e o perfil.
//
// SQL:
//   SELECT u.id, u.nome, u.senha_hash, u.ativo, p.nome AS perfil
//   FROM usuarios u
//   JOIN perfis p ON p.id = u.perfil_id
//   WHERE u.email = ?
//
// Resposta (exemplo):
//   { "token": "eyJhbGciOi...", "nome": "Marcos Ribeiro", "perfil": "coordenacao" }
//
// Depois do login:
//   o front-end manda o token em toda requisição, no cabeçalho
//   Authorization: Bearer <token>. O middlewares/autenticar.js lê esse token e
//   guarda o id e o perfil em req.usuario. O middlewares/permitir.js usa
//   req.usuario.perfil para bloquear quem não pode (403).
//
// -----------------------------------------------------
// Exemplo de código
// -----------------------------------------------------
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../db');
//
// const router = express.Router();
//
// router.post('/login', async (req, res) => {
//   const { email, senha } = req.body;
//   try {
//     const [linhas] = await pool.query(
//       `SELECT u.id, u.nome, u.senha_hash, u.ativo, p.nome AS perfil
//        FROM usuarios u JOIN perfis p ON p.id = u.perfil_id
//        WHERE u.email = ?`,
//       [email]
//     );
//     const usuario = linhas[0];
//     const senhaCerta = usuario && usuario.ativo && await bcrypt.compare(senha, usuario.senha_hash);
//     if (!senhaCerta) {
//       return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
//     }
//     const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, process.env.JWT_SECRET, { expiresIn: '8h' });
//     res.json({ token, nome: usuario.nome, perfil: usuario.perfil });
//   } catch (erro) {
//     res.status(500).json({ erro: 'Erro no login' });
//   }
// });
//
// module.exports = router;
