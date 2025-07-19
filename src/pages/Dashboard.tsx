import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  agruparVendasPorDia,
  encontrarClienteMaiorVolume,
  encontrarClienteMaiorMedia,
  encontrarClienteMaiorFrequencia,
  formatarData,
} from "../utils/dataUtils";
import { FiTrendingUp, FiDollarSign, FiShoppingCart } from "react-icons/fi";
import StatCard from "../components/StatCard";
import { useClientes } from "../hooks/useClientes";

const Dashboard: React.FC = () => {
  const { data: clientesData, isLoading, error } = useClientes(1, 1000);

  const clientes = useMemo(
    () => clientesData?.data?.clientes || [],
    [clientesData?.data?.clientes]
  );

  // Calcular vendas por dia usando useMemo
  const vendasPorDia = useMemo(() => {
    if (clientes.length > 0) {
      return agruparVendasPorDia(clientes);
    }
    return [];
  }, [clientes]);

  const clienteMaiorVolume = encontrarClienteMaiorVolume(clientes);
  const clienteMaiorMedia = encontrarClienteMaiorMedia(clientes);
  const clienteMaiorFrequencia = encontrarClienteMaiorFrequencia(clientes);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Erro ao carregar dados do dashboard
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
        <StatCard
          title="Maior Volume de Vendas"
          value={
            clienteMaiorVolume ? clienteMaiorVolume.cliente.nomeCompleto : "N/A"
          }
          subtitle={
            clienteMaiorVolume && (
              <span>
                Total: R${" "}
                {clienteMaiorVolume.estatisticas.totalVendas.toFixed(2)}
              </span>
            )
          }
          icon={FiTrendingUp}
          iconColor="text-green-600"
        />

        <StatCard
          title="Maior Média por Venda"
          value={
            clienteMaiorMedia ? clienteMaiorMedia.cliente.nomeCompleto : "N/A"
          }
          subtitle={
            clienteMaiorMedia && (
              <span>
                Média: R$ {clienteMaiorMedia.estatisticas.mediaValor.toFixed(2)}
              </span>
            )
          }
          icon={FiDollarSign}
          iconColor="text-blue-600"
        />

        <StatCard
          title="Maior Frequência"
          value={
            clienteMaiorFrequencia
              ? clienteMaiorFrequencia.cliente.nomeCompleto
              : "N/A"
          }
          subtitle={
            clienteMaiorFrequencia && (
              <span>
                Compras: {clienteMaiorFrequencia.estatisticas.frequenciaCompras}
              </span>
            )
          }
          icon={FiShoppingCart}
          iconColor="text-purple-600"
        />
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
                    tickFormatter={(value) => formatarData(value)}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => formatarData(value)}
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
    </div>
  );
};

export default Dashboard;
