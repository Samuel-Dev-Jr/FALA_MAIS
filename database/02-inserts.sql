-- =====================================================
-- Fala Mais - 02: dados de exemplo
-- Execute depois do 01-create.sql. Como o banco é recriado do zero,
-- os ids começam em 1 e seguem a ordem dos INSERTs (indicada nos comentários).
--
-- O que estes dados mostram:
--   * 2026-1 é um semestre encerrado: notas, presença e situação já fechadas.
--   * 2026-2 é o semestre atual: a turma 3 está lotada, a turma 4 tem uma
--     matrícula cancelada e a turma 7 ainda não tem alunos.
--   * A professora Beatriz saiu da escola: está desativada, mas continua no histórico.
--   * CPFs são fictícios (não passam na validação dos dígitos).
-- =====================================================

SET NAMES utf8mb4;

USE fala_mais;

-- -----------------------------------------------------
-- Perfis
-- -----------------------------------------------------
INSERT INTO perfis (nome, descricao) VALUES
  ('secretaria',  'Cadastra alunos, cria turmas e cuida das matrículas'),                -- 1
  ('professor',   'Registra aulas, presença e notas das próprias turmas'),               -- 2
  ('coordenacao', 'Acesso total: cursos, funcionários, correção de notas e relatórios'); -- 3

-- -----------------------------------------------------
-- Funcionários (usuários do sistema)
-- senha_hash é o bcrypt de 'falamais123', a senha de teste de todos.
-- Só para desenvolvimento: no sistema real cada funcionário cria a própria senha.
-- -----------------------------------------------------
SET @senha_teste = '$2a$10$VRNFId3MdoUvQpY0n7SZt.x4VQQBTLOgxS92Sy2A3ZEkk/8YQ2Tt2';

INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil_id, ativo) VALUES
  ('Marcos Ribeiro',  'marcos.ribeiro@falamais.com.br',  @senha_teste, '11987650001', 3, TRUE),  -- 1 coordenação
  ('Juliana Freire',  'juliana.freire@falamais.com.br',  @senha_teste, '11987650002', 1, TRUE),  -- 2 secretaria
  ('Rodrigo Almeida', 'rodrigo.almeida@falamais.com.br', @senha_teste, '11987650003', 1, TRUE),  -- 3 secretaria
  ('Patrícia Gomes',  'patricia.gomes@falamais.com.br',  @senha_teste, '11987650004', 2, TRUE),  -- 4 prof. de inglês
  ('Ricardo Tavares', 'ricardo.tavares@falamais.com.br', @senha_teste, '11987650005', 2, TRUE),  -- 5 prof. de inglês
  ('Fernanda Lima',   'fernanda.lima@falamais.com.br',   @senha_teste, '11987650006', 2, TRUE),  -- 6 prof. de inglês
  ('Carlos Méndez',   'carlos.mendez@falamais.com.br',   @senha_teste, '11987650007', 2, TRUE),  -- 7 prof. de espanhol
  ('Lucía Fernández', 'lucia.fernandez@falamais.com.br', @senha_teste, '11987650008', 2, TRUE),  -- 8 prof. de espanhol
  ('André Moura',     'andre.moura@falamais.com.br',     @senha_teste, '11987650009', 2, TRUE),  -- 9 prof. de inglês
  ('Beatriz Lacerda', 'beatriz.lacerda@falamais.com.br', @senha_teste, '11987650010', 2, FALSE); -- 10 saiu: desativada, não apagada

