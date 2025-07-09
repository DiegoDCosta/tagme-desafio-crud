/**
 * @fileoverview Modelo de dados para Item
 * @author AI Assistant
 */

/**
 * Interface que define a estrutura de um item
 * @interface Item
 * @description Representa um item com suas propriedades básicas
 */
export interface Item {
  /** Identificador único do item */
  id: number;
  /** Título do item */
  title: string;
  /** Descrição detalhada do item */
  description: string;
  /** URL da imagem do item */
  imageUrl: string;
  /** Data de criação do item (opcional) */
  createdAt?: Date;
  /** Data de última atualização do item (opcional) */
  updatedAt?: Date;
}

/**
 * Interface para criação de novos itens (sem ID)
 * @interface CreateItemDto
 * @description Dados necessários para criar um novo item
 */
export interface CreateItemDto {
  /** Título do item */
  title: string;
  /** Descrição detalhada do item */
  description: string;
  /** URL da imagem do item */
  imageUrl: string;
}

/**
 * Interface para atualização de itens existentes
 * @interface UpdateItemDto
 * @description Dados que podem ser atualizados em um item existente
 */
export interface UpdateItemDto {
  /** Título do item (opcional) */
  title?: string;
  /** Descrição detalhada do item (opcional) */
  description?: string;
  /** URL da imagem do item (opcional) */
  imageUrl?: string;
}

/**
 * Interface para filtros de busca
 * @interface ItemFilter
 * @description Critérios de filtragem para busca de itens
 */
export interface ItemFilter {
  /** Texto para busca no título ou descrição */
  search?: string;
  /** Data de início para filtro por data de criação */
  startDate?: Date;
  /** Data de fim para filtro por data de criação */
  endDate?: Date;
  /** Campo para ordenação */
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  /** Direção da ordenação */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Interface para paginação
 * @interface PaginationOptions
 * @description Opções de paginação para listagem de itens
 */
export interface PaginationOptions {
  /** Página atual (base 0) */
  page: number;
  /** Número de itens por página */
  pageSize: number;
  /** Total de itens disponíveis */
  totalItems?: number;
  /** Total de páginas */
  totalPages?: number;
}

/**
 * Interface para resposta paginada
 * @interface PaginatedResponse
 * @template T
 * @description Estrutura de resposta para dados paginados
 */
export interface PaginatedResponse<T> {
  /** Dados da página atual */
  data: T[];
  /** Informações de paginação */
  pagination: PaginationOptions;
  /** Total de itens */
  total: number;
}

/**
 * Enum para estados de carregamento
 * @enum {string}
 * @description Estados possíveis durante operações assíncronas
 */
export enum LoadingState {
  /** Estado inicial */
  IDLE = 'idle',
  /** Carregando dados */
  LOADING = 'loading',
  /** Operação concluída com sucesso */
  SUCCESS = 'success',
  /** Erro na operação */
  ERROR = 'error'
}

/**
 * Interface para resposta da API
 * @interface ApiResponse
 * @template T
 * @description Estrutura padrão de resposta da API
 */
export interface ApiResponse<T> {
  /** Dados da resposta */
  data: T;
  /** Mensagem de sucesso ou erro */
  message: string;
  /** Código de status HTTP */
  statusCode: number;
  /** Timestamp da resposta */
  timestamp: Date;
}
