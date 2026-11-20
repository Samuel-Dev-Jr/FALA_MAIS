# Fala Mais

**Cliente:** Escola de Idiomas Fala Mais · Projeto da UC5 – Banco de Dados (Dev Full Stack – SENAC)

Sistema que junta em um banco de dados só o que a escola controlava em planilhas separadas: alunos, cursos, turmas, matrículas, aulas, presença e notas.

## Integrantes

| Nome | Parte no projeto |
|---|---|
| Samuel Sousa Nunes | Banco de dados, documentação e middlewares |
| Fernando dos Santos Soares | Rotas de cursos e matrículas |
| Lucas Santos Rocha | Rotas de turmas e funcionários |
| Heitor Gazola Nunes da Cruz | Rotas de alunos e login |

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
│   ├── package.json
│   └── src/
│       ├── db.js
│       ├── server.js
│       ├── middlewares/
│       └── routes/
└── README.md
```

## Como rodar

### 1. Banco de dados

Com o MySQL ligado no XAMPP, rode os scripts na ordem: `01-create.sql` e depois `02-inserts.sql`.

- **phpMyAdmin:** aba **Importar**, um arquivo de cada vez.
- **Terminal**, dentro da pasta do projeto:

```bash
mysql -u root -e "source database/01-create.sql"
mysql -u root -e "source database/02-inserts.sql"
```

Os relatórios pedidos pelo cliente estão em `database/03-consultas.sql`.

### 2. Back-end

```bash
cd backend
npm install
copy .env.example .env    # no Linux/Mac: cp .env.example .env
```

No `.env`, preencha a senha do banco (no XAMPP fica vazia) e o `JWT_SECRET` (qualquer texto longo). Depois:

```bash
npm run dev
```

A API sobe em `http://localhost:3000`. Para conferir a conexão com o banco, acesse `http://localhost:3000/health`.

### 3. Testar as rotas

1. Faça `POST /login` com o corpo `{ "email": "marcos.ribeiro@falamais.com.br", "senha": "falamais123" }`. A resposta traz um `token`.
2. Nas outras rotas, envie o cabeçalho `Authorization: Bearer <token>`.

Usuários de teste (senha de todos: `falamais123`):

| E-mail | Perfil |
|---|---|
| marcos.ribeiro@falamais.com.br | coordenação |
| juliana.freire@falamais.com.br | secretaria |
| patricia.gomes@falamais.com.br | professor |

| Rota | Quem pode usar |
|---|---|
| `POST /login` | qualquer pessoa |
| `GET /alunos` · `POST /alunos` | secretaria e coordenação |
| `GET /alunos/:id/historico` | coordenação |
| `GET /cursos` | secretaria e coordenação |
| `POST /cursos` | coordenação |
| `GET /turmas?semestre=2026-2` · `GET /turmas/:id/chamada` | todos os perfis (o professor só vê as turmas dele) |
| `POST /turmas` | secretaria e coordenação |
| `GET /turmas/:id/presenca` · `GET /turmas/:id/resultado` | coordenação |
| `POST /turmas/:id/aulas` | professor e coordenação |
| `POST /matriculas` · `PATCH /matriculas/:id/cancelar` | secretaria e coordenação |
| `PATCH /matriculas/:id/nota` | professor e coordenação |
| `GET /usuarios` · `POST /usuarios` · `PATCH /usuarios/:id/desativar` | coordenação |

## Ferramentas e créditos

- MySQL (XAMPP), Node.js, Express, mysql2, dotenv, bcryptjs e jsonwebtoken.
- Diagramas no formato do draw.io.
- Parte dos documentos, dos scripts SQL e do código foi feita com ajuda do Claude (IA da Anthropic).