-- -----------------------------------------------------
-- Alunos (cadastros, sem login). Menores têm responsável.
-- -----------------------------------------------------
INSERT INTO alunos (nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone) VALUES
  ('Ana Beatriz Souza',       '10000000001', '1998-03-14', '11991110001', 'ana.souza@email.com',        NULL, NULL),                                    -- 1
  ('Bruno Henrique Lima',     '10000000002', '1995-07-22', '11991110002', 'bruno.lima@email.com',       NULL, NULL),                                    -- 2
  ('Carla Mendes Rocha',      '10000000003', '2001-11-05', '11991110003', 'carla.rocha@email.com',      NULL, NULL),                                    -- 3
  ('Daniel Costa Ferreira',   '10000000004', '1990-01-30', '11991110004', 'daniel.ferreira@email.com',  NULL, NULL),                                    -- 4
  ('Eduarda Martins Alves',   '10000000005', '2012-05-09', '11991110005', NULL,                         'Cláudia Martins Alves',  '11992220005'),       -- 5 menor
  ('Felipe Araújo Santos',    '10000000006', '1987-09-17', '11991110006', 'felipe.santos@email.com',    NULL, NULL),                                    -- 6
  ('Gabriela Nunes Pereira',  '10000000007', '2003-02-25', '11991110007', 'gabriela.pereira@email.com', NULL, NULL),                                    -- 7
  ('Henrique Barbosa Dias',   '10000000008', '2011-08-12', '11991110008', NULL,                         'Marcelo Barbosa Dias',   '11992220008'),       -- 8 menor
  ('Isabela Carvalho Ramos',  '10000000009', '1999-12-01', '11991110009', 'isabela.ramos@email.com',    NULL, NULL),                                    -- 9
  ('João Pedro Oliveira',     '10000000010', '2013-04-18', NULL,          NULL,                         'Renata Oliveira',        '11992220010'),       -- 10 menor
  ('Karina Lopes Teixeira',   '10000000011', '1993-06-06', '11991110011', 'karina.teixeira@email.com',  NULL, NULL),                                    -- 11
  ('Lucas Gomes Moreira',     '10000000012', '2000-10-10', '11991110012', 'lucas.moreira@email.com',    NULL, NULL),                                    -- 12
  ('Marina Castro Vieira',    '10000000013', '1996-04-03', '11991110013', 'marina.vieira@email.com',    NULL, NULL),                                    -- 13
  ('Nicolas Freitas Cardoso', '10000000014', '2010-12-20', '11991110014', NULL,                         'Sandra Freitas Cardoso', '11992220014'),       -- 14 menor
  ('Olívia Pinto Correia',    '10000000015', '1985-08-08', '11991110015', 'olivia.correia@email.com',   NULL, NULL),                                    -- 15
  ('Pedro Augusto Melo',      '10000000016', '2002-03-27', '11991110016', 'pedro.melo@email.com',       NULL, NULL),                                    -- 16
  ('Rafaela Duarte Campos',   '10000000017', '2012-09-30', '11991110017', NULL,                         'Fábio Duarte Campos',    '11992220017'),       -- 17 menor
  ('Sofia Moraes Batista',    '10000000018', '1997-01-15', '11991110018', 'sofia.batista@email.com',    NULL, NULL),                                    -- 18
  ('Thiago Rezende Cunha',    '10000000019', '1992-05-19', '11991110019', 'thiago.cunha@email.com',     NULL, NULL),                                    -- 19
  ('Valentina Cruz Prado',    '10000000020', '2014-02-11', NULL,          NULL,                         'Luciana Cruz Prado',     '11992220020'),       -- 20 menor
  ('Vinícius Rocha Barros',   '10000000021', '1989-11-23', '11991110021', 'vinicius.barros@email.com',  NULL, NULL),                                    -- 21
  ('Yasmin Farias Monteiro',  '10000000022', '2004-07-07', '11991110022', 'yasmin.monteiro@email.com',  NULL, NULL);                                    -- 22

-- -----------------------------------------------------
-- Cursos
-- -----------------------------------------------------
INSERT INTO cursos (idioma, nivel, carga_horaria) VALUES
  ('Inglês',   'Básico 1',        60),  -- 1
  ('Inglês',   'Básico 2',        60),  -- 2
  ('Inglês',   'Intermediário 1', 80),  -- 3
  ('Espanhol', 'Básico 1',        60),  -- 4
  ('Espanhol', 'Básico 2',        60),  -- 5
  ('Espanhol', 'Intermediário 1', 80);  -- 6

