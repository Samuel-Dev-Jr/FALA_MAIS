# Documentação Técnica – Fala Mais

Para quem vai trabalhar no projeto: aqui está o que é preciso para entender o banco sem perguntar nada ao grupo.

## 1. Visão geral

**Sistema:** Fala Mais · **SGBD:** MariaDB 10.4 (XAMPP), compatível com MySQL 8 · **Banco:** `fala_mais` · **Tabelas:** 8

Banco de dados da escola de idiomas Fala Mais. Guarda cursos, turmas, matrículas, aulas, presença e notas, que hoje ficam em planilhas separadas. Funcionários entram com e-mail e senha e têm um de três perfis: secretaria, professor ou coordenação. Alunos são apenas cadastrados; não acessam o sistema.

| Script | O que faz |
|---|---|
| [01-create.sql](../database/01-create.sql) | Cria o banco e as 8 tabelas (modelo físico) |
| [02-inserts.sql](../database/02-inserts.sql) | Insere dados de exemplo |
| [03-consultas.sql](../database/03-consultas.sql) | Os 5 relatórios pedidos pelo cliente |

Modelos: [requisitos e regras](requisitos.md) · [conceitual](conceitual.png) · [lógico](logico.md)

## 2. Dicionário de dados

### perfis

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador do perfil |
| nome | VARCHAR(30) | Não | UNIQUE | `secretaria`, `professor` ou `coordenacao`. É o valor que o back-end confere em cada rota |
| descricao | VARCHAR(150) | Sim | — | O que o perfil pode fazer, em uma frase |

### usuarios

Funcionários da escola. São os únicos que fazem login.

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador do funcionário |
| nome | VARCHAR(100) | Não | — | Nome completo |
| email | VARCHAR(100) | Não | UNIQUE | Login. Não se repete (RN07) |
| senha_hash | VARCHAR(255) | Não | — | Hash bcrypt da senha, nunca a senha pura |
| telefone | VARCHAR(15) | Sim | — | Só números, com DDD |
| perfil_id | INT | Não | FK → perfis.id | Perfil de acesso |
| ativo | BOOLEAN | Não | — | Padrão TRUE. FALSE = saiu da escola: não entra mais, mas continua no histórico (RN09) |

### alunos

Cadastro: alunos não fazem login.

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador do aluno |
| nome | VARCHAR(100) | Não | — | Nome completo |
| cpf | CHAR(11) | Não | UNIQUE | Só os 11 números (CHECK). Não se repete (RN07) |
| data_nascimento | DATE | Não | — | Diz se o aluno é menor de idade (RN08) |
| telefone | VARCHAR(15) | Sim | — | Opcional: crianças podem não ter (D10) |
| email | VARCHAR(100) | Sim | — | Opcional (D10) |
| responsavel_nome | VARCHAR(100) | Sim | — | Obrigatório para menores de 18 anos (RN08, verificado no back-end) |
| responsavel_telefone | VARCHAR(15) | Sim | — | Preenchido junto com o nome do responsável (CHECK) |

### cursos

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador do curso |
| idioma | VARCHAR(30) | Não | UNIQUE (idioma, nivel) | Ex.: Inglês, Espanhol |
| nivel | VARCHAR(30) | Não | UNIQUE (idioma, nivel) | Ex.: Básico 1. O mesmo idioma não repete nível |
| carga_horaria | SMALLINT | Não | — | Em horas, maior que zero (CHECK). Ex.: 60 |

### turmas

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador da turma |
| curso_id | INT | Não | FK → cursos.id | Curso da turma (RN01) |
| professor_id | INT | Não | FK → usuarios.id | Único professor da turma (RN01). Define quais turmas o professor vê |
| semestre | CHAR(6) | Não | — | Formato AAAA-1 ou AAAA-2 (CHECK). Ex.: 2026-2 |
| dias_semana | SET('seg','ter','qua','qui','sex','sab') | Não | — | Um ou mais dias. Ex.: seg,qua |
| hora_inicio | TIME | Não | — | Início da aula |
| hora_fim | TIME | Não | — | Fim da aula, depois de hora_inicio (CHECK) |
| sala | VARCHAR(20) | Não | — | Ex.: Sala 1 |
| max_alunos | TINYINT | Não | — | De 1 a 12 (CHECK), padrão 12 (RN10) |

