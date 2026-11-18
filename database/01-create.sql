-- =====================================================
-- Fala Mais - 01: criação do banco e das tabelas
-- Execute este script primeiro.
-- ATENÇÃO: o DROP apaga o banco inteiro. Use só em desenvolvimento.
-- =====================================================

DROP DATABASE IF EXISTS fala_mais;

CREATE DATABASE fala_mais
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fala_mais;

-- Crie as tabelas na ordem das dependências:
-- primeiro as que não têm chave estrangeira, depois as que referenciam outras.

-- Exemplo de formato (substitua pelas tabelas do modelo lógico):
--
-- CREATE TABLE exemplo (
--   id_exemplo INT AUTO_INCREMENT PRIMARY KEY,
--   nome       VARCHAR(100) NOT NULL,
--   criado_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
--
-- CREATE TABLE exemplo_filho (
--   id_filho   INT AUTO_INCREMENT PRIMARY KEY,
--   id_exemplo INT NOT NULL,
--   FOREIGN KEY (id_exemplo) REFERENCES exemplo(id_exemplo)
-- );
