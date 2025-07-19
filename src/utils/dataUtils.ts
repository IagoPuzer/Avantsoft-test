import type { Cliente, ClienteAPI, ClienteEstatisticas } from "../types";

// Função para formatar data corretamente, evitando problemas de fuso horário
export const formatarData = (data: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia);
    return dataLocal.toLocaleDateString("pt-BR");
  }

  return new Date(data).toLocaleDateString("pt-BR");
};

// Normaliza dados da API para o formato interno
export const normalizarCliente = (clienteAPI: ClienteAPI): Cliente => {
  return {
    id: clienteAPI.id || Math.random().toString(36).substr(2, 9),
    nomeCompleto: clienteAPI.info.nomeCompleto,
    email: clienteAPI.info.detalhes.email,
    dataNascimento: clienteAPI.info.detalhes.nascimento,
    vendas: clienteAPI.estatisticas.vendas || [],
  };
};

// Calcula estatísticas de um cliente
export const calcularEstatisticasCliente = (
  cliente: Cliente
): ClienteEstatisticas => {
  const totalVendas = cliente.vendas.reduce(
    (sum, venda) => sum + venda.valor,
    0
  );
  const mediaValor =
    cliente.vendas.length > 0 ? totalVendas / cliente.vendas.length : 0;
  const frequenciaVendas = cliente.vendas.length;

  return {
    totalVendas,
    mediaValor,
    frequenciaVendas,
    letraFaltante: encontrarLetraFaltante(cliente.nomeCompleto),
  };
};

// Encontra a primeira letra do alfabeto que não aparece no nome
export const encontrarLetraFaltante = (nome: string): string => {
  const alfabeto = "abcdefghijklmnopqrstuvwxyz";
  const nomeLower = nome.toLowerCase().replace(/\s/g, "");

  for (const letra of alfabeto) {
    if (!nomeLower.includes(letra)) {
      return letra.toUpperCase();
    }
  }

  return "-";
};

// Agrupa vendas por dia
export const agruparVendasPorDia = (clientes: Cliente[]) => {
  const vendasPorDia: { [data: string]: number } = {};

  clientes.forEach((cliente) => {
    cliente.vendas.forEach((venda) => {
      if (vendasPorDia[venda.data]) {
        vendasPorDia[venda.data] += venda.valor;
      } else {
        vendasPorDia[venda.data] = venda.valor;
      }
    });
  });

  return Object.entries(vendasPorDia)
    .map(([data, total]) => ({
      data,
      total,
    }))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
};

// Função genérica para encontrar cliente com maior valor de um critério
function encontrarClienteComMaiorValor(
  clientes: Cliente[],
  criterio: (estat: ClienteEstatisticas) => number
): { cliente: Cliente; estatisticas: ClienteEstatisticas } | null {
  if (clientes.length === 0) return null;
  return clientes.reduce(
    (maior, atual) => {
      const estatAtual = calcularEstatisticasCliente(atual);
      const estatMaior = calcularEstatisticasCliente(maior.cliente);
      return criterio(estatAtual) > criterio(estatMaior)
        ? { cliente: atual, estatisticas: estatAtual }
        : maior;
    },
    {
      cliente: clientes[0],
      estatisticas: calcularEstatisticasCliente(clientes[0]),
    }
  );
}

// Encontra cliente com maior volume de vendas
export const encontrarClienteMaiorVolume = (
  clientes: Cliente[]
): { cliente: Cliente; estatisticas: ClienteEstatisticas } | null =>
  encontrarClienteComMaiorValor(clientes, (estat) => estat.totalVendas);

// Encontra cliente com maior média de valor por venda
export const encontrarClienteMaiorMedia = (
  clientes: Cliente[]
): { cliente: Cliente; estatisticas: ClienteEstatisticas } | null =>
  encontrarClienteComMaiorValor(clientes, (estat) => estat.mediaValor);

// Encontra cliente com maior frequência de compras
export const encontrarClienteMaiorFrequencia = (
  clientes: Cliente[]
): { cliente: Cliente; estatisticas: ClienteEstatisticas } | null =>
  encontrarClienteComMaiorValor(clientes, (estat) => estat.frequenciaVendas);
