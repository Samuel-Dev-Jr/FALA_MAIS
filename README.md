# Fala Mais

**Cliente:** Escola de Idiomas Fala Mais · Projeto da UC5 – Banco de Dados (Dev Full Stack – SENAC)

Sistema que junta em um banco de dados só o que a escola controlava em planilhas separadas: alunos, cursos, turmas, matrículas, aulas, presença e notas.

## Integrantes

- Nome – função

## Estrutura

```
fala-mais/
├── docs/
│   ├── requisitos.md
│   ├── modelo-conceitual.png   (+ .drawio)
│   ├── modelo-logico.png       (+ .drawio)
│   ├── documentacao-tecnica.md
│   └── apresentacao-cliente.pdf
├── database/
│   ├── 01-create.sql
│   ├── 02-inserts.sql
│   └── 03-consultas.sql
├── backend/
│   ├── .env.example
│   └── src/...
└── README.md
```

## Como rodar

### 1. Banco de dados

Com o MySQL ligado no XAMPP, rode na ordem (phpMyAdmin, MySQL Workbench ou terminal):

```bash
mysql -u root -p < database/01-create.sql
mysql -u root -p < database/02-inserts.sql
```

Os relatórios do cliente estão em `database/03-consultas.sql`.

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

## Ferramentas e créditos

- MySQL (XAMPP), Node.js, Express, mysql2 e dotenv.
- Diagramas no formato do draw.io.
- Parte dos documentos, dos scripts SQL e dos diagramas foi feita com ajuda do Claude (IA da Anthropic).
