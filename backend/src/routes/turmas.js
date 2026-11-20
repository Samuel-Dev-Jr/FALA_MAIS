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
// Exemplo de código do GET com o filtro do professor
// -----------------------------------------------------
// router.get('/', async (req, res) => {
//   let sql = `SELECT t.id AS turma, c.idioma, c.nivel, u.nome AS professor,
//                     t.dias_semana, t.hora_inicio, t.hora_fim,
//                     t.max_alunos - COUNT(m.id) AS vagas_restantes
//              FROM turmas t
//              JOIN cursos c ON c.id = t.curso_id
//              JOIN usuarios u ON u.id = t.professor_id
//              LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
//              WHERE t.semestre = ?`;
//   const params = [req.query.semestre];
//
//   // req.usuario só existe se o grupo fizer o login (ver auth.js)
//   if (req.usuario && req.usuario.perfil === 'professor') {
//     sql += ' AND t.professor_id = ?';
//     params.push(req.usuario.id);
//   }
//
//   sql += ' GROUP BY t.id, c.idioma, c.nivel, u.nome, t.dias_semana, t.hora_inicio, t.hora_fim, t.max_alunos';
//
//   try {
//     const [turmas] = await pool.query(sql, params);
//     res.json(turmas);
//   } catch (erro) {
//     res.status(500).json({ erro: 'Erro ao buscar as turmas' });
//   }
// });
