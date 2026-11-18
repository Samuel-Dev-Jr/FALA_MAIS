# Documentação Técnica – Fala Mais

## 1. Tecnologias

| Camada         | Tecnologia            |
|----------------|-----------------------|
| Banco de dados | MySQL                 |
| Backend        | Node.js + Express     |
| Driver do banco| mysql2                |
| Configuração   | dotenv (arquivo .env) |

## 2. Configuração do ambiente

1. Instale o MySQL e o Node.js.
2. Rode os scripts da pasta `database/` na ordem (`01`, `02`, `03`).
3. Na pasta `backend/`, copie `.env.example` para `.env` e preencha a senha.
4. Rode `npm install` e depois `npm run dev`.

## 3. Banco de dados

| Script             | O que faz                                  |
|--------------------|--------------------------------------------|
| `01-create.sql`    | Cria o banco `fala_mais` e as tabelas      |
| `02-inserts.sql`   | Insere dados de exemplo                    |
| `03-consultas.sql` | Consultas que respondem às perguntas do projeto |

Modelos: [conceitual](conceitual.png) · [lógico](logico.md)

## 4. API

URL base: `http://localhost:3000`

| Método | Rota      | Descrição                              |
|--------|-----------|----------------------------------------|
| GET    | `/health` | Verifica se a API e o banco respondem  |

<!-- Adicione uma linha para cada rota criada. -->

## 5. Decisões técnicas

Registre aqui escolhas importantes e o motivo (ex.: por que um campo é UNIQUE, por que uma tabela foi separada).
