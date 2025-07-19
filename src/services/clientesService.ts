import type {
  ClientesAPIResponse,
  ClienteFormData,
  ClienteAPI,
} from "../types";
import axios from "axios";

// Configuração da API
const API_BASE_URL = "http://localhost:3001/api";

// Instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Serviços de Clientes
export const clientesService = {
  // Listar clientes
  listar: async (
    pagina: number = 1,
    limite: number = 10
  ): Promise<ClientesAPIResponse> => {
    try {
      const response = await api.get("/clientes", {
        params: { page: pagina, limit: limite },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      throw new Error("Falha ao carregar clientes");
    }
  },

  // Buscar cliente por ID
  buscarPorId: async (id: string): Promise<ClienteAPI> => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw new Error("Falha ao buscar cliente");
    }
  },

  // Adicionar cliente
  adicionar: async (
    cliente: ClienteFormData
  ): Promise<{ success: boolean; data: ClienteAPI }> => {
    try {
      const response = await api.post("/clientes", cliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      throw new Error("Falha ao adicionar cliente");
    }
  },

  // Atualizar cliente
  atualizar: async (
    id: string,
    cliente: ClienteFormData
  ): Promise<{ success: boolean; data: ClienteAPI }> => {
    try {
      const response = await api.put(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw new Error("Falha ao atualizar cliente");
    }
  },

  // Excluir cliente
  excluir: async (
    id: string
  ): Promise<{ success: boolean; message: string; data: ClienteAPI }> => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      throw new Error("Falha ao excluir cliente");
    }
  },

  // Adicionar venda ao cliente
  adicionarVenda: async (
    clienteId: string,
    venda: { data: string; valor: number }
  ): Promise<{ success: boolean; data: { data: string; valor: number } }> => {
    try {
      const response = await api.post(`/clientes/${clienteId}/vendas`, venda);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
      throw new Error("Falha ao adicionar venda");
    }
  },

  // Verificar status da API
  verificarStatus: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Erro ao verificar status da API:", error);
      throw new Error("API não está disponível");
    }
  },
};
