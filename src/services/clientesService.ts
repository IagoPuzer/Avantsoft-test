import type {
  ClientesAPIResponse,
  ClienteFormData,
  ClienteAPI,
} from "../types";
import { mockClientesResponse, delay } from "./mockData";

// Funções auxiliares para localStorage
const getClientesFromStorage = (): ClienteAPI[] => {
  try {
    const clientes = localStorage.getItem("clientes");
    return clientes ? JSON.parse(clientes) : [];
  } catch (error) {
    console.error("Erro ao ler clientes do localStorage:", error);
    return [];
  }
};

const saveClientesToStorage = (clientes: ClienteAPI[]) => {
  try {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  } catch (error) {
    console.error("Erro ao salvar clientes no localStorage:", error);
  }
};

// Gerar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Converter ClienteFormData para ClienteAPI
const convertToClienteAPI = (cliente: ClienteFormData): ClienteAPI => {
  return {
    id: generateId(), // Adicionar ID único
    info: {
      nomeCompleto: cliente.nomeCompleto,
      detalhes: {
        email: cliente.email,
        nascimento: cliente.dataNascimento,
      },
    },
    estatisticas: {
      vendas: [], // Novos clientes começam sem vendas
    },
  };
};

// Serviços de Clientes
export const clientesService = {
  // Listar clientes
  listar: async (): Promise<ClientesAPIResponse> => {
    await delay(1000); // Simular delay da rede

    // Combinar dados mockados com dados do localStorage
    const clientesMockados = mockClientesResponse.data.clientes;
    const clientesStorage = getClientesFromStorage();
    const todosClientes = [...clientesStorage, ...clientesMockados];

    return {
      data: {
        clientes: todosClientes,
      },
      meta: {
        registroTotal: todosClientes.length,
        pagina: 1,
      },
      redundante: {
        status: "ok",
      },
    };
  },

  // Adicionar cliente
  adicionar: async (cliente: ClienteFormData) => {
    await delay(500);

    // Converter para formato ClienteAPI
    const novoCliente = convertToClienteAPI(cliente);

    // Adicionar ao localStorage
    const clientesExistentes = getClientesFromStorage();
    clientesExistentes.push(novoCliente);
    saveClientesToStorage(clientesExistentes);

    return { success: true };
  },

  // Atualizar cliente
  atualizar: async (id: string, cliente: ClienteFormData) => {
    await delay(500);

    // Atualizar no localStorage
    const clientesExistentes = getClientesFromStorage();
    const index = clientesExistentes.findIndex((c) => c.id === id);

    if (index !== -1) {
      clientesExistentes[index] = {
        ...clientesExistentes[index],
        info: {
          nomeCompleto: cliente.nomeCompleto,
          detalhes: {
            email: cliente.email,
            nascimento: cliente.dataNascimento,
          },
        },
      };
      saveClientesToStorage(clientesExistentes);
    }

    return { success: true };
  },

  // Excluir cliente
  excluir: async (id: string) => {
    await delay(500);

    // Remover do localStorage usando ID
    const clientesExistentes = getClientesFromStorage();
    const clientesFiltrados = clientesExistentes.filter(
      (cliente) => cliente.id !== id
    );
    saveClientesToStorage(clientesFiltrados);

    return { success: true };
  },
};