-- -----------------------------------------------------
-- Turmas
-- -----------------------------------------------------
INSERT INTO turmas (curso_id, professor_id, semestre, dias_semana, hora_inicio, hora_fim, sala, max_alunos) VALUES
  -- 2026-1 (semestre encerrado)
  (1, 4,  '2026-1', 'seg,qua', '19:00', '20:30', 'Sala 1', 12),  -- 1 Inglês Básico 1, Patrícia
  (4, 10, '2026-1', 'ter,qui', '19:00', '20:30', 'Sala 2', 12),  -- 2 Espanhol Básico 1, Beatriz (hoje inativa)
  -- 2026-2 (semestre atual)
  (1, 5,  '2026-2', 'seg,qua', '08:00', '09:30', 'Sala 1', 12),  -- 3 Inglês Básico 1, Ricardo: lotada
  (2, 4,  '2026-2', 'seg,qua', '19:00', '20:30', 'Sala 1', 12),  -- 4 Inglês Básico 2, Patrícia
  (4, 7,  '2026-2', 'ter,qui', '19:00', '20:30', 'Sala 2', 12),  -- 5 Espanhol Básico 1, Carlos
  (5, 8,  '2026-2', 'sab',     '09:00', '12:00', 'Sala 3', 10),  -- 6 Espanhol Básico 2, Lucía (sala menor)
  (3, 6,  '2026-2', 'ter,qui', '08:00', '09:30', 'Sala 3', 12);  -- 7 Inglês Intermediário 1, Fernanda: sem alunos ainda

-- -----------------------------------------------------
-- Matrículas
-- -----------------------------------------------------
INSERT INTO matriculas (aluno_id, turma_id, data_matricula, situacao, nota_final) VALUES
  -- Turma 1 (Inglês Básico 1, 2026-1): situação já fechada pela RN05
  (1,  1, '2026-01-20', 'aprovado',  8.5),   -- 1 Ana
  (2,  1, '2026-01-20', 'aprovado',  7.0),   -- 2 Bruno: nota 7,0 e 75% de presença, no limite
  (3,  1, '2026-01-22', 'reprovado', 6.5),   -- 3 Carla: nota abaixo de 7,0
  (4,  1, '2026-01-22', 'reprovado', 9.0),   -- 4 Daniel: nota boa, mas só 62,5% de presença
  (6,  1, '2026-01-27', 'aprovado',  7.5),   -- 5 Felipe
  -- Turma 2 (Espanhol Básico 1, 2026-1)
  (7,  2, '2026-01-21', 'aprovado',  8.0),   -- 6 Gabriela
  (9,  2, '2026-01-21', 'reprovado', 5.0),   -- 7 Isabela
  (11, 2, '2026-01-26', 'aprovado',  7.8),   -- 8 Karina
  (13, 2, '2026-01-28', 'aprovado',  9.5),   -- 9 Marina
  -- Turma 3 (Inglês Básico 1, 2026-2): 12 matrículas ativas, nenhuma vaga
  (3,  3, '2026-07-13', 'ativa', NULL),      -- 10 Carla (refazendo)
  (4,  3, '2026-07-13', 'ativa', NULL),      -- 11 Daniel (refazendo)
  (5,  3, '2026-07-14', 'ativa', NULL),      -- 12 Eduarda
  (8,  3, '2026-07-14', 'ativa', NULL),      -- 13 Henrique
  (10, 3, '2026-07-15', 'ativa', NULL),      -- 14 João Pedro
  (12, 3, '2026-07-15', 'ativa', NULL),      -- 15 Lucas
  (14, 3, '2026-07-16', 'ativa', NULL),      -- 16 Nicolas
  (15, 3, '2026-07-16', 'ativa', NULL),      -- 17 Olívia
  (16, 3, '2026-07-20', 'ativa', NULL),      -- 18 Pedro
  (17, 3, '2026-07-20', 'ativa', NULL),      -- 19 Rafaela
  (18, 3, '2026-07-21', 'ativa', NULL),      -- 20 Sofia
  (20, 3, '2026-07-22', 'ativa', NULL),      -- 21 Valentina
  -- Turma 4 (Inglês Básico 2, 2026-2)
  (1,  4, '2026-07-13', 'ativa', NULL),      -- 22 Ana
  (2,  4, '2026-07-13', 'ativa', NULL),      -- 23 Bruno
  (6,  4, '2026-07-15', 'ativa', NULL),      -- 24 Felipe
  (19, 4, '2026-07-17', 'ativa', NULL),      -- 25 Thiago
  (22, 4, '2026-07-17', 'cancelada', NULL),  -- 26 Yasmin: cancelou, mas fica no histórico (RN06)
  -- Turma 5 (Espanhol Básico 1, 2026-2)
  (1,  5, '2026-07-14', 'ativa', NULL),      -- 27 Ana: inglês e espanhol ao mesmo tempo (RN02)
  (9,  5, '2026-07-14', 'ativa', NULL),      -- 28 Isabela (refazendo)
  (21, 5, '2026-07-21', 'ativa', NULL),      -- 29 Vinícius
  (18, 5, '2026-07-21', 'ativa', NULL),      -- 30 Sofia
  -- Turma 6 (Espanhol Básico 2, 2026-2)
  (7,  6, '2026-07-15', 'ativa', NULL),      -- 31 Gabriela
  (11, 6, '2026-07-15', 'ativa', NULL),      -- 32 Karina
  (13, 6, '2026-07-16', 'ativa', NULL);      -- 33 Marina

