import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "../services/clientesService";
import { normalizarCliente } from "../utils/dataUtils";
import type { ClienteFormData } from "../types";
import { toast } from "sonner";

// Chaves para o cache do React Query
export const clienteKeys = {
  all: ["clientes"] as const,
  lists: () => [...clienteKeys.all, "list"] as const,
  list: (filters: { pagina?: number; limite?: number }) =>
    [...clienteKeys.lists(), filters] as const,
  details: () => [...clienteKeys.all, "detail"] as const,
  detail: (id: string) => [...clienteKeys.details(), id] as const,
};

// Hook para listar clientes
export const useClientes = (pagina: number = 1, limite: number = 10) => {
  return useQuery({
    queryKey: clienteKeys.list({ pagina, limite }),
    queryFn: async () => {
      const response = await clientesService.listClient(pagina, limite);
      return {
        ...response,
        data: {
          ...response.data,
          clientes: response.data.clientes.map(normalizarCliente),
        },
      };
    },
    staleTime: Infinity,
  });
};

// Hook para adicionar cliente
export const useAdicionarCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cliente: ClienteFormData) =>
      clientesService.addClient(cliente),
    onSuccess: () => {
      toast.success("Cliente criado com sucesso");
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao adicionar cliente:", error);
    },
  });
};

// Hook para atualizar cliente
export const useAtualizarCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cliente }: { id: string; cliente: ClienteFormData }) =>
      clientesService.updateClient(id, cliente),
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao atualizar cliente:", error);
    },
  });
};

// Hook para excluir cliente
export const useExcluirCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientesService.deleteClient(id),
    onSuccess: () => {
      toast.success("Cliente excluido com sucesso");
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao excluir cliente:", error);
    },
  });
};

// Hook para adicionar venda
export const useAdicionarVenda = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clienteId,
      venda,
    }: {
      clienteId: string;
      venda: { data: string; valor: number };
    }) => clientesService.addSale(clienteId, venda),
    onSuccess: () => {
      toast.success("Venda adicionada com sucesso");
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao adicionar venda:", error);
    },
  });
};

// Hook para verificar status da API
export const useApiStatus = () => {
  return useQuery({
    queryKey: ["api-status"],
    queryFn: () => clientesService.verificarStatus(),
    refetchInterval: 30 * 1000,
    staleTime: 10 * 1000,
  });
};
