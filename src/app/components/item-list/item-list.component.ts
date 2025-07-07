/**
 * @fileoverview Componente para exibir lista de itens
 * @author AI Assistant
 */

import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { ItemService } from '../../services/item.service';
import { NotificationService } from '../../services/notification.service';
import { Item, ItemFilter, PaginationOptions } from '../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

/**
 * Componente principal para exibir e gerenciar lista de itens
 * @class ItemListComponent
 * @description Componente que exibe a lista de itens com funcionalidades
 * de busca, filtros, paginação e ações CRUD
 */
@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    ItemCardComponent,
    ItemFormComponent,
    SpinnerComponent
  ],
  template: `
    <div class="item-list-container">
      <!-- Toolbar -->
      <mat-toolbar color="primary" class="main-toolbar">
        <span class="toolbar-title">
          <mat-icon>inventory</mat-icon>
          Gerenciador de Itens
        </span>
        
        <span class="toolbar-spacer"></span>
        
        <button 
          mat-raised-button 
          color="accent"
          id="btn-create-item"
          (click)="openCreateDialog()"
          [disabled]="isLoading()">
          <mat-icon>add</mat-icon>
          Novo Item
        </button>
      </mat-toolbar>

      <!-- Filtros -->
      <div class="filters-section">
        <mat-card class="filters-card">
          <mat-card-content>
            <form [formGroup]="filtersForm" class="filters-form">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Buscar</mat-label>
                <input 
                  matInput 
                  formControlName="search"
                  id="input-search"
                  placeholder="Digite 3+ caracteres para buscar...">
                <mat-icon matPrefix>search</mat-icon>
                @if (searchValue().length > 0 && searchValue().length < 3) {
                  <mat-hint class="search-hint">Digite mais {{ 3 - searchValue().length }} caractere(s)</mat-hint>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="sort-field">
                <mat-label>Ordenar por</mat-label>
                <mat-select formControlName="sortBy" id="select-sort-by">
                  <mat-option value="title">Título</mat-option>
                  <mat-option value="createdAt">Data de Criação</mat-option>
                  <mat-option value="updatedAt">Última Atualização</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="direction-field">
                <mat-label>Direção</mat-label>
                <mat-select formControlName="sortDirection" id="select-sort-direction">
                  <mat-option value="asc">Crescente</mat-option>
                  <mat-option value="desc">Decrescente</mat-option>
                </mat-select>
              </mat-form-field>

              <button 
                type="button"
                mat-button 
                color="warn"
                id="btn-clear-filters"
                (click)="clearFilters()"
                [disabled]="isLoading()">
                <mat-icon>clear</mat-icon>
                Limpar
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <app-spinner 
            [size]="60" 
            [message]="'Carregando itens...'">
          </app-spinner>
        </div>
      }

      <!-- Empty State -->
      @if (!isLoading() && items().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">inventory_2</mat-icon>
          <h2>Nenhum item encontrado</h2>
          <p>
            @if (hasActiveFilters()) {
              Tente ajustar os filtros de busca ou 
              <button mat-button color="primary" id="btn-clear-filters-empty" (click)="clearFilters()">
                limpar filtros
              </button>
            } @else {
              Comece criando seu primeiro item
            }
          </p>
          <button 
            mat-raised-button 
            color="primary"
            id="btn-create-first-item"
            (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            Criar Primeiro Item
          </button>
        </div>
      }

      <!-- Items Grid -->
      @if (!isLoading() && items().length > 0) {
        <div class="items-grid">
          @for (item of items(); track item.id) {
            <app-item-card
              [item]="item"
              [showActions]="true"
              [isLoading]="loadingItemId() === item.id"
              (view)="viewItem($event)"
              (edit)="editItem($event)"
              (delete)="deleteItem($event)">
            </app-item-card>
          }
        </div>

        <!-- Pagination -->
        <mat-paginator
          [length]="totalItems()"
          [pageSize]="pagination().pageSize"
          [pageIndex]="pagination().page"
          [pageSizeOptions]="[5, 10, 25, 50]"
          [showFirstLastButtons]="true"
          (page)="onPageChange($event)"
          id="paginator-items"
          class="pagination">
        </mat-paginator>
      }

      <!-- Form Dialog -->
      @if (showFormDialog()) {
        <app-item-form
          [item]="selectedItem()"
          [isLoading]="isLoading()"
          (save)="saveItem($event)"
          (cancel)="closeFormDialog()">
        </app-item-form>
      }
    </div>
  `,
  styles: [`
    .item-list-container {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .filters-section {
      padding: 16px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
    }

    .filters-card {
      max-width: 1200px;
      margin: 0 auto;
      box-shadow: none;
      border: 1px solid #e0e0e0;
    }

    .filters-form {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 200px;
    }

    .search-hint {
      color: #ff9800;
      font-size: 12px;
      font-weight: 500;
    }

    .sort-field,
    .direction-field {
      min-width: 150px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #ccc;
    }

    .empty-state h2 {
      margin: 16px 0 8px;
      font-weight: 400;
      color: #333;
    }

    .empty-state p {
      margin-bottom: 24px;
      font-size: 16px;
      max-width: 400px;
      line-height: 1.5;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .pagination {
      background: white;
      border-top: 1px solid #e0e0e0;
      position: sticky;
      bottom: 0;
      z-index: 10;
    }

    @media (max-width: 768px) {
      .filters-form {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field,
      .sort-field,
      .direction-field {
        min-width: auto;
        width: 100%;
      }

      .items-grid {
        grid-template-columns: 1fr;
        padding: 16px;
        gap: 12px;
      }

      .toolbar-title {
        font-size: 16px;
      }
    }

    @media (max-width: 480px) {
      .main-toolbar {
        padding: 0 8px;
      }

      .toolbar-title span {
        display: none;
      }
    }
  `]
})
export class ItemListComponent implements OnInit, OnDestroy {
  /**
   * Injeção de dependências
   */
  private readonly itemService = inject(ItemService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  /**
   * Signal para lista de itens
   */
  readonly items = signal<Item[]>([]);

  /**
   * Signal para item selecionado
   */
  readonly selectedItem = signal<Item | null>(null);

  /**
   * Signal para controle de loading
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal para ID do item sendo processado
   */
  readonly loadingItemId = signal<number | null>(null);

  /**
   * Signal para controle do diálogo de formulário
   */
  readonly showFormDialog = signal<boolean>(false);

  /**
   * Signal para total de itens
   */
  readonly totalItems = signal<number>(0);

  /**
   * Signal para opções de paginação
   */
  readonly pagination = signal<PaginationOptions>({
    page: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  /**
   * Formulário de filtros
   */
  filtersForm: FormGroup;

  /**
   * Signal para valor da busca
   */
  readonly searchValue = signal<string>('');

  /**
   * Signal computado para verificar se há filtros ativos
   */
  readonly hasActiveFilters = computed(() => {
    const formValue = this.filtersForm?.value;
    return formValue?.search || formValue?.sortBy || formValue?.sortDirection !== 'asc';
  });

  /**
   * Subject para destruição de subscriptions
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Construtor do componente
   */
  constructor() {
    this.filtersForm = this.fb.group({
      search: [''],
      sortBy: ['title'],
      sortDirection: ['asc']
    });
  }

  /**
   * Inicialização do componente
   */
  ngOnInit(): void {
    this.setupFilters();
    this.loadItems();
  }

  /**
   * Destruição do componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configura os filtros com debounce
   * Busca só é executada a partir do 3º caractere
   */
  private setupFilters(): void {
    // Observa mudanças no campo de busca para atualizar o signal imediatamente
    this.filtersForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchValue: string) => {
        this.searchValue.set(searchValue || '');
      });

    // Observa mudanças no campo de busca com debounce para executar a busca
    this.filtersForm.get('search')?.valueChanges
      .pipe(
        debounceTime(500), // Maior debounce para busca
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchValue: string) => {
        // Só executa busca se tiver 3+ caracteres ou estiver vazio (para limpar)
        if (!searchValue || searchValue.length >= 3) {
          this.pagination.set({ ...this.pagination(), page: 0 });
          this.loadItems();
        }
      });

    // Observa mudanças nos campos de ordenação (sem debounce)
    this.filtersForm.get('sortBy')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pagination.set({ ...this.pagination(), page: 0 });
        this.loadItems();
      });

    this.filtersForm.get('sortDirection')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pagination.set({ ...this.pagination(), page: 0 });
        this.loadItems();
      });
  }

  /**
   * Carrega a lista de itens
   * Só aplica filtro de busca se tiver 3+ caracteres
   */
  private loadItems(): void {
    this.isLoading.set(true);
    
    const searchValue = this.filtersForm.get('search')?.value || '';
    
    const filters: ItemFilter = {
      // Só inclui busca se tiver 3+ caracteres ou estiver vazio
      search: (!searchValue || searchValue.length >= 3) ? searchValue : '',
      sortBy: this.filtersForm.get('sortBy')?.value || 'title',
      sortDirection: this.filtersForm.get('sortDirection')?.value || 'asc'
    };

    this.itemService.getItemsWithFilters(filters, this.pagination())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.items.set(response.data);
          this.totalItems.set(response.total);
          this.pagination.set(response.pagination);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Erro ao carregar itens');
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Abre o diálogo de criação
   */
  openCreateDialog(): void {
    this.selectedItem.set(null);
    this.showFormDialog.set(true);
  }

  /**
   * Fecha o diálogo de formulário
   */
  closeFormDialog(): void {
    this.showFormDialog.set(false);
    this.selectedItem.set(null);
  }

  /**
   * Visualiza um item
   */
  viewItem(item: Item): void {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: item
    });
  }

  /**
   * Edita um item
   */
  editItem(item: Item): void {
    this.selectedItem.set(item);
    this.showFormDialog.set(true);
  }

  /**
   * Exclui um item
   */
  deleteItem(item: Item): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o item "${item.title}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        icon: 'delete',
        type: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(item);
      }
    });
  }

  /**
   * Executa a exclusão do item
   */
  private performDelete(item: Item): void {
    this.loadingItemId.set(item.id);
    
    this.itemService.deleteItem(item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Item excluído com sucesso');
          this.loadItems();
          this.loadingItemId.set(null);
        },
        error: (error) => {
          this.notificationService.error('Erro ao excluir item');
          this.loadingItemId.set(null);
        }
      });
  }

  /**
   * Salva um item (criar ou atualizar)
   */
  saveItem(data: any): void {
    this.isLoading.set(true);
    
    if (this.selectedItem()) {
      // Atualizar item existente
      this.itemService.updateItem(this.selectedItem()!.id, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Item atualizado com sucesso');
            this.closeFormDialog();
            this.loadItems();
          },
          error: (error) => {
            this.notificationService.error('Erro ao atualizar item');
            this.isLoading.set(false);
          }
        });
    } else {
      // Criar novo item
      this.itemService.createItem(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Item criado com sucesso');
            this.closeFormDialog();
            this.loadItems();
          },
          error: (error) => {
            this.notificationService.error('Erro ao criar item');
            this.isLoading.set(false);
          }
        });
    }
  }

  /**
   * Manipula mudança de página
   */
  onPageChange(event: PageEvent): void {
    this.pagination.set({
      ...this.pagination(),
      page: event.pageIndex,
      pageSize: event.pageSize
    });
    this.loadItems();
  }

  /**
   * Limpa os filtros
   */
  clearFilters(): void {
    this.filtersForm.reset({
      search: '',
      sortBy: 'title',
      sortDirection: 'asc'
    });
  }
}
