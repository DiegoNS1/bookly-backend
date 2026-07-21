# Bookly Backend

API REST do Bookly, uma plataforma de agendamento de serviços com área pública para clientes e recursos administrativos para gerenciamento de clientes, serviços e atendimentos.

## Funcionalidades

### Área pública

- Listagem de serviços ativos;
- Consulta de horários disponíveis por data;
- Bloqueio de horários já ocupados;
- Criação automática ou reutilização do cliente pelo telefone;
- Confirmação do agendamento com os dados relacionados.

### Área administrativa

- CRUD de clientes;
- CRUD de serviços;
- CRUD de agendamentos;
- Relacionamentos entre cliente, serviço e agendamento;
- Alteração do status do atendimento;
- Cancelamento e exclusão de agendamentos;
- Tratamento global e padronizado de erros.

## Tecnologias

- Node.js;
- Express;
- Prisma ORM;
- SQLite;
- JavaScript com ES Modules;
- CORS;
- Dotenv;
- Nodemon.

## Arquitetura

```text
Route -> Controller -> Service -> Prisma -> SQLite
```

```text
src/
├── controllers/
├── database/
├── middlewares/
├── routes/
├── services/
├── utils/
└── server.js
```

As rotas recebem as requisições, os controllers coordenam a resposta HTTP e os services concentram as regras de negócio e o acesso ao Prisma.

## Como executar localmente

### Pré-requisitos

- Node.js 20 ou superior;
- npm.

Clone o repositório:

```bash
git clone https://github.com/DiegoNS1/bookly-backend.git
cd bookly-backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

Gere o Prisma Client e execute as migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

## Scripts

```bash
npm run dev              # desenvolvimento com Nodemon
npm start                # execução normal
npm run prisma:generate  # gera o Prisma Client
npm run prisma:migrate   # executa migrations em desenvolvimento
```

## Endpoints

### Públicos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/services/public` | Lista serviços ativos |
| `GET` | `/appointments/available?date=YYYY-MM-DD` | Retorna horários livres |
| `POST` | `/appointments/public` | Cria um agendamento público |

### Clientes

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/clients` | Cria um cliente |
| `GET` | `/clients` | Lista clientes |
| `GET` | `/clients/:id` | Busca um cliente |
| `PUT` | `/clients/:id` | Atualiza um cliente |
| `DELETE` | `/clients/:id` | Exclui um cliente |

### Serviços

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/services` | Cria um serviço |
| `GET` | `/services` | Lista serviços |
| `GET` | `/services/:id` | Busca um serviço |
| `PUT` | `/services/:id` | Atualiza um serviço |
| `DELETE` | `/services/:id` | Exclui um serviço |

### Agendamentos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/appointments` | Cria um agendamento administrativo |
| `GET` | `/appointments` | Lista agendamentos e relacionamentos |
| `GET` | `/appointments/:id` | Busca um agendamento |
| `PUT` | `/appointments/:id` | Atualiza dados ou status |
| `DELETE` | `/appointments/:id` | Exclui um agendamento |

## Regras de negócio

- Cliente e serviço devem existir;
- Apenas serviços ativos podem ser agendados;
- A data deve estar no futuro;
- Dois agendamentos não podem ocupar o mesmo horário;
- Erros de validação retornam `400`;
- Recursos inexistentes retornam `404`;
- Conflitos retornam `409`;
- Erros inesperados retornam `500`.

## Inteligência Artificial

O **ChatGPT** foi utilizado como ferramenta de apoio durante o desenvolvimento para revisão de código, análise da arquitetura, identificação de erros, sugestões de regras de negócio, documentação e auxílio na integração com o frontend.

O uso da IA ocorreu de forma assistida: as decisões técnicas, alterações, testes e validações foram acompanhados e revisados durante o desenvolvimento.

## Deploy

A API está publicada no Render:

```text
https://bookly-backend-s8dq.onrender.com
```

> A versão atual utiliza SQLite. Em uma evolução para produção permanente, recomenda-se PostgreSQL para garantir persistência independente do sistema de arquivos da hospedagem.

## Autor

Desenvolvido por **Diego Novaes Seles**.
