SET NAMES utf8mb4;
USE fala_mais;

INSERT INTO perfis (nome, descricao) VALUES
('secretaria', 'Cadastra alunos, cria turmas e faz matrículas'),
('professor', 'Registra aulas, presença e notas das próprias turmas'),
('coordenacao', 'Faz tudo e vê os relatórios');

SET @senha = '$2a$10$VRNFId3MdoUvQpY0n7SZt.x4VQQBTLOgxS92Sy2A3ZEkk/8YQ2Tt2';

INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil_id) VALUES
('Marcos Ribeiro', 'marcos.ribeiro@falamais.com.br', @senha, '11987650001', 3),
('Juliana Freire', 'juliana.freire@falamais.com.br', @senha, '11987650002', 1),
('Rodrigo Almeida', 'rodrigo.almeida@falamais.com.br', @senha, '11987650003', 1),
('Patrícia Gomes', 'patricia.gomes@falamais.com.br', @senha, '11987650004', 2),
('Carlos Méndez', 'carlos.mendez@falamais.com.br', @senha, '11987650005', 2);

INSERT INTO alunos (nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone) VALUES
('Ana Beatriz Souza', '10000000001', '1998-03-14', '11991110001', 'ana.souza@email.com', NULL, NULL),
('Bruno Henrique Lima', '10000000002', '1995-07-22', '11991110002', 'bruno.lima@email.com', NULL, NULL),
('Carla Mendes Rocha', '10000000003', '2001-11-05', '11991110003', 'carla.rocha@email.com', NULL, NULL),
('Daniel Costa Ferreira', '10000000004', '1990-01-30', '11991110004', 'daniel.ferreira@email.com', NULL, NULL),
('Eduarda Martins Alves', '10000000005', '2012-05-09', NULL, NULL, 'Cláudia Martins Alves', '11992220005'),
('Felipe Araújo Santos', '10000000006', '1987-09-17', '11991110006', 'felipe.santos@email.com', NULL, NULL);

INSERT INTO cursos (idioma, nivel, carga_horaria) VALUES
('Inglês', 'Básico 1', 60),
('Inglês', 'Básico 2', 60),
('Inglês', 'Intermediário 1', 80),
('Espanhol', 'Básico 1', 60),
('Espanhol', 'Básico 2', 60);

INSERT INTO turmas (curso_id, professor_id, semestre, dias_semana, hora_inicio, hora_fim, sala, max_alunos) VALUES
(1, 4, '2026-1', 'seg e qua', '19:00', '20:30', 'Sala 1', 12),
(2, 4, '2026-2', 'seg e qua', '19:00', '20:30', 'Sala 1', 12),
(4, 5, '2026-2', 'ter e qui', '19:00', '20:30', 'Sala 2', 4),
(1, 4, '2026-2', 'ter e qui', '08:00', '09:30', 'Sala 1', 12),
(5, 5, '2026-2', 'sab', '09:00', '12:00', 'Sala 2', 10);

INSERT INTO matriculas (aluno_id, turma_id, data_matricula, situacao, nota_final) VALUES
(1, 1, '2026-01-20', 'aprovado', 8.5),
(2, 1, '2026-01-20', 'aprovado', 7.0),
(3, 1, '2026-01-22', 'reprovado', 6.5),
(4, 1, '2026-01-22', 'reprovado', 9.0),
(1, 2, '2026-07-13', 'ativa', NULL),
(2, 2, '2026-07-13', 'ativa', NULL),
(1, 3, '2026-07-14', 'ativa', NULL),
(4, 3, '2026-07-14', 'ativa', NULL),
(5, 3, '2026-07-15', 'ativa', NULL),
(6, 3, '2026-07-15', 'ativa', NULL),
(3, 4, '2026-07-16', 'ativa', NULL),
(4, 4, '2026-07-16', 'ativa', NULL),
(6, 4, '2026-07-17', 'cancelada', NULL);

INSERT INTO aulas (turma_id, data_aula, conteudo) VALUES
(1, '2026-02-02', 'Cumprimentos e apresentações'),
(1, '2026-02-04', 'Verbo to be'),
(1, '2026-02-09', 'Números e alfabeto'),
(1, '2026-02-11', 'Revisão e prova'),
(3, '2026-08-04', 'Cumprimentos em espanhol'),
(3, '2026-08-06', 'Verbos ser e estar');

INSERT INTO presencas (aula_id, matricula_id, presente) VALUES
(1, 1, TRUE), (1, 2, TRUE), (1, 3, TRUE), (1, 4, TRUE),
(2, 1, TRUE), (2, 2, FALSE), (2, 3, TRUE), (2, 4, FALSE),
(3, 1, TRUE), (3, 2, TRUE), (3, 3, TRUE), (3, 4, TRUE),
(4, 1, TRUE), (4, 2, TRUE), (4, 3, TRUE), (4, 4, FALSE),
(5, 7, TRUE), (5, 8, TRUE), (5, 9, TRUE), (5, 10, TRUE),
(6, 7, TRUE), (6, 8, FALSE), (6, 9, TRUE), (6, 10, TRUE);
