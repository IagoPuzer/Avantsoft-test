import React, { useState } from "react";
import ClientList from "../components/Clients/ClientList";
import ClientForm from "../components/Clients/ClientForm";
import { clientesService } from "../services/clientesService";
import type { Cliente, ClienteFormData } from "../types";

const ClientsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização da lista

  const handleAdd = () => {
    setEditingCliente(undefined);
    setShowForm(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        setLoading(true);
        await clientesService.excluir(id);
        // Forçar atualização da lista
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      setLoading(true);

      if (editingCliente) {
        await clientesService.atualizar(editingCliente.id!, data);
      } else {
        await clientesService.adicionar(data);
      }

      setShowForm(false);
      setEditingCliente(undefined);
      // Forçar atualização da lista
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCliente(undefined);
  };

  return (
    <div>
      <ClientList
        key={refreshKey} // Força re-render quando refreshKey muda
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <ClientForm
          cliente={editingCliente}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ClientsPage;
