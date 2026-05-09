# Roda & Sabor - Restaurante Gamificado

Sistema completo com back-end, front-end, PostgreSQL, pedidos, pontos, cupons e roleta de descontos.

## O que foi implementado

- Front-end completo em HTML, CSS e JavaScript servido pelo próprio Express.
- Cadastro e login de usuários.
- Middleware de autenticação por token.
- Banco PostgreSQL com Sequelize.
- Menu do restaurante com cadastro de itens pelo admin.
- Carrinho e checkout com simulação de pagamento.
- Sistema de pontos: 1 ponto a cada R$ 1 pago.
- Roleta gamificada: 100 pontos = 1 giro.
- Cupons gerados automaticamente pela roleta.
- Uso de cupom no checkout.
- Extrato de pontos.
- Dados iniciais automáticos: usuário admin, itens de menu e prêmios da roleta.

## Requisitos

- Node.js instalado.
- PostgreSQL instalado e rodando.

## Configuração do banco

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE restaurante_db;
```

Depois copie o arquivo de exemplo para criar suas variáveis locais:

```txt
.env.example -> .env
```

Ajuste usuário e senha conforme o seu PostgreSQL:

```env
API_PORT=3333
POSTGRES_DB=restaurante_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_PASSWORD=abcabcabc
POSTGRES_USERNAME=postgres
JWT_SECRET=roda_sabor_chave_secreta
```

O arquivo `.env` fica fora do repositório e não deve ser enviado para o GitHub.

## Como rodar

Na pasta do projeto:

```bash
npm install
npm run dev
```

Depois acesse:

```txt
http://localhost:3333
```

## Login admin

```txt
E-mail: admin@rodaesabor.com
Senha: admin123
```

## Rotas principais da API

### Autenticação

- `POST /api/auth/cadastro`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Menu

- `GET /api/menu`
- `POST /api/menu` somente admin
- `PUT /api/menu/:id` somente admin
- `DELETE /api/menu/:id` somente admin

### Roleta e cupons

- `GET /api/roleta/premios`
- `POST /api/roleta/girar`
- `GET /api/roleta/cupons`

### Pedidos

- `GET /api/pedidos`
- `POST /api/pedidos`

### Pontos

- `GET /api/pontos/extrato`

## Observações

O Sequelize sincroniza as tabelas automaticamente ao iniciar o servidor. Por isso, depois de criar o banco, basta rodar `npm run dev`.
