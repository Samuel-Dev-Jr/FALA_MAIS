# Requisitos – Fala Mais

## 1. Visão geral

A Fala Mais é uma escola de idiomas com cursos de inglês e espanhol, organizados em níveis (Básico 1, Básico 2, Intermediário...). A equipe tem 1 coordenador, 2 pessoas na secretaria e 6 professores. São cerca de 20 turmas por semestre, com no máximo 12 alunos cada.

Hoje cada informação fica em uma planilha diferente (matrículas, turmas, notas, presença). Cada professor manda a lista de chamada de um jeito, já houve matrícula em turma lotada e, no fim do semestre, o coordenador leva dias para descobrir quem foi aprovado. O sistema reúne tudo em um único banco de dados.

## 2. Quem usa o sistema

| Grupo | Quem | Tem login? |
|---|---|---|
| Usuários do sistema | Secretaria, professores e coordenação | Sim, com e-mail e senha |
| Cadastros | Alunos (e o responsável, no caso de menores de idade) | Não. Alunos não acessam o sistema nesta fase |

## 3. Requisitos funcionais

| ID | Descrição |
|---|---|
| RF01 | O sistema deve permitir que os funcionários entrem com e-mail e senha. |
| RF02 | O sistema deve cadastrar funcionários, com perfil (secretaria, professor ou coordenação), e permitir desativá-los. |
| RF03 | O sistema deve cadastrar cursos (idioma, nível e carga horária). |
| RF04 | O sistema deve cadastrar alunos (nome, CPF, data de nascimento, telefone e e-mail) e, para menores de idade, o nome e o telefone de um responsável. |
| RF05 | O sistema deve cadastrar turmas (curso, professor, semestre, dias da semana, horário, sala e quantidade máxima de alunos). |
| RF06 | O sistema deve matricular alunos em turmas e cancelar matrículas. |
| RF07 | O sistema deve registrar as aulas dadas (data e conteúdo). |
| RF08 | O sistema deve registrar, em cada aula, se cada aluno matriculado esteve presente ou ausente. |
| RF09 | O sistema deve registrar a nota final de cada aluno na turma e permitir que a coordenação corrija notas. |
| RF10 | O sistema deve emitir a lista de chamada de uma turma: alunos com matrícula ativa, em ordem alfabética. |
| RF11 | O sistema deve listar as turmas do semestre com curso, professor, horário e vagas restantes. |
| RF12 | O sistema deve mostrar o percentual de presença de cada aluno em uma turma. |
| RF13 | O sistema deve listar os alunos aprovados e reprovados por turma. |
| RF14 | O sistema deve mostrar o histórico de um aluno: cursos feitos, semestre, nota e situação. |

## 4. Requisitos não funcionais

| ID | Descrição |
|---|---|
| RNF01 | O banco de dados é MySQL (MariaDB do XAMPP), com os scripts SQL guardados no GitHub. |
| RNF02 | Cada funcionário só faz o que o perfil dele permite (controle de acesso por perfil). |
| RNF03 | O professor só vê e altera os dados das turmas dele. |
| RNF04 | Senhas são guardadas só como hash (bcrypt), nunca a senha pura. |
| RNF05 | Dados pessoais dos alunos (CPF, data de nascimento, contato do responsável) só são vistos por quem precisa deles para trabalhar (LGPD). |
| RNF06 | A senha do banco fica no arquivo `.env`, que não vai para o GitHub. |
| RNF07 | O banco usa utf8mb4, para gravar nomes com acento (ex.: Lucía, Inglês). |

## 5. Regras de negócio

RN01 a RN07 vêm do briefing, com a mesma numeração. RN08 a RN10 o grupo tirou do restante do briefing.

| ID | Descrição |
|---|---|
| RN01 | Uma turma pertence a um curso e tem um único professor. |
| RN02 | Um aluno pode estar em várias turmas (ex.: inglês e espanhol), e uma turma tem vários alunos. |
| RN03 | A turma não pode passar do limite de alunos com matrícula ativa. |
| RN04 | Um aluno não pode ser matriculado duas vezes na mesma turma. |
| RN05 | Aprovado = nota final maior ou igual a 7,0 e presença de pelo menos 75% das aulas. |
| RN06 | Matrícula cancelada não é apagada, porque faz parte do histórico do aluno. |
| RN07 | CPF do aluno e e-mail do funcionário não se repetem. |
| RN08 | Aluno menor de idade precisa ter nome e telefone de um responsável. |
| RN09 | Funcionário que sai da escola é desativado, não apagado. |
| RN10 | Cada turma tem no máximo 12 alunos. |

## 6. Fora do escopo

Mensalidades e pagamentos, portal do aluno e material didático ficam para uma próxima fase.
