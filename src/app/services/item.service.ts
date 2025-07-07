/**
 * @fileoverview Service para gerenciamento de itens
 * @author AI Assistant
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  Item, 
  CreateItemDto, 
  UpdateItemDto, 
  ItemFilter, 
  PaginationOptions, 
  PaginatedResponse,
  LoadingState 
} from '../models/item.model';

/**
 * Service responsável por gerenciar operações CRUD de itens
 * @class ItemService
 * @description Fornece métodos para criar, ler, atualizar e deletar itens
 * através de uma API REST simulada com json-server
 */
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  /**
   * URL base da API
   * @private
   * @readonly
   */
  private readonly API_URL = 'http://localhost:3000';

  /**
   * Endpoint para itens
   * @private
   * @readonly
   */
  private readonly ITEMS_ENDPOINT = `${this.API_URL}/items`;

  /**
   * Signal para controlar o estado de carregamento
   * @private
   */
  private readonly loadingState = signal<LoadingState>(LoadingState.IDLE);

  /**
   * BehaviorSubject para armazenar a lista de itens
   * @private
   */
  private readonly itemsSubject = new BehaviorSubject<Item[]>([]);

  /**
   * BehaviorSubject para armazenar o item selecionado
   * @private
   */
  private readonly selectedItemSubject = new BehaviorSubject<Item | null>(null);

  /**
   * Observable público para lista de itens
   * @readonly
   */
  public readonly items$ = this.itemsSubject.asObservable();

  /**
   * Observable público para item selecionado
   * @readonly
   */
  public readonly selectedItem$ = this.selectedItemSubject.asObservable();

  /**
   * Signal computado para estado de carregamento
   * @readonly
   */
  public readonly isLoading = computed(() => this.loadingState() === LoadingState.LOADING);

  /**
   * Signal computado para estado de erro
   * @readonly
   */
  public readonly hasError = computed(() => this.loadingState() === LoadingState.ERROR);

  /**
   * Construtor do service
   * @param {HttpClient} http - Cliente HTTP para requisições
   */
  constructor(private http: HttpClient) {}

  /**
   * Busca todos os itens da API
   * @returns {Observable<Item[]>} Observable com array de itens
   * @throws {Error} Quando há erro na requisição
   * @example
   * ```typescript
   * this.itemService.getAllItems().subscribe({
   *   next: items => console.log('Itens carregados:', items),
   *   error: error => console.error('Erro ao carregar itens:', error)
   * });
   * ```
   */
  getAllItems(): Observable<Item[]> {
    this.loadingState.set(LoadingState.LOADING);
    
    return this.http.get<Item[]>(this.ITEMS_ENDPOINT).pipe(
      tap(items => {
        this.itemsSubject.next(items);
        this.loadingState.set(LoadingState.SUCCESS);
      }),
      catchError(error => {
        this.loadingState.set(LoadingState.ERROR);
        console.error('Erro ao buscar itens:', error);
        return throwError(() => new Error('Falha ao carregar itens'));
      })
    );
  }

  /**
   * Busca itens com filtros e paginação
   * @param {ItemFilter} filters - Filtros de busca
   * @param {PaginationOptions} pagination - Opções de paginação
   * @returns {Observable<PaginatedResponse<Item>>} Observable com resposta paginada
   * @throws {Error} Quando há erro na requisição
   * @example
   * ```typescript
   * const filters = { search: 'termo', sortBy: 'title' };
   * const pagination = { page: 0, pageSize: 10 };
   * 
   * this.itemService.getItemsWithFilters(filters, pagination).subscribe({
   *   next: response => console.log('Itens paginados:', response),
   *   error: error => console.error('Erro na busca:', error)
   * });
   * ```
   */
  getItemsWithFilters(
    filters: ItemFilter = {}, 
    pagination: PaginationOptions = { page: 0, pageSize: 10 }
  ): Observable<PaginatedResponse<Item>> {
    this.loadingState.set(LoadingState.LOADING);
    
    let params = new HttpParams();
    
    // Adiciona filtros de busca
    // Como o JSON Server pode não suportar busca em texto completo,
    // vamos buscar todos e filtrar no cliente se houver termo de busca
    const hasSearch = filters.search && filters.search.trim().length > 0;
    
    // Adiciona ordenação
    if (filters.sortBy) {
      params = params.set('_sort', filters.sortBy);
      params = params.set('_order', filters.sortDirection || 'asc');
    }
    
    // Se não há busca, usa paginação normal do servidor
    if (!hasSearch) {
      const start = pagination.page * pagination.pageSize;
      params = params.set('_start', start.toString());
      params = params.set('_limit', pagination.pageSize.toString());
    }
    
    return this.http.get<Item[]>(this.ITEMS_ENDPOINT, { 
      params, 
      observe: 'response' 
    }).pipe(
      map(response => {
        let items = response.body || [];
        
        // Se há busca, filtra os resultados localmente
        if (hasSearch) {
          const searchTerm = filters.search!.toLowerCase().trim();
          items = items.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
          );
        }
        
        // Calcula total e aplica paginação local se necessário
        const total = items.length;
        
        // Se há busca, aplica paginação local
        if (hasSearch) {
          const start = pagination.page * pagination.pageSize;
          const end = start + pagination.pageSize;
          items = items.slice(start, end);
        } else {
          // Usa o total do servidor se não há busca
          const serverTotal = parseInt(response.headers.get('X-Total-Count') || '0');
          return {
            data: items,
            pagination: {
              ...pagination,
              totalItems: serverTotal,
              totalPages: Math.ceil(serverTotal / pagination.pageSize)
            },
            total: serverTotal
          };
        }
        
        return {
          data: items,
          pagination: {
            ...pagination,
            totalItems: total,
            totalPages: Math.ceil(total / pagination.pageSize)
          },
          total
        };
      }),
      tap(response => {
        this.itemsSubject.next(response.data);
        this.loadingState.set(LoadingState.SUCCESS);
      }),
      catchError(error => {
        this.loadingState.set(LoadingState.ERROR);
        console.error('Erro ao buscar itens com filtros:', error);
        return throwError(() => new Error('Falha ao buscar itens'));
      })
    );
  }

  /**
   * Busca um item específico por ID
   * @param {number} id - ID do item
   * @returns {Observable<Item>} Observable com o item encontrado
   * @throws {Error} Quando o item não é encontrado ou há erro na requisição
   * @example
   * ```typescript
   * this.itemService.getItemById(1).subscribe({
   *   next: item => console.log('Item encontrado:', item),
   *   error: error => console.error('Item não encontrado:', error)
   * });
   * ```
   */
  getItemById(id: number): Observable<Item> {
    this.loadingState.set(LoadingState.LOADING);
    
    return this.http.get<Item>(`${this.ITEMS_ENDPOINT}/${id}`).pipe(
      tap(item => {
        this.selectedItemSubject.next(item);
        this.loadingState.set(LoadingState.SUCCESS);
      }),
      catchError(error => {
        this.loadingState.set(LoadingState.ERROR);
        console.error('Erro ao buscar item:', error);
        return throwError(() => new Error(`Item com ID ${id} não encontrado`));
      })
    );
  }

  /**
   * Cria um novo item
   * @param {CreateItemDto} itemData - Dados do item a ser criado
   * @returns {Observable<Item>} Observable com o item criado
   * @throws {Error} Quando há erro na criação
   * @example
   * ```typescript
   * const newItem = {
   *   title: 'Novo Item',
   *   description: 'Descrição do novo item',
   *   imageUrl: 'https://example.com/image.jpg'
   * };
   * 
   * this.itemService.createItem(newItem).subscribe({
   *   next: item => console.log('Item criado:', item),
   *   error: error => console.error('Erro ao criar item:', error)
   * });
   * ```
   */
  createItem(itemData: CreateItemDto): Observable<Item> {
    this.loadingState.set(LoadingState.LOADING);
    
    const newItem = {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return this.http.post<Item>(this.ITEMS_ENDPOINT, newItem).pipe(
      tap(item => {
        // Atualiza a lista local
        const currentItems = this.itemsSubject.getValue();
        this.itemsSubject.next([...currentItems, item]);
        this.loadingState.set(LoadingState.SUCCESS);
      }),
      catchError(error => {
        this.loadingState.set(LoadingState.ERROR);
        console.error('Erro ao criar item:', error);
        return throwError(() => new Error('Falha ao criar item'));
      })
    );
  }

  /**
   * Atualiza um item existente
   * @param {number} id - ID do item a ser atualizado
   * @param {UpdateItemDto} itemData - Dados para atualização
   * @returns {Observable<Item>} Observable com o item atualizado
   * @throws {Error} Quando há erro na atualização
   * @example
   * ```typescript
   * const updates = {
   *   title: 'Título Atualizado',
   *   description: 'Nova descrição'
   * };
   * 
   * this.itemService.updateItem(1, updates).subscribe({
   *   next: item => console.log('Item atualizado:', item),
   *   error: error => console.error('Erro ao atualizar item:', error)
   * });
   * ```
   */
  updateItem(id: number, itemData: UpdateItemDto): Observable<Item> {
    this.loadingState.set(LoadingState.LOADING);
    
    const updateData = {
      ...itemData,
      updatedAt: new Date()
    };
    
    return this.http.put<Item>(`${this.ITEMS_ENDPOINT}/${id}`, updateData).pipe(
      tap(updatedItem => {
        // Atualiza a lista local
        const currentItems = this.itemsSubject.getValue();
        const updatedItems = currentItems.map(item => 
          item.id === id ? updatedItem : item
        );
        this.itemsSubject.next(updatedItems);
        
        // Atualiza o item selecionado se for o mesmo
        if (this.selectedItemSubject.getValue()?.id === id) {
          this.selectedItemSubject.next(updatedItem);
        }
        
        this.loadingState.set(LoadingState.SUCCESS);
      }),
      catchError(error => {
        this.loadingState.set(LoadingState.ERROR);
        console.error('Erro ao atualizar item:', error);
        return throwError(() => new Error('Falha ao atualizar item'));
      })
    );
  }

  /**
   * Remove um item
   * @param {number} id - ID do item a ser removido
   * @returns {Observable<void>} Observable que completa quando o item é removido
   * @throws {Error} Quando há erro na remoção
   * @example
   * ```typescript
   * this.itemService.deleteItem(1).subscribe({
   *   next: () => console.log('Item removido com sucesso'),
   *   error: error => console.error('Erro ao remover item:', error)
   * });
   * ```
   */
  deleteItem(id: number): Observable<void> {
    this.loadingState.set(LoadingState.LOADING);
    
    return this.http.delete<void>(`${this.ITEMS_ENDPOINT}/${id}`).pipe(
      tap(() => {
        // Remove da lista local
        const currentItems = this.itemsSubject.getValue();
        const filteredItems = currentItems.filter(item => item.id !== id);
        this.itemsSubject.next(filteredItems);
        
        // Limpa o item selecionado se for o mesmo
        if (this.selectedItemSubject.getValue()?.id === id) {
          this.selectedItemSubject.next(null);
        }
        
        this.loadingState.set(LoadingState.SUCCESS);
      }),
      catchError(error => {
        this.loadingState.set(LoadingState.ERROR);
        console.error('Erro ao deletar item:', error);
        return throwError(() => new Error('Falha ao deletar item'));
      })
    );
  }

  /**
   * Define o item selecionado
   * @param {Item | null} item - Item a ser selecionado
   * @returns {void}
   * @example
   * ```typescript
   * this.itemService.setSelectedItem(item);
   * ```
   */
  setSelectedItem(item: Item | null): void {
    this.selectedItemSubject.next(item);
  }

  /**
   * Limpa o item selecionado
   * @returns {void}
   * @example
   * ```typescript
   * this.itemService.clearSelectedItem();
   * ```
   */
  clearSelectedItem(): void {
    this.selectedItemSubject.next(null);
  }

  /**
   * Obtém o valor atual da lista de itens
   * @returns {Item[]} Array de itens atual
   * @example
   * ```typescript
   * const currentItems = this.itemService.getCurrentItems();
   * ```
   */
  getCurrentItems(): Item[] {
    return this.itemsSubject.getValue();
  }

  /**
   * Obtém o valor atual do item selecionado
   * @returns {Item | null} Item selecionado ou null
   * @example
   * ```typescript
   * const selectedItem = this.itemService.getCurrentSelectedItem();
   * ```
   */
  getCurrentSelectedItem(): Item | null {
    return this.selectedItemSubject.getValue();
  }

  /**
   * Redefine o estado de carregamento
   * @returns {void}
   * @example
   * ```typescript
   * this.itemService.resetLoadingState();
   * ```
   */
  resetLoadingState(): void {
    this.loadingState.set(LoadingState.IDLE);
  }
}
