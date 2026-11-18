-- =====================================================
-- Fala Mais - 01: criação do banco e das tabelas (modelo físico)
-- Testado no MariaDB 10.4 do XAMPP; compatível com MySQL 8.
-- Execute este script primeiro.
-- ATENÇÃO: o DROP apaga o banco inteiro. Use só em desenvolvimento.
-- =====================================================

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS fala_mais;

CREATE DATABASE fala_mais
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fala_mais;

-- -----------------------------------------------------
-- Quem usa o sistema: funcionários, cada um com um perfil
-- (RBAC, opção B do material: perfis em tabela própria)
-- -----------------------------------------------------

CREATE TABLE perfis (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(30)  NOT NULL UNIQUE,
  descricao VARCHAR(150)
);

CREATE TABLE usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,          -- login; não se repete (RN07)
  senha_hash VARCHAR(255) NOT NULL,                 -- hash bcrypt, nunca a senha pura
  telefone   VARCHAR(15),
  perfil_id  INT          NOT NULL,
  ativo      BOOLEAN      NOT NULL DEFAULT TRUE,    -- quem sai é desativado, não apagado (RN09)
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

-- -----------------------------------------------------
-- Sobre quem o sistema guarda dados: alunos não fazem login
-- -----------------------------------------------------

CREATE TABLE alunos (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nome                 VARCHAR(100) NOT NULL,
  cpf                  CHAR(11)     NOT NULL UNIQUE,  -- só números; não se repete (RN07)
  data_nascimento      DATE         NOT NULL,
  telefone             VARCHAR(15),
  email                VARCHAR(100),
  responsavel_nome     VARCHAR(100),                  -- obrigatório para menores (RN08)
  responsavel_telefone VARCHAR(15),
  CONSTRAINT chk_alunos_cpf CHECK (cpf REGEXP '^[0-9]{11}$'),
  -- nome e telefone do responsável andam juntos: os dois preenchidos ou os dois vazios
  CONSTRAINT chk_alunos_responsavel
    CHECK ((responsavel_nome IS NULL) = (responsavel_telefone IS NULL))
);

-- -----------------------------------------------------
-- Cursos e turmas
-- -----------------------------------------------------

CREATE TABLE cursos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  idioma        VARCHAR(30) NOT NULL,               -- ex.: Inglês
  nivel         VARCHAR(30) NOT NULL,               -- ex.: Básico 1
  carga_horaria SMALLINT    NOT NULL,               -- em horas
  CONSTRAINT uq_cursos_idioma_nivel UNIQUE (idioma, nivel),
  CONSTRAINT chk_cursos_carga CHECK (carga_horaria > 0)
);

CREATE TABLE turmas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  curso_id     INT         NOT NULL,                -- RN01: a turma pertence a um curso
  professor_id INT         NOT NULL,                -- RN01: um único professor, o "dono" da turma
  semestre     CHAR(6)     NOT NULL,                -- ex.: 2026-2
  dias_semana  SET('seg', 'ter', 'qua', 'qui', 'sex', 'sab') NOT NULL,  -- ex.: 'seg,qua'
  hora_inicio  TIME        NOT NULL,
  hora_fim     TIME        NOT NULL,
  sala         VARCHAR(20) NOT NULL,
  max_alunos   TINYINT     NOT NULL DEFAULT 12,     -- RN10: no máximo 12
  FOREIGN KEY (curso_id)     REFERENCES cursos(id),
  FOREIGN KEY (professor_id) REFERENCES usuarios(id),
  CONSTRAINT chk_turmas_semestre   CHECK (semestre REGEXP '^[0-9]{4}-[12]$'),
  CONSTRAINT chk_turmas_horario    CHECK (hora_fim > hora_inicio),
  CONSTRAINT chk_turmas_max_alunos CHECK (max_alunos BETWEEN 1 AND 12),
  -- o XAMPP vem sem modo estrito: sem este CHECK, um dia inválido viraria '' sem dar erro
  CONSTRAINT chk_turmas_dias       CHECK (dias_semana <> '')
);

-- -----------------------------------------------------
-- Matrículas: resolvem o N:N entre alunos e turmas (RN02)
-- -----------------------------------------------------

CREATE TABLE matriculas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id       INT  NOT NULL,
  turma_id       INT  NOT NULL,
  data_matricula DATE NOT NULL,
  situacao       ENUM('ativa', 'cancelada', 'aprovado', 'reprovado') NOT NULL DEFAULT 'ativa',
  nota_final     DECIMAL(4,2),                      -- NULL até o professor lançar
  FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id),
  CONSTRAINT uq_matriculas_aluno_turma UNIQUE (aluno_id, turma_id),  -- RN04
  CONSTRAINT chk_matriculas_nota     CHECK (nota_final BETWEEN 0 AND 10),
  CONSTRAINT chk_matriculas_situacao CHECK (situacao <> '')  -- mesmo motivo do chk_turmas_dias
);

-- -----------------------------------------------------
-- Aulas e presença
-- -----------------------------------------------------

CREATE TABLE aulas (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  turma_id  INT          NOT NULL,
  data_aula DATE         NOT NULL,
  conteudo  VARCHAR(255) NOT NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id),
  CONSTRAINT uq_aulas_turma_data UNIQUE (turma_id, data_aula)  -- uma aula por turma por dia
);

-- N:N entre matrículas e aulas: uma linha por aluno em cada aula
CREATE TABLE presencas (
  aula_id      INT     NOT NULL,
  matricula_id INT     NOT NULL,
  presente     BOOLEAN NOT NULL,                    -- TRUE = presente, FALSE = ausente
  PRIMARY KEY (aula_id, matricula_id),
  FOREIGN KEY (aula_id)      REFERENCES aulas(id),
  FOREIGN KEY (matricula_id) REFERENCES matriculas(id)
);

-- Regras que não viram restrição de tabela (RN03 vagas, RN05 aprovação, RN08 responsável
-- de menores) são verificadas no back-end. Ver docs/documentacao-tecnica.md, seção 4.
