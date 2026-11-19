# Documentação Técnica – Fala Mais

## 1. Visão geral

**Sistema:** Fala Mais · **SGBD:** MySQL (XAMPP) · **Banco:** `fala_mais` · **Tabelas:** 8

O banco guarda os cursos, turmas, matrículas, aulas, presença e notas da escola. Os funcionários entram com e-mail e senha e têm um de três perfis. Os alunos são só cadastrados.

Modelos: [conceitual](modelo-conceitual.png) · [lógico](modelo-logico.png)

## 2. Dicionário de dados

### perfis


| Coluna    | Tipo         | Nulo? | Chave  | Descrição                          |
| --------- | ------------ | ----- | ------ | ------------------------------------ |
| id        | INT          | Não  | PK     | Identificador                        |
| nome      | VARCHAR(30)  | Não  | UNIQUE | secretaria, professor ou coordenacao |
| descricao | VARCHAR(150) | Sim   | —     | O que o perfil faz                   |

### usuarios (funcionários)


| Coluna     | Tipo         | Nulo? | Chave        | Descrição                          |
| ---------- | ------------ | ----- | ------------ | ------------------------------------ |
| id         | INT          | Não  | PK           | Identificador                        |
| nome       | VARCHAR(100) | Não  | —           | Nome                                 |
| email      | VARCHAR(100) | Não  | UNIQUE       | Login                                |
| senha_hash | VARCHAR(255) | Não  | —           | Hash bcrypt da senha                 |
| telefone   | VARCHAR(15)  | Sim   | —           | Telefone                             |
| perfil_id  | INT          | Não  | FK → perfis | Perfil de acesso                     |
| ativo      | BOOLEAN      | Não  | —           | Padrão TRUE; FALSE = saiu da escola |

### alunos


| Coluna               | Tipo         | Nulo? | Chave  | Descrição               |
| -------------------- | ------------ | ----- | ------ | ------------------------- |
| id                   | INT          | Não  | PK     | Identificador             |
| nome                 | VARCHAR(100) | Não  | —     | Nome                      |
| cpf                  | CHAR(11)     | Não  | UNIQUE | Só números              |
| data_nascimento      | DATE         | Não  | —     | Data de nascimento        |
| telefone             | VARCHAR(15)  | Sim   | —     | Telefone                  |
| email                | VARCHAR(100) | Sim   | —     | E-mail                    |
| responsavel_nome     | VARCHAR(100) | Sim   | —     | Só para menores de idade |
| responsavel_telefone | VARCHAR(15)  | Sim   | —     | Só para menores de idade |

### cursos


| Coluna        | Tipo        | Nulo? | Chave | Descrição         |
| ------------- | ----------- | ----- | ----- | ------------------- |
| id            | INT         | Não  | PK    | Identificador       |
| idioma        | VARCHAR(30) | Não  | —    | Inglês ou Espanhol |
| nivel         | VARCHAR(30) | Não  | —    | Ex.: Básico 1      |
| carga_horaria | SMALLINT    | Não  | —    | Em horas            |

### turmas


| Coluna       | Tipo        | Nulo? | Chave          | Descrição        |
| ------------ | ----------- | ----- | -------------- | ------------------ |
| id           | INT         | Não  | PK             | Identificador      |
| curso_id     | INT         | Não  | FK → cursos   | Curso da turma     |
| professor_id | INT         | Não  | FK → usuarios | Professor da turma |
| semestre     | CHAR(6)     | Não  | —             | Ex.: 2026-2        |
| dias_semana  | VARCHAR(20) | Não  | —             | Ex.: seg e qua     |
| hora_inicio  | TIME        | Não  | —             | Início da aula    |
| hora_fim     | TIME        | Não  | —             | Fim da aula        |
| sala         | VARCHAR(20) | Não  | —             | Sala               |
| max_alunos   | TINYINT     | Não  | —             | Padrão 12         |

### matriculas


