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
import { ThemeService } from '../../services/theme.service';
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
    SpinnerComponent
],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  /**
   * Injeção de dependências
   */
  private readonly itemService = inject(ItemService);
  private readonly notificationService = inject(NotificationService);
  public readonly themeService = inject(ThemeService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  /**
   * Signal para lista de itens
   */
  readonly items = signal<Item[]>([]);



  /**
   * Signal para controle de loading
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal para ID do item sendo processado
   */
  readonly loadingItemId = signal<number | null>(null);



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
      sortBy: ['createdAt'],
      sortDirection: ['desc']
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
   * Alternar tema
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Abre o diálogo de criação
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: null, // null para criação
      disableClose: false // Permite fechar com ESC e clique fora
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadItems();
      }
    });
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
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: item,
      disableClose: false // Permite fechar com ESC e clique fora
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadItems();
      }
    });
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

  /**
   * Manipula o evento de item salvo
   * Recarrega a lista de itens
   */
  onItemSaved(): void {
    this.loadItems();
  }
}
