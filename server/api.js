import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(express.json());

// Função para ler o banco de dados
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler banco de dados:", error);
    return { clientes: [] };
  }
}

// Função para escrever no banco de dados
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao escrever no banco de dados:", error);
    throw error;
  }
}

// Gerar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Rotas da API

// GET /api/clientes - Listar todos os clientes
app.get("/api/clientes", async (req, res) => {
  try {
    const db = await readDB();
    const { page = 1, limit = 10 } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const clientes = db.clientes.slice(startIndex, endIndex);

    res.json({
      data: {
        clientes: clientes,
      },
      meta: {
        registroTotal: db.clientes.length,
        pagina: parseInt(page),
      },
      redundante: {
        status: "ok",
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/clientes/:id - Buscar cliente por ID
app.get("/api/clientes/:id", async (req, res) => {
  try {
    const db = await readDB();
    const cliente = db.clientes.find((c) => c.id === req.params.id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json({ data: cliente });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/clientes - Criar novo cliente
app.post("/api/clientes", async (req, res) => {
  try {
    const { nomeCompleto, email, dataNascimento } = req.body;

    if (!nomeCompleto || !email || !dataNascimento) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const db = await readDB();

    const novoCliente = {
      id: generateId(),
      info: {
        nomeCompleto,
        detalhes: {
          email,
          nascimento: dataNascimento,
        },
      },
      estatisticas: {
        vendas: [],
      },
    };

    db.clientes.push(novoCliente);
    await writeDB(db);

    res.status(201).json({
      success: true,
      data: novoCliente,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /api/clientes/:id - Atualizar cliente
app.put("/api/clientes/:id", async (req, res) => {
  try {
    const { nomeCompleto, email, dataNascimento } = req.body;

    if (!nomeCompleto || !email || !dataNascimento) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const db = await readDB();
    const index = db.clientes.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    db.clientes[index] = {
      ...db.clientes[index],
      info: {
        nomeCompleto,
        detalhes: {
          email,
          nascimento: dataNascimento,
        },
      },
    };

    await writeDB(db);

    res.json({
      success: true,
      data: db.clientes[index],
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE /api/clientes/:id - Excluir cliente
app.delete("/api/clientes/:id", async (req, res) => {
  try {
    const db = await readDB();
    const index = db.clientes.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const clienteRemovido = db.clientes.splice(index, 1)[0];
    await writeDB(db);

    res.json({
      success: true,
      message: "Cliente removido com sucesso",
      data: clienteRemovido,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/clientes/:id/vendas - Adicionar venda ao cliente
app.post("/api/clientes/:id/vendas", async (req, res) => {
  try {
    const { data, valor } = req.body;

    if (!data || !valor) {
      return res.status(400).json({ error: "Data e valor são obrigatórios" });
    }

    const db = await readDB();
    const index = db.clientes.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const novaVenda = { data, valor: parseFloat(valor) };
    db.clientes[index].estatisticas.vendas.push(novaVenda);

    await writeDB(db);

    res.json({
      success: true,
      data: db.clientes[index], // retorna o cliente inteiro atualizado
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   GET    /api/clientes - Listar clientes`);
  console.log(`   GET    /api/clientes/:id - Buscar cliente`);
  console.log(`   POST   /api/clientes - Criar cliente`);
  console.log(`   PUT    /api/clientes/:id - Atualizar cliente`);
  console.log(`   DELETE /api/clientes/:id - Excluir cliente`);
  console.log(`   POST   /api/clientes/:id/vendas - Adicionar venda`);
  console.log(`   DELETE /api/clientes/:id/vendas/:index - Remover venda`);
  console.log(`   GET    /api/health - Status da API`);
});
