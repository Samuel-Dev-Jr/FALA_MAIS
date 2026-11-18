# Modelo Lógico – Fala Mais

Legenda: **PK** = chave primária · **FK** = chave estrangeira · **NN** = NOT NULL · **UQ** = UNIQUE

## Tabelas

### nome_da_tabela

| Coluna      | Tipo         | Restrições    | Descrição |
|-------------|--------------|---------------|-----------|
| id_tabela   | INT          | PK, AUTO_INCREMENT |      |
| nome        | VARCHAR(100) | NN            |           |
| id_outra    | INT          | FK → outra(id_outra) |    |

<!-- Copie o bloco acima para cada tabela do modelo. -->

## Relacionamentos

| Tabela origem | Tabela destino | Cardinalidade | Chave estrangeira |
|---------------|----------------|---------------|-------------------|
|               |                | 1:N           |                   |