### matriculas

Liga um aluno a uma turma (o N:N da RN02).

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador da matrícula |
| aluno_id | INT | Não | FK → alunos.id | Aluno matriculado |
| turma_id | INT | Não | FK → turmas.id | Turma. O par (aluno_id, turma_id) é UNIQUE (RN04) |
| data_matricula | DATE | Não | — | Dia da matrícula |
| situacao | ENUM('ativa','cancelada','aprovado','reprovado') | Não | — | Padrão 'ativa'. Cancelada não é apagada (RN06). Aprovado ou reprovado é gravado no fechamento do semestre (D06) |
| nota_final | DECIMAL(4,2) | Sim | — | De 0 a 10 (CHECK). NULL = ainda não lançada |

### aulas

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| id | INT AUTO_INCREMENT | Não | PK | Identificador da aula |
| turma_id | INT | Não | FK → turmas.id | Turma em que a aula foi dada |
| data_aula | DATE | Não | — | Dia da aula. O par (turma_id, data_aula) é UNIQUE (D13) |
| conteudo | VARCHAR(255) | Não | — | Conteúdo dado |

### presencas

Uma linha por aluno matriculado em cada aula (N:N entre matrículas e aulas).

| Coluna | Tipo | Nulo? | Chave | Descrição |
|---|---|---|---|---|
| aula_id | INT | Não | PK, FK → aulas.id | Aula |
| matricula_id | INT | Não | PK, FK → matriculas.id | Matrícula do aluno na turma da aula (D07) |
| presente | BOOLEAN | Não | — | TRUE = presente, FALSE = ausente |

## 3. Matriz de permissões

| Ação | Secretaria | Professor | Coordenação |
|---|---|---|---|
| Cadastrar alunos | Sim | Não | Sim |
| Cadastrar cursos | Não | Não | Sim |
| Cadastrar e desativar funcionários | Não | Não | Sim |
| Criar turmas | Sim | Não | Sim |
| Ver turmas | Sim, todas | Sim, só as dele | Sim, todas |
| Matricular e cancelar matrículas | Sim | Não | Sim |
| Registrar aulas e presença | Não | Sim, só nas turmas dele | Sim |
| Lançar nota final | Não | Sim, só nas turmas dele | Sim |
| Corrigir nota já lançada | Não | Não | Sim |
| Lista de chamada (relatório 1) | Sim | Sim, só das turmas dele | Sim |
| Turmas do semestre e vagas (relatório 2) | Sim | Sim, só as dele | Sim |
| Presença, aprovados e histórico (relatórios 3, 4 e 5) | Não | Não | Sim |

**Como o "só as dele" funciona no banco:** `turmas.professor_id` diz de quem é a turma. Toda consulta do professor filtra por `t.professor_id = <id de quem está logado>` (exemplo no fim de `03-consultas.sql`). Aulas, presenças e notas chegam à turma pelo `turma_id`, então o mesmo filtro vale para elas.

## 4. Decisões e suposições

O que o briefing não dizia e o grupo decidiu. As marcadas com **validar** precisam ser confirmadas com o cliente.