-- -----------------------------------------------------
-- Aulas dadas
-- -----------------------------------------------------
INSERT INTO aulas (turma_id, data_aula, conteudo) VALUES
  -- Turma 1 (2026-1)
  (1, '2026-02-02', 'Cumprimentos e apresentações'),     -- 1
  (1, '2026-02-04', 'Verbo to be'),                      -- 2
  (1, '2026-02-09', 'Números e alfabeto'),               -- 3
  (1, '2026-02-11', 'Membros da família'),               -- 4
  (1, '2026-02-23', 'Simple present'),                   -- 5
  (1, '2026-02-25', 'Rotina diária'),                    -- 6
  (1, '2026-03-02', 'Preposições de tempo'),             -- 7
  (1, '2026-03-04', 'Revisão e prova'),                  -- 8
  -- Turma 2 (2026-1)
  (2, '2026-02-03', 'Saludos: cumprimentos'),            -- 9
  (2, '2026-02-05', 'Verbos ser e estar'),               -- 10
  (2, '2026-02-10', 'Números'),                          -- 11
  (2, '2026-02-12', 'Família'),                          -- 12
  (2, '2026-02-19', 'Presente do indicativo'),           -- 13
  (2, '2026-02-24', 'Rotina diária'),                    -- 14
  (2, '2026-02-26', 'Horas'),                            -- 15
  (2, '2026-03-03', 'Revisão e prova'),                  -- 16
  -- Turma 3 (2026-2)
  (3, '2026-08-03', 'Cumprimentos e apresentações'),     -- 17
  (3, '2026-08-05', 'Verbo to be'),                      -- 18
  (3, '2026-08-10', 'Números e alfabeto'),               -- 19
  (3, '2026-08-12', 'Membros da família'),               -- 20
  -- Turma 4 (2026-2)
  (4, '2026-08-03', 'Past simple: verbos regulares'),    -- 21
  (4, '2026-08-05', 'Past simple: verbos irregulares'),  -- 22
  (4, '2026-08-10', 'Falando de viagens'),               -- 23
  (4, '2026-08-12', 'Comparativos');                     -- 24

