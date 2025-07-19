import React, { useState, useEffect } from "react";
import { clientesService } from "../../services/clientesService";
import {
  normalizarCliente,
  calcularEstatisticasCliente,
} from "../../utils/dataUtils";
import type { Cliente } from "../../types";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
} from "react-icons/fi";

interface ClientListProps {
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ onEdit, onDelete, onAdd }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await clientesService.listar();
      const clientesNormalizados =
        response.data.clientes.map(normalizarCliente);
      setClientes(clientesNormalizados);
    } catch (err) {
      setError("Erro ao carregar clientes");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
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
          onClick={onAdd}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </button>
      </div>

      {/* Lista de clientes */}
      {clientes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg">Nenhum cliente encontrado</p>
            <p className="text-sm mt-2">
              Clique em "Adicionar Cliente" para começar
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {clientes.map((cliente) => {
              const estatisticas = calcularEstatisticasCliente(cliente);
              return (
                <li key={cliente.id} className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600">
                                {cliente.nomeCompleto.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {cliente.nomeCompleto}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 space-y-1 sm:space-y-0">
                              <div className="flex items-center">
                                <FiMail className="mr-1 h-4 w-4" />
                                <span className="truncate">
                                  {cliente.email}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FiCalendar className="mr-1 h-4 w-4" />
                                {formatarData(cliente.dataNascimento)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Campo de letra faltante */}
                        <div className="flex items-center justify-center sm:justify-end">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">
                              Letra Faltante
                            </div>
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                              {estatisticas.letraFaltante}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Estatísticas do cliente */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiDollarSign className="mr-2 h-4 w-4 text-green-500" />
                          <span className="truncate">
                            Total: {formatarValor(estatisticas.totalVendas)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiDollarSign className="mr-2 h-4 w-4 text-blue-500" />
                          <span className="truncate">
                            Média: {formatarValor(estatisticas.mediaValor)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiShoppingCart className="mr-2 h-4 w-4 text-purple-500" />
                          <span>Compras: {estatisticas.frequenciaCompras}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4 lg:flex-shrink-0">
                      <button
                        onClick={() => onEdit(cliente)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiEdit className="mr-1 h-3 w-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(cliente.id!)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiTrash2 className="mr-1 h-3 w-3" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientList;
