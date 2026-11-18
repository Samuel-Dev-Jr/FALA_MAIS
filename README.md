# Fala Mais

Projeto da UC5 – Banco de Dados (Dev Full Stack – SENAC).

> Descreva aqui, em 2 ou 3 frases, o que é o sistema e qual problema ele resolve.

## Estrutura

```
fala-mais/
├── README.md
├── .gitignore
├── docs/
│   ├── requisitos.md
│   ├── conceitual.png      (+ conceitual.drawio)
│   ├── logico.md
│   ├── documentacao-tecnica.md
│   └── apresentacao.pdf
├── database/
│   ├── 01-create.sql
│   ├── 02-inserts.sql
│   └── 03-consultas.sql
└── backend/
    ├── .env.example
    ├── package.json
    └── src/
        ├── db.js
        └── server.js
```

## Como rodar

### 1. Banco de dados (MySQL)

Execute os scripts **na ordem**, pelo MySQL Workbench ou pelo terminal:

```bash
mysql -u root -p < database/01-create.sql
mysql -u root -p < database/02-inserts.sql
mysql -u root -p < database/03-consultas.sql
```

### 2. Backend (Node.js)

```bash
cd backend
npm install
copy .env.example .env    # no Linux/Mac: cp .env.example .env
```

Abra o `.env`, preencha a senha do banco e rode:

```bash
npm run dev
```

A API sobe em `http://localhost:3000`. Para testar a conexão com o banco, acesse `http://localhost:3000/health`.

## Documentação

- [Requisitos](docs/requisitos.md)
- [Modelo conceitual](docs/conceitual.png)
- [Modelo lógico](docs/logico.md)
- [Documentação técnica](docs/documentacao-tecnica.md)
- [Apresentação](docs/apresentacao.pdf)

## Equipe

- Nome – função
