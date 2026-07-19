# Bookly Backend

API REST desenvolvida para gerenciamento de clientes, serviços e agendamentos.

O projeto foi construído com Node.js, Express, Prisma ORM e SQLite, utilizando uma arquitetura em camadas para separar rotas, controllers, services e acesso ao banco de dados.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- SQLite
- JavaScript
- Nodemon
- CORS
- Dotenv

## Funcionalidades

### Clientes

- Criar cliente
- Listar clientes
- Buscar cliente por ID
- Atualizar cliente
- Excluir cliente
- Impedir cadastro de e-mail duplicado

### Serviços

- Criar serviço
- Listar serviços
- Buscar serviço por ID
- Atualizar serviço
- Excluir serviço
- Impedir cadastro de serviço com nome duplicado

### Agendamentos

- Criar agendamento
- Listar agendamentos
- Buscar agendamento por ID
- Atualizar agendamento
- Excluir agendamento
- Validar cliente existente
- Validar serviço existente
- Impedir agendamento com serviço inativo
- Impedir agendamento em data passada
- Impedir dois agendamentos no mesmo horário

## Arquitetura

```text
src/
├── controllers/
├── database/
├── middlewares/
├── routes/
├── services/
├── utils/
└── server.js