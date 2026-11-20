// =====================================================
// ROTAS DE FUNCIONÁRIOS (tabela usuarios)
// =====================================================
// Opcional para a entrega (o obrigatório está em alunos.js).
// Quem pode usar: só a coordenação.
// No server.js: app.use('/usuarios', require('./routes/usuarios'));
// Precisa instalar o bcryptjs: npm install bcryptjs
//
// -----------------------------------------------------
// GET /usuarios  →  lista os funcionários
// -----------------------------------------------------
// Lógica:
//   1. Faço um SELECT com JOIN em perfis, para mostrar o nome do perfil.
//   2. Nunca devolvo a coluna senha_hash.
//
// SQL:
//   SELECT u.id, u.nome, u.email, u.telefone, p.nome AS perfil, u.ativo
//   FROM usuarios u
//   JOIN perfis p ON p.id = u.perfil_id
//   ORDER BY u.nome
//
// -----------------------------------------------------
// POST /usuarios  →  cadastra um funcionário
// -----------------------------------------------------
// Corpo (exemplo):
//   { "nome": "Fernanda Lima", "email": "fernanda.lima@falamais.com.br",
//     "senha": "falamais123", "telefone": "11987650006", "perfil_id": 2 }
//
// Lógica:
//   1. Transformo a senha em hash com bcrypt. Guardo só o hash, nunca a senha.
//   2. Faço o INSERT com ?.
//   3. E-mail repetido dá o erro 'ER_DUP_ENTRY': devolvo 409 (RN07).
//   4. Devolvo 201 com o id novo.
//
// -----------------------------------------------------
// PATCH /usuarios/:id/desativar  →  desativa um funcionário
// -----------------------------------------------------
// Lógica:
//   1. Não apago, só desativo, para ele continuar no histórico das turmas:
//      UPDATE usuarios SET ativo = FALSE WHERE id = ?
//   2. Se resultado.affectedRows for 0, devolvo 404.
//
// -----------------------------------------------------
// Exemplo de código do POST
// -----------------------------------------------------
// const bcrypt = require('bcryptjs');
//
// router.post('/', async (req, res) => {
//   const { nome, email, senha, telefone, perfil_id } = req.body;
//   try {
//     const senha_hash = await bcrypt.hash(senha, 10);
//     const [resultado] = await pool.query(
//       'INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil_id) VALUES (?, ?, ?, ?, ?)',
//       [nome, email, senha_hash, telefone, perfil_id]
//     );
//     res.status(201).json({ id: resultado.insertId });
//   } catch (erro) {
//     if (erro.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({ erro: 'Já existe um funcionário com esse e-mail' });
//     }
//     res.status(500).json({ erro: 'Erro ao cadastrar o funcionário' });
//   }
// });

// aaaa