| Nº | Decisão | Motivo |
|---|---|---|
| D01 | Perfis em tabela própria (`perfis`), não ENUM | Novo perfil entra com um INSERT (opção B do material) |
| D02 | Alunos ficam na tabela `alunos`, separada de `usuarios`, e não têm senha | Alunos não entram no sistema nesta fase |
| D03 | `matriculas` é uma tabela com UNIQUE (aluno_id, turma_id) | Resolve o N:N da RN02 e impede matrícula duplicada (RN04) |
| D04 | Se um aluno cancelar e voltar para a mesma turma, a matrícula cancelada é reativada (situação volta para 'ativa'), em vez de criar outra. **Validar** | O UNIQUE da D03 não deixa criar uma segunda matrícula na mesma turma |
| D05 | O limite de vagas (RN03) é verificado no back-end antes do INSERT: conta as matrículas 'ativa' da turma e compara com `max_alunos` | O MySQL não tem restrição simples para contar registros |
| D06 | A aprovação (RN05) é calculada pelo relatório 4 e, no fechamento do semestre, gravada em `matriculas.situacao` | A regra depende de nota e presença juntas; gravar o resultado deixa o histórico fixo |
| D07 | A presença é ligada à matrícula (`matricula_id`), não ao aluno. O back-end confere se a matrícula é da mesma turma da aula | Só quem está matriculado tem presença, e o percentual sai direto por matrícula |
| D08 | O percentual de presença conta sobre todas as aulas registradas da turma; aula sem presença lançada conta como falta. **Validar** o caso de aluno que entra no meio do semestre | É a leitura mais simples de "75% das aulas" (RN05) |
| D09 | O responsável fica em duas colunas opcionais de `alunos`. Um CHECK exige que nome e telefone venham juntos; o back-end exige o responsável quando o aluno tem menos de 18 anos (RN08) | Cada aluno menor tem um responsável e o briefing não pede mais dados dele. O CHECK não pode usar a data de hoje para calcular a idade |
| D10 | Telefone e e-mail do aluno são opcionais | Crianças podem não ter; nesse caso o contato é o do responsável |
| D11 | Dias da semana em uma coluna SET ('seg', 'ter'...) e um único horário por turma | O briefing dá um horário por turma, e o SET só aceita dias válidos |
| D12 | `max_alunos` vai de 1 a 12 (CHECK), com padrão 12 | RN10. Uma turma pode abrir com menos vagas (ex.: sala menor) |
| D13 | Uma aula por turma por dia: UNIQUE (turma_id, data_aula) | Evita lançar a mesma aula duas vezes |
| D14 | Funcionários são desativados (`ativo = FALSE`), nunca apagados. O back-end não deixa um inativo entrar nem ser escolhido como professor de turma nova | Eles continuam no histórico das turmas (ex.: Beatriz Lacerda, id 10, nos dados de exemplo) |
| D15 | "Corrigir notas" = alterar uma nota já lançada, e só a coordenação faz isso. **Validar** se o professor pode corrigir a própria nota antes do fechamento | O briefing dá "corrigir notas" só à coordenação |
| D16 | O professor vê a lista de chamada das turmas dele; os relatórios de presença, aprovação e histórico ficam só com a coordenação. **Validar** | O professor precisa da lista para lançar presença; o briefing dá "ver relatórios" só à coordenação |
| D17 | CHECKs extras em `dias_semana` e `situacao` impedem valor vazio | O MariaDB do XAMPP vem sem modo estrito: um valor inválido em SET ou ENUM viraria texto vazio sem dar erro |

**Usuário do MySQL da aplicação.** No XAMPP da aula usamos `root`. Em produção, a API usa um usuário próprio, só com as permissões de que precisa:

```sql
CREATE USER 'app_falamais'@'localhost' IDENTIFIED BY 'troque-esta-senha';
GRANT SELECT, INSERT, UPDATE, DELETE ON fala_mais.* TO 'app_falamais'@'localhost';
```

## 5. Como rodar

1. Iniciar o MySQL no XAMPP.
2. Executar, nesta ordem, `database/01-create.sql` e `database/02-inserts.sql` (phpMyAdmin, aba SQL, ou MySQL Workbench).
3. Abrir `database/03-consultas.sql` e rodar uma consulta por vez.

Usuários de teste (senha de todos: `falamais123`):

| E-mail | Perfil | Para testar |
|---|---|---|
| marcos.ribeiro@falamais.com.br | coordenacao | Acesso total |
| juliana.freire@falamais.com.br | secretaria | Matrícula na turma 3, que está lotada |
| patricia.gomes@falamais.com.br | professor | Só deve ver as turmas 1 e 4 |
| ricardo.tavares@falamais.com.br | professor | Só deve ver a turma 3 |
| beatriz.lacerda@falamais.com.br | professor | Inativa: o login deve ser recusado |
