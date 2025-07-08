import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';

import { ItemListComponent } from './item-list.component';
import { ItemService } from '../../services/item.service';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { Item, PaginatedResponse } from '../../models/item.model';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockItems: Item[] = [
    {
      id: 1,
      title: 'Item 1',
      description: 'Description 1',
      imageUrl: 'https://example.com/image1.jpg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      title: 'Item 2',
      description: 'Description 2',
      imageUrl: 'https://example.com/image2.jpg',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ];

  const mockPaginatedResponse: PaginatedResponse<Item> = {
    data: mockItems,
    pagination: {
      page: 0,
      pageSize: 10,
      totalItems: 2,
      totalPages: 1
    },
    total: 2
  };

  beforeEach(async () => {
    const itemServiceSpy = jasmine.createSpyObj('ItemService', [
      'getItemsWithFilters',
      'deleteItem'
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error'
    ]);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', [
      'toggleTheme',
      'getCurrentTheme'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ItemListComponent,
        BrowserAnimationsModule,
        MatPaginatorModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ItemService, useValue: itemServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    
    mockItemService = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockThemeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Setup default returns
    mockItemService.getItemsWithFilters.and.returnValue(of(mockPaginatedResponse));
    mockThemeService.getCurrentTheme.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default filter values', () => {
    expect(component.filtersForm.get('search')?.value).toBe('');
    expect(component.filtersForm.get('sortBy')?.value).toBe('updatedAt');
    expect(component.filtersForm.get('sortDirection')?.value).toBe('desc');
  });

  it('should load items on init', () => {
    component.ngOnInit();
    
    expect(mockItemService.getItemsWithFilters).toHaveBeenCalled();
    expect(component.items()).toEqual(mockItems);
    expect(component.totalItems()).toBe(2);
  });

  it('should handle loading state', () => {
    component.ngOnInit();
    
    // Should be loading initially
    expect(component.isLoading()).toBe(true);
    
    // After response, should not be loading
    fixture.detectChanges();
    expect(component.isLoading()).toBe(false);
  });

  it('should handle error when loading items', () => {
    mockItemService.getItemsWithFilters.and.returnValue(throwError(() => new Error('Test error')));
    
    component.ngOnInit();
    
    expect(mockNotificationService.error).toHaveBeenCalledWith('Erro ao carregar itens');
    expect(component.isLoading()).toBe(false);
  });

  it('should filter items when search changes', (done) => {
    component.ngOnInit();
    
    // Wait for initial load
    setTimeout(() => {
      mockItemService.getItemsWithFilters.calls.reset();
      
      // Change search value
      component.filtersForm.get('search')?.setValue('test item');
      
      // Wait for debounce
      setTimeout(() => {
        expect(mockItemService.getItemsWithFilters).toHaveBeenCalledWith(
          jasmine.objectContaining({ search: 'test item' }),
          jasmine.any(Object)
        );
        done();
      }, 600); // debounce time + extra
    }, 100);
  });

  it('should not search with less than 3 characters', (done) => {
    component.ngOnInit();
    
    setTimeout(() => {
      mockItemService.getItemsWithFilters.calls.reset();
      
      // Change search value to less than 3 chars
      component.filtersForm.get('search')?.setValue('te');
      
      setTimeout(() => {
        expect(mockItemService.getItemsWithFilters).not.toHaveBeenCalled();
        done();
      }, 600);
    }, 100);
  });

  it('should handle page change', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 5,
      length: 10,
      previousPageIndex: 0
    };

    spyOn(component, 'loadItems' as any);
    component.onPageChange(pageEvent);

    expect(component.pagination().page).toBe(1);
    expect(component.pagination().pageSize).toBe(5);
    expect(component.isPaginationFading()).toBe(true);
  });

  it('should clear filters', () => {
    // Set some filter values
    component.filtersForm.patchValue({
      search: 'test',
      sortBy: 'title',
      sortDirection: 'asc'
    });

    component.clearFilters();

    expect(component.filtersForm.get('search')?.value).toBe('');
    expect(component.filtersForm.get('sortBy')?.value).toBe('updatedAt');
    expect(component.filtersForm.get('sortDirection')?.value).toBe('desc');
  });

  it('should toggle theme', () => {
    component.toggleTheme();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should open create dialog', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('saved'));
    mockDialog.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'loadItems' as any);
    component.openCreateDialog();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should view item', () => {
    const item = mockItems[0];
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.viewItem(item);

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should edit item', () => {
    const item = mockItems[0];
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('saved'));
    mockDialog.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'loadItems' as any);
    component.editItem(item);

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should delete item after confirmation', () => {
    const item = mockItems[0];
    const confirmDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    confirmDialogRefSpy.afterClosed.and.returnValue(of(true));
    mockDialog.open.and.returnValue(confirmDialogRefSpy);

    mockItemService.deleteItem.and.returnValue(of(undefined));
    spyOn(component, 'loadItems' as any);

    component.deleteItem(item);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockItemService.deleteItem).toHaveBeenCalledWith(item.id);
    expect(mockNotificationService.success).toHaveBeenCalledWith('Item excluído com sucesso');
  });

  it('should not delete item if not confirmed', () => {
    const item = mockItems[0];
    const confirmDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    confirmDialogRefSpy.afterClosed.and.returnValue(of(false));
    mockDialog.open.and.returnValue(confirmDialogRefSpy);

    component.deleteItem(item);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockItemService.deleteItem).not.toHaveBeenCalled();
  });

  it('should handle delete error', () => {
    const item = mockItems[0];
    const confirmDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    confirmDialogRefSpy.afterClosed.and.returnValue(of(true));
    mockDialog.open.and.returnValue(confirmDialogRefSpy);

    mockItemService.deleteItem.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteItem(item);

    expect(mockNotificationService.error).toHaveBeenCalledWith('Erro ao excluir item');
  });

  it('should compute hasActiveFilters correctly', () => {
    // Default state - no active filters
    expect(component.hasActiveFilters()).toBe(false);

    // Search filter
    component.filtersForm.patchValue({ search: 'test' });
    expect(component.hasActiveFilters()).toBe(true);

    // Different sort
    component.filtersForm.patchValue({ search: '', sortBy: 'title' });
    expect(component.hasActiveFilters()).toBe(true);

    // Different sort direction
    component.filtersForm.patchValue({ sortBy: 'updatedAt', sortDirection: 'asc' });
    expect(component.hasActiveFilters()).toBe(true);
  });

  it('should cleanup subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
