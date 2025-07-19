// Tipos para Cliente
export interface Cliente {
  id?: string;
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  vendas: Venda[];
}

// Tipo para Venda
export interface Venda {
  data: string;
  valor: number;
}

// Tipo para dados brutos da API
export interface ClienteAPI {
  id?: string; // ID opcional para novos clientes
  info: {
    nomeCompleto: string;
    detalhes: {
      email: string;
      nascimento: string;
    };
  };
  estatisticas: {
    vendas: Venda[];
  };
  duplicado?: {
    nomeCompleto: string;
  };
}

// Tipo para resposta da API de clientes
export interface ClientesAPIResponse {
  data: {
    clientes: ClienteAPI[];
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
}

// Tipo para resposta da API de estatísticas
export interface EstatisticasAPIResponse {
  vendasPorDia: {
    data: string;
    total: number;
  }[];
  clientesDestaque: {
    maiorVolume: Cliente;
    maiorMedia: Cliente;
    maiorFrequencia: Cliente;
  };
}

// Tipo para autenticação
export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

// Tipo para formulário de cliente
export interface ClienteFormData {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
}

// Tipo para estatísticas de cliente
export interface ClienteEstatisticas {
  totalVendas: number;
  mediaValor: number;
  frequenciaCompras: number;
  letraFaltante: string;
}
