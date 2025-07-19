import type { ClientesAPIResponse } from "../types";

// Dados mock exatamente como fornecidos pelo usuário
export const mockClientesResponse: ClientesAPIResponse = {
  data: {
    clientes: [
      {
        info: {
          nomeCompleto: "Ana Beatriz",
          detalhes: {
            email: "ana.b@example.com",
            nascimento: "1992-05-01",
          },
        },
        estatisticas: {
          vendas: [
            { data: "2024-01-01", valor: 150 },
            { data: "2024-01-02", valor: 50 },
          ],
        },
      },
      {
        info: {
          nomeCompleto: "Carlos Eduardo",
          detalhes: {
            email: "cadu@example.com",
            nascimento: "1987-08-15",
          },
        },
        duplicado: {
          nomeCompleto: "Carlos Eduardo",
        },
        estatisticas: {
          vendas: [],
        },
      },
    ],
  },
  meta: {
    registroTotal: 2,
    pagina: 1,
  },
  redundante: {
    status: "ok",
  },
};

// Função para simular delay da API
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