| Coluna         | Tipo         | Nulo? | Chave        | Descrição                                             |
| -------------- | ------------ | ----- | ------------ | ------------------------------------------------------- |
| id             | INT          | Não  | PK           | Identificador                                           |
| aluno_id       | INT          | Não  | FK → alunos | Aluno                                                   |
| turma_id       | INT          | Não  | FK → turmas | Turma; o par aluno + turma é UNIQUE                    |
| data_matricula | DATE         | Não  | —           | Dia da matrícula                                       |
| situacao       | ENUM         | Não  | —           | ativa, cancelada, aprovado ou reprovado (padrão ativa) |
| nota_final     | DECIMAL(4,2) | Sim   | —           | Vazia até o professor lançar                          |

### aulas


| Coluna    | Tipo         | Nulo? | Chave        | Descrição    |
| --------- | ------------ | ----- | ------------ | -------------- |
| id        | INT          | Não  | PK           | Identificador  |
| turma_id  | INT          | Não  | FK → turmas | Turma da aula  |
| data_aula | DATE         | Não  | —           | Dia da aula    |
| conteudo  | VARCHAR(255) | Não  | —           | Conteúdo dado |

### presencas


| Coluna       | Tipo    | Nulo? | Chave                | Descrição                      |
| ------------ | ------- | ----- | -------------------- | -------------------------------- |
| aula_id      | INT     | Não  | PK, FK → aulas      | Aula                             |
| matricula_id | INT     | Não  | PK, FK → matriculas | Matrícula do aluno              |
| presente     | BOOLEAN | Não  | —                   | TRUE = presente, FALSE = ausente |

## 3. Matriz de permissões


| Ação                              | Secretaria | Professor                | Coordenação |
| ----------------------------------- | ---------- | ------------------------ | ------------- |
| Cadastrar alunos                    | Sim        | Não                     | Sim           |
| Cadastrar cursos                    | Não       | Não                     | Sim           |
| Cadastrar e desativar funcionários | Não       | Não                     | Sim           |
| Criar turmas                        | Sim        | Não                     | Sim           |
| Ver turmas                          | Sim        | Sim, só as dele         | Sim           |
| Matricular e cancelar matrículas   | Sim        | Não                     | Sim           |
| Registrar aulas, presença e notas  | Não       | Sim, só nas turmas dele | Sim           |
| Corrigir notas                      | Não       | Não                     | Sim           |
| Ver lista de chamada                | Sim        | Sim, só das turmas dele | Sim           |
| Ver os outros relatórios           | Não       | Não                     | Sim           |

O "só as dele" vem da coluna `turmas.professor_id`.

## 4. Decisões

O que o briefing não dizia e nós decidimos:


| Nº | Decisão                                                                                        | Motivo                                                   |
| --- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| D01 | Perfis em uma tabela própria                                                                   | Um perfil novo entra com um INSERT                       |
| D02 | Alunos ficam separados dos funcionários e não têm senha                                      | Alunos não acessam o sistema                            |
| D03 | O limite de vagas (RN03) é conferido no back-end antes de matricular                           | O banco não tem uma regra simples para contar registros |
| D04 | A situação aprovado ou reprovado é gravada na matrícula no fim do semestre, seguindo a RN05 | Assim o histórico do aluno fica guardado                |
| D05 | A presença é ligada à matrícula, e não ao aluno                                            | Só quem está matriculado na turma tem presença        |
| D06 | O responsável fica na própria tabela de alunos, vazio para os maiores de idade                | Cada aluno menor tem um responsável só                 |

## 5. Como rodar

1. Ligar o MySQL no XAMPP.
2. Rodar `database/01-create.sql` e depois `database/02-inserts.sql`.
3. Rodar as consultas de `database/03-consultas.sql`.

Senha de teste de todos os funcionários: `falamais123` (ex.: `marcos.ribeiro@falamais.com.br`, da coordenação).
