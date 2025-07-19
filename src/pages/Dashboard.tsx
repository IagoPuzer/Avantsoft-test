import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clientesService } from "../services/clientesService";
import {
  normalizarCliente,
  agruparVendasPorDia,
  encontrarClienteMaiorVolume,
  encontrarClienteMaiorMedia,
  encontrarClienteMaiorFrequencia,
} from "../utils/dataUtils";
import type { Cliente } from "../types";
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiAward,
} from "react-icons/fi";

const Dashboard: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendasPorDia, setVendasPorDia] = useState<
    { data: string; total: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError("");

      // Buscar clientes da API
      const response = await clientesService.listar();
      const clientesNormalizados =
        response.data.clientes.map(normalizarCliente);
      setClientes(clientesNormalizados);

      // Calcular vendas por dia
      const vendas = agruparVendasPorDia(clientesNormalizados);
      setVendasPorDia(vendas);
    } catch (err) {
      setError("Erro ao carregar dados do dashboard");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const clienteMaiorVolume = encontrarClienteMaiorVolume(clientes);
  const clienteMaiorMedia = encontrarClienteMaiorMedia(clientes);
  const clienteMaiorFrequencia = encontrarClienteMaiorFrequencia(clientes);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando dashboard...</div>
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
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das vendas e clientes</p>
      </div>

      {/* Cards de destaque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Maior Volume de Vendas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {clienteMaiorVolume
                      ? clienteMaiorVolume.nomeCompleto
                      : "N/A"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Maior Média por Venda
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {clienteMaiorMedia ? clienteMaiorMedia.nomeCompleto : "N/A"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Maior Frequência
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {clienteMaiorFrequencia
                      ? clienteMaiorFrequencia.nomeCompleto
                      : "N/A"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de vendas por dia */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Total de Vendas por Dia
          </h3>
          {vendasPorDia.length > 0 ? (
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vendasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="data"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("pt-BR")
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("pt-BR")
                    }
                    formatter={(value: number) => [
                      `R$ ${value.toFixed(2)}`,
                      "Total",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma venda registrada
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas detalhadas dos clientes em destaque */}
      {(clienteMaiorVolume || clienteMaiorMedia || clienteMaiorFrequencia) && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Detalhes dos Clientes em Destaque
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {clienteMaiorVolume && (
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center mb-2">
                    <FiAward className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-green-900">Maior Volume</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    {clienteMaiorVolume.nomeCompleto}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Total: R${" "}
                    {clienteMaiorVolume.vendas
                      .reduce((sum, v) => sum + v.valor, 0)
                      .toFixed(2)}
                  </p>
                </div>
              )}

              {clienteMaiorMedia && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-2">
                    <FiAward className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-900">Maior Média</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    {clienteMaiorMedia.nomeCompleto}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Média: R${" "}
                    {(
                      clienteMaiorMedia.vendas.reduce(
                        (sum, v) => sum + v.valor,
                        0
                      ) / clienteMaiorMedia.vendas.length
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              {clienteMaiorFrequencia && (
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center mb-2">
                    <FiAward className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-purple-900">
                      Maior Frequência
                    </h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    {clienteMaiorFrequencia.nomeCompleto}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Compras: {clienteMaiorFrequencia.vendas.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
