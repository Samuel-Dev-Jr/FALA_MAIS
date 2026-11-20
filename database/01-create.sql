SET NAMES utf8mb4;

DROP DATABASE IF EXISTS fala_mais;
CREATE DATABASE fala_mais CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fala_mais;

CREATE TABLE perfis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(30) NOT NULL UNIQUE,
  descricao VARCHAR(150)
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(15),
  perfil_id INT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  telefone VARCHAR(15),
  email VARCHAR(100),
  responsavel_nome VARCHAR(100),
  responsavel_telefone VARCHAR(15)
);

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idioma VARCHAR(30) NOT NULL,
  nivel VARCHAR(30) NOT NULL,
  carga_horaria SMALLINT NOT NULL
);

CREATE TABLE turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  professor_id INT NOT NULL,
  semestre CHAR(6) NOT NULL,
  dias_semana VARCHAR(20) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  sala VARCHAR(20) NOT NULL,
  max_alunos TINYINT NOT NULL DEFAULT 12,
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

CREATE TABLE matriculas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_matricula DATE NOT NULL,
  situacao ENUM('ativa', 'cancelada', 'aprovado', 'reprovado') NOT NULL DEFAULT 'ativa',
  nota_final DECIMAL(4,2),
  UNIQUE (aluno_id, turma_id),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

CREATE TABLE aulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  conteudo VARCHAR(255) NOT NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

CREATE TABLE presencas (
  aula_id INT NOT NULL,
  matricula_id INT NOT NULL,
  presente BOOLEAN NOT NULL,
  PRIMARY KEY (aula_id, matricula_id),
  FOREIGN KEY (aula_id) REFERENCES aulas(id),
  FOREIGN KEY (matricula_id) REFERENCES matriculas(id)
);
