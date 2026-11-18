# Modelo Lógico – Fala Mais

Feito a partir do [modelo conceitual](conceitual.png). Todas as tabelas usam `id` como chave primária, e as chaves estrangeiras se chamam `<tabela no singular>_id`.

## Tabelas

| Tabela | Colunas | Chaves |
|---|---|---|
| perfis | id, nome, descricao | PK id; nome UNIQUE |
| usuarios | id, nome, email, senha_hash, telefone, perfil_id, ativo | PK id; FK perfil_id → perfis; email UNIQUE |
| alunos | id, nome, cpf, data_nascimento, telefone, email, responsavel_nome, responsavel_telefone | PK id; cpf UNIQUE |
| cursos | id, idioma, nivel, carga_horaria | PK id; UNIQUE (idioma, nivel) |
| turmas | id, curso_id, professor_id, semestre, dias_semana, hora_inicio, hora_fim, sala, max_alunos | PK id; FKs curso_id → cursos, professor_id → usuarios |
| matriculas | id, aluno_id, turma_id, data_matricula, situacao, nota_final | PK id; FKs aluno_id → alunos, turma_id → turmas; UNIQUE (aluno_id, turma_id) |
| aulas | id, turma_id, data_aula, conteudo | PK id; FK turma_id → turmas; UNIQUE (turma_id, data_aula) |
| presencas | aula_id, matricula_id, presente | PK composta (aula_id, matricula_id); FKs → aulas, matriculas |

## Do conceitual ao lógico

| Relacionamento no conceitual | Cardinalidade | Como ficou no lógico |
|---|---|---|
| PERFIL possui USUARIO | 1:N | FK perfil_id em usuarios |
| USUARIO (professor) leciona TURMA | 1:N | FK professor_id em turmas |
| CURSO oferece TURMA | 1:N | FK curso_id em turmas |
| TURMA tem AULA | 1:N | FK turma_id em aulas |
| ALUNO faz MATRICULA | 1:N | FK aluno_id em matriculas |
| TURMA recebe MATRICULA | 1:N | FK turma_id em matriculas |
| MATRICULA tem presença em AULA | N:N | Tabela associativa presencas, com a coluna presente |

`matriculas` é o que resolve o N:N entre alunos e turmas da RN02: cada linha liga um aluno a uma turma e guarda os dados daquele vínculo (data, situação e nota final).

As regras RN03 (vagas), RN05 (aprovação) e RN08 (responsável de menores) não viram restrição de tabela. As decisões sobre elas estão na [documentação técnica](documentacao-tecnica.md#4-decisões-e-suposições).
