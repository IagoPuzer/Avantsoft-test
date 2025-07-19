import type { Cliente, ClienteAPI, ClienteEstatisticas } from "../types";

// Normaliza dados da API para o formato interno
export const normalizarCliente = (clienteAPI: ClienteAPI): Cliente => {
  return {
    id: clienteAPI.id || Math.random().toString(36).substr(2, 9), // Usar ID existente ou gerar novo
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
  const frequenciaCompras = cliente.vendas.length;

  return {
    totalVendas,
    mediaValor,
    frequenciaCompras,
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

  return "-"; // Todas as letras estão presentes
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

// Encontra cliente com maior volume de vendas
export const encontrarClienteMaiorVolume = (
  clientes: Cliente[]
): Cliente | null => {
  if (clientes.length === 0) return null;

  return clientes.reduce((maior, atual) => {
    const estatisticasAtual = calcularEstatisticasCliente(atual);
    const estatisticasMaior = calcularEstatisticasCliente(maior);

    return estatisticasAtual.totalVendas > estatisticasMaior.totalVendas
      ? atual
      : maior;
  });
};

// Encontra cliente com maior média de valor por venda
export const encontrarClienteMaiorMedia = (
  clientes: Cliente[]
): Cliente | null => {
  if (clientes.length === 0) return null;

  return clientes.reduce((maior, atual) => {
    const estatisticasAtual = calcularEstatisticasCliente(atual);
    const estatisticasMaior = calcularEstatisticasCliente(maior);

    return estatisticasAtual.mediaValor > estatisticasMaior.mediaValor
      ? atual
      : maior;
  });
};

// Encontra cliente com maior frequência de compras
export const encontrarClienteMaiorFrequencia = (
  clientes: Cliente[]
): Cliente | null => {
  if (clientes.length === 0) return null;

  return clientes.reduce((maior, atual) => {
    const estatisticasAtual = calcularEstatisticasCliente(atual);
    const estatisticasMaior = calcularEstatisticasCliente(maior);

    return estatisticasAtual.frequenciaCompras >
      estatisticasMaior.frequenciaCompras
      ? atual
      : maior;
  });
};
