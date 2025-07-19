import React, { useState } from "react";
import ClientList from "../components/Clients/ClientList";
import AddClientForm from "../components/Clients/AddClientForm";
import AddSaleForm from "../components/Clients/AddSaleForm";
import {
  useClientes,
  useAdicionarCliente,
  useAtualizarCliente,
  useExcluirCliente,
  useAdicionarVenda,
} from "../hooks/useClientes";
import type { Cliente, ClienteFormData } from "../types";
import { FiPlus } from "react-icons/fi";

type ModalType = "cliente" | "venda" | null;

const ClientsPage: React.FC = () => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();

  const { data, isLoading: isLoadingClientes, error, refetch } = useClientes();

  const adicionarClienteMutation = useAdicionarCliente();
  const atualizarClienteMutation = useAtualizarCliente();
  const excluirClienteMutation = useExcluirCliente();
  const adicionarVendaMutation = useAdicionarVenda();

  const clientes = data?.data.clientes || [];

  const handleAdd = () => {
    setSelectedCliente(undefined);
    setModalType("cliente");
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalType("cliente");
  };

  const handleDelete = async (id: string) => {
    await excluirClienteMutation.mutateAsync(id);
  };

  const handleAddVenda = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalType("venda");
  };

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      if (selectedCliente) {
        await atualizarClienteMutation.mutateAsync({
          id: selectedCliente.id!,
          cliente: data,
        });
      } else {
        await adicionarClienteMutation.mutateAsync(data);
      }

      setModalType(null);
      setSelectedCliente(undefined);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const handleSubmitVenda = async (data: { data: string; valor: number }) => {
    try {
      if (selectedCliente) {
        await adicionarVendaMutation.mutateAsync({
          clienteId: selectedCliente.id!,
          venda: data,
        });
      }

      setModalType(null);
      setSelectedCliente(undefined);
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
    }
  };

  const handleCancel = () => {
    setModalType(null);
    setSelectedCliente(undefined);
  };

  const handleRefetch = () => {
    refetch();
  };

  const isLoadingMutations =
    adicionarClienteMutation.isPending || atualizarClienteMutation.isPending;

  if (isLoadingClientes) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Erro ao carregar clientes</p>
        <button
          onClick={handleRefetch}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Clientes
          </h1>
          <p className="text-gray-600">Gerencie seus clientes</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </button>
      </div>

      <ClientList
        clientes={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddVenda={handleAddVenda}
        isDeleting={excluirClienteMutation.isPending}
      />

      {modalType === "cliente" && (
        <AddClientForm
          cliente={selectedCliente}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isLoadingMutations}
        />
      )}

      {modalType === "venda" && selectedCliente && (
        <AddSaleForm
          clienteNome={selectedCliente.nomeCompleto}
          onSubmit={handleSubmitVenda}
          onCancel={handleCancel}
          loading={adicionarVendaMutation.isPending}
        />
      )}
    </div>
  );
};

export default ClientsPage;
