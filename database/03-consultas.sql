-- Fala Mais - relatórios pedidos pelo cliente
-- Rodo uma consulta por vez. Os números no WHERE são exemplos: troco pela turma
-- ou pelo aluno que eu quiser ver.

USE fala_mais;

-- 1. Lista de chamada da turma 4: só matrícula ativa, em ordem alfabética
SELECT a.nome
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
WHERE m.turma_id = 4 AND m.situacao = 'ativa'
ORDER BY a.nome;

-- 2. Turmas do semestre 2026-2 com curso, professor, horário e vagas restantes
SELECT t.id AS turma, c.idioma, c.nivel, u.nome AS professor,
       t.dias_semana, t.hora_inicio, t.hora_fim,
       t.max_alunos - COUNT(m.id) AS vagas_restantes
FROM turmas t
JOIN cursos c ON c.id = t.curso_id
JOIN usuarios u ON u.id = t.professor_id
LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
WHERE t.semestre = '2026-2'
GROUP BY t.id, c.idioma, c.nivel, u.nome, t.dias_semana, t.hora_inicio, t.hora_fim, t.max_alunos
ORDER BY t.id;

-- 3. Percentual de presença de cada aluno da turma 1
SELECT a.nome, ROUND(SUM(p.presente) * 100 / COUNT(*), 1) AS percentual_presenca
FROM presencas p
JOIN matriculas m ON m.id = p.matricula_id
JOIN alunos a ON a.id = m.aluno_id
WHERE m.turma_id = 1
GROUP BY a.id, a.nome
ORDER BY a.nome;

-- 4. Alunos aprovados e reprovados por turma
SELECT m.turma_id AS turma, a.nome, m.nota_final, m.situacao
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
WHERE m.situacao IN ('aprovado', 'reprovado')
ORDER BY m.turma_id, m.situacao, a.nome;

-- 5. Histórico do aluno 4: cursos, semestre, nota e situação
SELECT c.idioma, c.nivel, t.semestre, m.nota_final, m.situacao
FROM matriculas m
JOIN turmas t ON t.id = m.turma_id
JOIN cursos c ON c.id = t.curso_id
WHERE m.aluno_id = 4
ORDER BY t.semestre;
