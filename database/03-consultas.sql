-- =====================================================
-- Fala Mais - 03: consultas (os 5 relatórios pedidos pelo cliente)
-- Execute depois do 02-inserts.sql. Rode uma consulta por vez.
-- Os números fixos (turma 4, aluno 1...) são os filtros. No back-end eles
-- viram ? e o valor vem da tela ou de quem está logado.
-- =====================================================

SET NAMES utf8mb4;

USE fala_mais;

-- -----------------------------------------------------
-- 1. Lista de chamada de uma turma: alunos com matrícula ativa, em ordem alfabética.
--    Turma 4: a Yasmin cancelou a matrícula, por isso não aparece.
-- -----------------------------------------------------
SELECT a.nome AS aluno
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
WHERE m.turma_id = 4
  AND m.situacao = 'ativa'
ORDER BY a.nome;

-- -----------------------------------------------------
-- 2. Turmas do semestre com curso, professor, horário e vagas restantes.
--    Só matrícula ativa ocupa vaga. O LEFT JOIN mantém a turma sem alunos (turma 7).
-- -----------------------------------------------------
SELECT t.id AS turma,
       CONCAT(c.idioma, ' - ', c.nivel) AS curso,
       u.nome AS professor,
       t.dias_semana,
       CONCAT(TIME_FORMAT(t.hora_inicio, '%H:%i'), ' às ', TIME_FORMAT(t.hora_fim, '%H:%i')) AS horario,
       t.sala,
       t.max_alunos - COUNT(m.id) AS vagas_restantes
FROM turmas t
JOIN cursos c   ON c.id = t.curso_id
JOIN usuarios u ON u.id = t.professor_id
LEFT JOIN matriculas m ON m.turma_id = t.id AND m.situacao = 'ativa'
WHERE t.semestre = '2026-2'
GROUP BY t.id, c.idioma, c.nivel, u.nome, t.dias_semana, t.hora_inicio, t.hora_fim, t.sala, t.max_alunos
ORDER BY c.idioma, c.nivel, t.hora_inicio;

-- -----------------------------------------------------
-- 3. Percentual de presença de cada aluno em uma turma.
--    Conta sobre todas as aulas registradas da turma; presença não lançada conta como falta.
-- -----------------------------------------------------
SELECT a.nome AS aluno,
       COUNT(au.id) AS aulas,
       COALESCE(SUM(p.presente), 0) AS presencas,
       ROUND(100 * COALESCE(SUM(p.presente), 0) / COUNT(au.id), 1) AS percentual_presenca
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN aulas au ON au.turma_id = m.turma_id
LEFT JOIN presencas p ON p.aula_id = au.id AND p.matricula_id = m.id
WHERE m.turma_id = 3
  AND m.situacao <> 'cancelada'
GROUP BY m.id, a.nome
ORDER BY a.nome;

-- -----------------------------------------------------
-- 4. Alunos aprovados e reprovados por turma (RN05).
--    Aprovado = nota final >= 7,0 E presença >= 75% das aulas.
--    No fechamento do semestre, o back-end grava este resultado em matriculas.situacao.
-- -----------------------------------------------------
SELECT t.id AS turma,
       CONCAT(c.idioma, ' - ', c.nivel) AS curso,
       a.nome AS aluno,
       m.nota_final,
       ROUND(100 * COALESCE(SUM(p.presente), 0) / COUNT(au.id), 1) AS percentual_presenca,
       CASE
         WHEN m.nota_final IS NULL THEN 'sem nota'
         WHEN m.nota_final >= 7.0
          AND COALESCE(SUM(p.presente), 0) / COUNT(au.id) >= 0.75 THEN 'aprovado'
         ELSE 'reprovado'
       END AS resultado
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN turmas t ON t.id = m.turma_id
JOIN cursos c ON c.id = t.curso_id
JOIN aulas au ON au.turma_id = t.id
LEFT JOIN presencas p ON p.aula_id = au.id AND p.matricula_id = m.id
WHERE t.semestre = '2026-1'
  AND m.situacao <> 'cancelada'
GROUP BY t.id, c.idioma, c.nivel, m.id, a.nome, m.nota_final
ORDER BY t.id, resultado, a.nome;

-- -----------------------------------------------------
-- 5. Histórico de um aluno: cursos feitos, semestre, nota e situação.
--    Aluno 1 (Ana): fez Inglês Básico 1 e hoje faz inglês e espanhol ao mesmo tempo.
--    Troque por 22 (Yasmin) para ver uma matrícula cancelada no histórico (RN06).
-- -----------------------------------------------------
SELECT a.nome AS aluno,
       CONCAT(c.idioma, ' - ', c.nivel) AS curso,
       t.semestre,
       m.nota_final,
       m.situacao
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN turmas t ON t.id = m.turma_id
JOIN cursos c ON c.id = t.curso_id
WHERE m.aluno_id = 1
ORDER BY t.semestre, curso;

-- -----------------------------------------------------
-- Extra (camada 2 do material): o professor só vê as turmas dele.
--    Professor 4 (Patrícia). No back-end, o id vem de quem está logado,
--    nunca do que a pessoa digita.
-- -----------------------------------------------------
SELECT t.id AS turma,
       t.semestre,
       CONCAT(c.idioma, ' - ', c.nivel) AS curso,
       t.dias_semana,
       t.sala
FROM turmas t
JOIN cursos c ON c.id = t.curso_id
WHERE t.professor_id = 4
ORDER BY t.semestre DESC, t.id;
