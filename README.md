# Test Avantsoft - Sistema de Gerenciamento de Clientes

Este projeto é um sistema completo de gerenciamento de clientes com API real e interface React.

## 🚀 Funcionalidades

- **API REST completa** com Express.js
- **Interface React** moderna com TypeScript
- **CRUD completo** de clientes (Criar, Ler, Atualizar, Deletar)
- **Gerenciamento de vendas** por cliente
- **Autenticação** de usuários
- **Dashboard** com estatísticas
- **Responsivo** com Tailwind CSS

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone hhttps://github.com/IagoPuzer/Avantsoft-test.git
cd Avantsoft-test
```

2. **Instale as dependências**

```bash
npm install
```

## 🚀 Como executar

### Opção 1: Usando a API Express.js (Recomendado)

1. **Inicie a API**

```bash
npm run api
```

2. **Em outro terminal, inicie o frontend**

```bash
npm run dev
```

### Opção 2: Usando JSON Server

1. **Inicie o JSON Server**

```bash
npm run json-server
```

2. **Em outro terminal, inicie o frontend**

```bash
npm run dev
```

## 📡 Endpoints da API

### Clientes

- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente

### Vendas

- `POST /api/clientes/:id/vendas` - Adicionar venda ao cliente
- `DELETE /api/clientes/:id/vendas/:index` - Remover venda do cliente

### Status

- `GET /api/health` - Verificar status da API

## 📊 Estrutura de Dados

### Cliente

```json
{
  "id": "string",
  "info": {
    "nomeCompleto": "string",
    "detalhes": {
      "email": "string",
      "nascimento": "YYYY-MM-DD"
    }
  },
  "estatisticas": {
    "vendas": [
      {
        "data": "YYYY-MM-DD",
        "valor": number
      }
    ]
  }
}
```

### Venda

```json
{
  "data": "YYYY-MM-DD",
  "valor": number
}
```

## 🎯 Como usar

1. **Acesse a aplicação** em `http://localhost:5173`
2. **Faça login** com login e senha aletórios:
3. **Navegue pelo dashboard** para ver estatísticas
4. **Gerencie clientes** na página de clientes:
   - Adicione novos clientes
   - Edite informações existentes
   - Exclua clientes
   - Adicione vendas aos clientes

## 🛠️ Tecnologias utilizadas

### Backend

- **Express.js** - Framework web
- **CORS** - Middleware para CORS
- **JSON Server** - API REST alternativa

### Frontend

- **React 19** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **TanStack Query (React Query)** - Gerenciamento de cache e requisições assíncronas
- **React Hook Form** - Gerenciamento de formulários
- **Recharts** - Gráficos

## 📁 Estrutura do projeto

```
test-avantsoft/
├── server/
│   └── api.js          # API Express.js
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── types/         # Definições TypeScript
│   └── utils/         # Utilitários
├── db.json            # Banco de dados JSON
└── package.json       # Dependências
```

### Portas padrão

- **Frontend**: `http://localhost:5173`
- **API Express**: `http://localhost:3001`
- **JSON Server**: `http://localhost:3001`