-- -----------------------------------------------------
-- Presença: uma linha por aluno matriculado em cada aula (TRUE = presente)
-- -----------------------------------------------------
INSERT INTO presencas (aula_id, matricula_id, presente) VALUES
  -- Turma 1: matrículas 1 Ana, 2 Bruno, 3 Carla, 4 Daniel, 5 Felipe
  (1, 1, TRUE), (1, 2, TRUE),  (1, 3, TRUE), (1, 4, TRUE),  (1, 5, TRUE),
  (2, 1, TRUE), (2, 2, TRUE),  (2, 3, TRUE), (2, 4, FALSE), (2, 5, TRUE),
  (3, 1, TRUE), (3, 2, FALSE), (3, 3, TRUE), (3, 4, TRUE),  (3, 5, TRUE),
  (4, 1, TRUE), (4, 2, TRUE),  (4, 3, TRUE), (4, 4, FALSE), (4, 5, TRUE),
  (5, 1, TRUE), (5, 2, TRUE),  (5, 3, TRUE), (5, 4, TRUE),  (5, 5, FALSE),
  (6, 1, TRUE), (6, 2, FALSE), (6, 3, TRUE), (6, 4, TRUE),  (6, 5, TRUE),
  (7, 1, TRUE), (7, 2, TRUE),  (7, 3, TRUE), (7, 4, FALSE), (7, 5, TRUE),
  (8, 1, TRUE), (8, 2, TRUE),  (8, 3, TRUE), (8, 4, TRUE),  (8, 5, TRUE),
  -- Turma 2: matrículas 6 Gabriela, 7 Isabela, 8 Karina, 9 Marina
  (9,  6, TRUE), (9,  7, TRUE),  (9,  8, TRUE),  (9,  9, TRUE),
  (10, 6, TRUE), (10, 7, FALSE), (10, 8, TRUE),  (10, 9, TRUE),
  (11, 6, TRUE), (11, 7, TRUE),  (11, 8, TRUE),  (11, 9, TRUE),
  (12, 6, TRUE), (12, 7, TRUE),  (12, 8, FALSE), (12, 9, TRUE),
  (13, 6, TRUE), (13, 7, TRUE),  (13, 8, TRUE),  (13, 9, TRUE),
  (14, 6, TRUE), (14, 7, FALSE), (14, 8, TRUE),  (14, 9, TRUE),
  (15, 6, TRUE), (15, 7, TRUE),  (15, 8, TRUE),  (15, 9, TRUE),
  (16, 6, TRUE), (16, 7, TRUE),  (16, 8, TRUE),  (16, 9, TRUE),
  -- Turma 3: matrículas 10 a 21 (Carla, Daniel, Eduarda, Henrique, João Pedro, Lucas,
  --          Nicolas, Olívia, Pedro, Rafaela, Sofia, Valentina), 6 por linha
  (17, 10, TRUE), (17, 11, TRUE),  (17, 12, TRUE), (17, 13, FALSE), (17, 14, TRUE),  (17, 15, TRUE),
  (17, 16, TRUE), (17, 17, TRUE),  (17, 18, TRUE), (17, 19, TRUE),  (17, 20, TRUE),  (17, 21, TRUE),
  (18, 10, TRUE), (18, 11, FALSE), (18, 12, TRUE), (18, 13, TRUE),  (18, 14, FALSE), (18, 15, TRUE),
  (18, 16, TRUE), (18, 17, TRUE),  (18, 18, TRUE), (18, 19, TRUE),  (18, 20, TRUE),  (18, 21, TRUE),
  (19, 10, TRUE), (19, 11, TRUE),  (19, 12, TRUE), (19, 13, FALSE), (19, 14, FALSE), (19, 15, TRUE),
  (19, 16, TRUE), (19, 17, TRUE),  (19, 18, TRUE), (19, 19, TRUE),  (19, 20, TRUE),  (19, 21, TRUE),
  (20, 10, TRUE), (20, 11, TRUE),  (20, 12, TRUE), (20, 13, TRUE),  (20, 14, FALSE), (20, 15, TRUE),
  (20, 16, TRUE), (20, 17, TRUE),  (20, 18, FALSE), (20, 19, TRUE), (20, 20, TRUE),  (20, 21, TRUE),
  -- Turma 4: matrículas 22 Ana, 23 Bruno, 24 Felipe, 25 Thiago (a 26, cancelada, não tem presença)
  (21, 22, TRUE), (21, 23, TRUE),  (21, 24, TRUE),  (21, 25, TRUE),
  (22, 22, TRUE), (22, 23, TRUE),  (22, 24, FALSE), (22, 25, TRUE),
  (23, 22, TRUE), (23, 23, TRUE),  (23, 24, TRUE),  (23, 25, TRUE),
  (24, 22, TRUE), (24, 23, FALSE), (24, 24, TRUE),  (24, 25, TRUE);
