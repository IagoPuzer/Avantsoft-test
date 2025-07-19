import React, { useState } from "react";
import ClientList from "../components/Clients/ClientList";
import ClientForm from "../components/Clients/ClientForm";
import AddSaleForm from "../components/Clients/AddSaleForm";
import ConfirmDeleteModal from "../components/Clients/ConfirmDeleteModal";
import {
  useClientes,
  useAdicionarCliente,
  useAtualizarCliente,
  useExcluirCliente,
  useAdicionarVenda,
} from "../hooks/useClientes";
import type { Cliente, ClienteFormData } from "../types";
import { FiPlus } from "react-icons/fi";

type ModalContext =
  | { tipo: "editar"; cliente: Cliente }
  | { tipo: "adicionar" }
  | { tipo: "venda"; cliente: Cliente }
  | { tipo: "excluir"; cliente: Cliente }
  | null;

const ClientsPage: React.FC = () => {
  const [modal, setModal] = useState<ModalContext>(null);

  const { data, isLoading: isLoadingClientes, error, refetch } = useClientes();

  const adicionarClienteMutation = useAdicionarCliente();
  const atualizarClienteMutation = useAtualizarCliente();
  const excluirClienteMutation = useExcluirCliente();
  const adicionarVendaMutation = useAdicionarVenda();

  const clientes = data?.data.clientes || [];

  const handleAdd = () => {
    setModal({ tipo: "adicionar" });
  };

  const handleEdit = (cliente: Cliente) => {
    setModal({ tipo: "editar", cliente });
  };

  const handleAddVenda = (cliente: Cliente) => {
    setModal({ tipo: "venda", cliente });
  };

  const handleRequestDelete = (cliente: Cliente) => {
    setModal({ tipo: "excluir", cliente });
  };

  const handleCancel = () => {
    setModal(null);
  };

  const handleCancelDelete = () => {
    setModal(null);
  };

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      if (modal?.tipo === "editar") {
        await atualizarClienteMutation.mutateAsync({
          id: modal.cliente.id!,
          cliente: data,
        });
      } else {
        await adicionarClienteMutation.mutateAsync(data);
      }
      setModal(null);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const handleSubmitVenda = async (data: { data: string; valor: number }) => {
    try {
      if (modal?.tipo === "venda") {
        await adicionarVendaMutation.mutateAsync({
          clienteId: modal.cliente.id!,
          venda: data,
        });
      }
      setModal(null);
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
    }
  };

  const handleDelete = async () => {
    if (modal?.tipo === "excluir") {
      await excluirClienteMutation.mutateAsync(modal.cliente.id!);
      setModal(null);
    }
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
        onRequestDelete={handleRequestDelete}
        onAddVenda={handleAddVenda}
        isDeleting={excluirClienteMutation.isPending}
      />

      {modal?.tipo === "editar" && (
        <ClientForm
          cliente={modal.cliente}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isLoadingMutations}
        />
      )}

      {modal?.tipo === "adicionar" && (
        <ClientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isLoadingMutations}
        />
      )}

      {modal?.tipo === "venda" && (
        <AddSaleForm
          clienteNome={modal.cliente.nomeCompleto}
          onSubmit={handleSubmitVenda}
          onCancel={handleCancel}
          loading={adicionarVendaMutation.isPending}
        />
      )}

      {modal?.tipo === "excluir" && (
        <ConfirmDeleteModal
          open={true}
          cliente={modal.cliente}
          onCancel={handleCancelDelete}
          onConfirm={handleDelete}
          loading={excluirClienteMutation.isPending}
        />
      )}
    </div>
  );
};

export default ClientsPage;
