// Script para testar a API de clientes
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

async function testAPI() {
  console.log("🧪 Testando API de Clientes...\n");

  try {
    // Teste 1: Verificar status da API
    console.log("1. Verificando status da API...");
    const healthResponse = await api.get("/health");
    console.log("✅ API está funcionando:", healthResponse.data);
    console.log("");

    // Teste 2: Listar clientes
    console.log("2. Listando clientes...");
    const listResponse = await api.get("/clientes");
    console.log(
      "✅ Clientes encontrados:",
      listResponse.data.meta.registroTotal
    );
    console.log("");

    // Teste 3: Criar novo cliente
    console.log("3. Criando novo cliente...");
    const novoCliente = {
      nomeCompleto: "João Silva",
      email: "joao.silva@example.com",
      dataNascimento: "1990-05-15",
    };

    const createResponse = await api.post("/clientes", novoCliente);
    console.log(
      "✅ Cliente criado:",
      createResponse.data.data.info.nomeCompleto
    );
    const clienteId = createResponse.data.data.id;
    console.log("");

    // Teste 4: Buscar cliente por ID
    console.log("4. Buscando cliente por ID...");
    const getResponse = await api.get(`/clientes/${clienteId}`);
    console.log(
      "✅ Cliente encontrado:",
      getResponse.data.data.info.nomeCompleto
    );
    console.log("");

    // Teste 5: Adicionar venda ao cliente
    console.log("5. Adicionando venda ao cliente...");
    const novaVenda = {
      data: "2024-01-15",
      valor: 250.5,
    };

    const vendaResponse = await api.post(
      `/clientes/${clienteId}/vendas`,
      novaVenda
    );
    console.log("✅ Venda adicionada:", vendaResponse.data.data);
    console.log("");

    // Teste 6: Atualizar cliente
    console.log("6. Atualizando cliente...");
    const clienteAtualizado = {
      nomeCompleto: "João Silva Atualizado",
      email: "joao.silva@example.com",
      dataNascimento: "1990-05-15",
    };

    const updateResponse = await api.put(
      `/clientes/${clienteId}`,
      clienteAtualizado
    );
    console.log(
      "✅ Cliente atualizado:",
      updateResponse.data.data.info.nomeCompleto
    );
    console.log("");

    // Teste 7: Listar clientes novamente
    console.log("7. Listando clientes após operações...");
    const listFinalResponse = await api.get("/clientes");
    console.log(
      "✅ Total de clientes:",
      listFinalResponse.data.meta.registroTotal
    );
    console.log("");

    // Teste 8: Excluir cliente
    console.log("8. Excluindo cliente...");
    const deleteResponse = await api.delete(`/clientes/${clienteId}`);
    console.log("✅ Cliente excluído:", deleteResponse.data.message);
    console.log("");

    console.log("🎉 Todos os testes passaram com sucesso!");
    console.log("📊 API está funcionando corretamente.");
  } catch (error) {
    console.error(
      "❌ Erro durante os testes:",
      error.response?.data || error.message
    );
    console.log("");
    console.log("🔧 Verifique se:");
    console.log("   1. A API está rodando (npm run api)");
    console.log("   2. A porta 3001 está disponível");
    console.log("   3. O arquivo db.json existe");
  }
}

// Executar testes
testAPI();
