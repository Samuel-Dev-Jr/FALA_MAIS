USE fala_mais;

SELECT a.nome
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
WHERE m.turma_id = 4 AND m.situacao = 'ativa'
ORDER BY a.nome;

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

SELECT a.nome, ROUND(SUM(p.presente) * 100 / COUNT(*), 1) AS percentual_presenca
FROM presencas p
JOIN matriculas m ON m.id = p.matricula_id
JOIN alunos a ON a.id = m.aluno_id
WHERE m.turma_id = 1
GROUP BY a.id, a.nome
ORDER BY a.nome;

SELECT m.turma_id AS turma, a.nome, m.nota_final, m.situacao
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
WHERE m.situacao IN ('aprovado', 'reprovado')
ORDER BY m.turma_id, m.situacao, a.nome;

SELECT c.idioma, c.nivel, t.semestre, m.nota_final, m.situacao
FROM matriculas m
JOIN turmas t ON t.id = m.turma_id
JOIN cursos c ON c.id = t.curso_id
WHERE m.aluno_id = 4
ORDER BY t.semestre;
