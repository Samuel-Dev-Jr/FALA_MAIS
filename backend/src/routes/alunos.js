// =====================================================
// ROTAS DE ALUNOS (tabela alunos)
// =====================================================
// Este é o arquivo da entrega: a rubrica pede pelo menos um GET e um POST
// funcionando em uma tabela principal, e eu escolhi a tabela alunos.
// Quem pode usar: secretaria e coordenação.
//
// Como eu monto o arquivo:
//   1. Importo o express e crio um router.
//   2. Importo o pool do db.js, que é a conexão com o banco.
//   3. Escrevo as rotas e exporto o router no final.
//   4. No server.js, ligo o arquivo: app.use('/alunos', require('./routes/alunos'));
//      Assim, '/' aqui dentro vira '/alunos' no navegador.
//
// Respostas que eu uso:
//   200 deu certo · 201 criei um registro · 400 faltou dado
//   404 não achei · 409 dado repetido · 500 erro no servidor
//
// -----------------------------------------------------
// GET /alunos  →  lista os alunos
// -----------------------------------------------------
// Lógica:
//   1. Faço um SELECT na tabela alunos, em ordem alfabética.
//   2. Devolvo a lista em JSON.
//   3. Se o banco der erro, devolvo 500.
//
// SQL:
//   SELECT id, nome, cpf, telefone, email FROM alunos ORDER BY nome
//
// Resposta (exemplo):
//   [ { "id": 1, "nome": "Ana Beatriz Souza", "cpf": "10000000001",
//       "telefone": "11991110001", "email": "ana.souza@email.com" } ]
//
// -----------------------------------------------------
// POST /alunos  →  cadastra um aluno
// -----------------------------------------------------
// Corpo que chega em req.body (exemplo de aluna menor de idade):
//   { "nome": "Eduarda Martins Alves", "cpf": "10000000005",
//     "data_nascimento": "2012-05-09",
//     "responsavel_nome": "Cláudia Martins Alves", "responsavel_telefone": "11992220005" }
//
// Lógica:
//   1. Pego os dados de req.body.
//   2. Confiro os obrigatórios (nome, cpf, data_nascimento). Se faltar, devolvo 400.
//      Preciso conferir aqui porque o MySQL do XAMPP grava vazio em vez de dar erro.
//   3. Se o aluno tem menos de 18 anos e veio sem responsável, devolvo 400 (RN08).
//   4. Faço o INSERT com ? no lugar de cada valor. O ? protege contra SQL Injection:
//      nunca junto o texto do usuário direto no SQL.
//   5. Se o CPF já existe, o banco dá o erro 'ER_DUP_ENTRY' e eu devolvo 409 (RN07).
//   6. Deu certo: devolvo 201 com o id novo (resultado.insertId).
//
// SQL:
//   INSERT INTO alunos (nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone)
//   VALUES (?, ?, ?, ?, ?, ?, ?)
//
// -----------------------------------------------------
// GET /alunos/:id/historico  →  relatório 5 (só coordenação)
// -----------------------------------------------------
// Lógica:
//   1. Pego o id da URL em req.params.id (ex.: /alunos/4/historico).
//   2. Uso a consulta 5 do database/03-consultas.sql, trocando o número fixo por ?.
//   3. Se não vier nenhuma linha, devolvo 404.
//
// -----------------------------------------------------
// Exemplo de código (modelo para as outras rotas)
// -----------------------------------------------------
// const express = require('express');
// const pool = require('../db');
//
// const router = express.Router();
//
// router.get('/', async (req, res) => {
//   try {
//     const [alunos] = await pool.query(
//       'SELECT id, nome, cpf, telefone, email FROM alunos ORDER BY nome'
//     );
//     res.json(alunos);
//   } catch (erro) {
//     res.status(500).json({ erro: 'Erro ao buscar os alunos' });
//   }
// });
//
// router.post('/', async (req, res) => {
//   const { nome, cpf, data_nascimento, telefone, email,
//           responsavel_nome, responsavel_telefone } = req.body;
//
//   if (!nome || !cpf || !data_nascimento) {
//     return res.status(400).json({ erro: 'Nome, CPF e data de nascimento são obrigatórios' });
//   }
//
//   try {
//     const [resultado] = await pool.query(
//       `INSERT INTO alunos (nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone]
//     );
//     res.status(201).json({ id: resultado.insertId });
//   } catch (erro) {
//     if (erro.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({ erro: 'Já existe um aluno com esse CPF' });
//     }
//     res.status(500).json({ erro: 'Erro ao cadastrar o aluno' });
//   }
// });
//
// module.exports = router;
//
// Para testar o POST, uso o Insomnia, o Postman ou a extensão Thunder Client do VS Code:
// método POST, endereço http://localhost:3000/alunos e o corpo em JSON.
