# Requisitos – Fala Mais

A Fala Mais é uma escola de inglês e espanhol. Hoje ela controla matrículas, turmas, notas e presença em planilhas separadas. O sistema junta tudo em um banco de dados só.

Os funcionários (secretaria, professores e coordenação) fazem login. Os alunos não acessam o sistema: só têm os dados cadastrados.

## Requisitos funcionais

| ID | Descrição |
|---|---|
| RF01 | Login dos funcionários com e-mail e senha. |
| RF02 | Cadastrar funcionários com perfil (secretaria, professor ou coordenação) e desativá-los. |
| RF03 | Cadastrar cursos: idioma, nível e carga horária. |
| RF04 | Cadastrar alunos: nome, CPF, data de nascimento, telefone, e-mail e, para menores, o responsável. |
| RF05 | Criar turmas: curso, professor, semestre, dias, horário, sala e máximo de alunos. |
| RF06 | Matricular alunos e cancelar matrículas. |
| RF07 | Registrar as aulas dadas e a presença de cada aluno. |
| RF08 | Lançar a nota final e corrigir notas. |
| RF09 | Mostrar a lista de chamada de uma turma. |
| RF10 | Mostrar as turmas do semestre com as vagas restantes. |
| RF11 | Mostrar o percentual de presença dos alunos de uma turma. |
| RF12 | Mostrar os aprovados e reprovados por turma. |
| RF13 | Mostrar o histórico de um aluno. |

## Regras de negócio

| ID | Descrição |
|---|---|
| RN01 | Uma turma pertence a um curso e tem um único professor. |
| RN02 | Um aluno pode estar em várias turmas, e uma turma tem vários alunos. |
| RN03 | A turma não pode passar do limite de alunos com matrícula ativa. |
| RN04 | Um aluno não pode ser matriculado duas vezes na mesma turma. |
| RN05 | Aprovado = nota final maior ou igual a 7,0 e presença de pelo menos 75% das aulas. |
| RN06 | Matrícula cancelada não é apagada. |
| RN07 | CPF do aluno e e-mail do funcionário não se repetem. |
| RN08 | Aluno menor de idade tem nome e telefone de um responsável. |

Fora do escopo: mensalidades, portal do aluno e material didático.
