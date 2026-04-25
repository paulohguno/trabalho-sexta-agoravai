-- Banco recomendado:
-- CREATE DATABASE restaurante_db;
-- O projeto cria e atualiza as tabelas automaticamente via Sequelize ao executar npm run dev.
-- Este arquivo existe como documentação da estrutura lógica principal.

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  id_funcao INTEGER NOT NULL DEFAULT 1,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cpf VARCHAR(255) UNIQUE,
  telefone VARCHAR(255),
  pontos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itens_menu (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(255) NOT NULL DEFAULT 'Prato',
  url_imagem VARCHAR(255),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS premios_roleta (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  desconto_percentual INTEGER NOT NULL DEFAULT 0,
  probabilidade_vitoria FLOAT NOT NULL,
  cor VARCHAR(255) NOT NULL DEFAULT '#ff8a00',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
