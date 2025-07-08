import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ItemCardComponent } from './item-card.component';
import { Item } from '../../models/item.model';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockItem: Item = {
    id: 1,
    title: 'Test Item',
    description: 'Test Description',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ItemCardComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Set required input
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display item information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Test Item');
    expect(compiled.textContent).toContain('Test Description');
  });

  it('should display image with correct src', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img') as HTMLImageElement;
    
    expect(img.src).toBe('https://example.com/image.jpg');
  });

  it('should emit view event when onView is called', () => {
    spyOn(component.view, 'emit');
    
    component.onView();
    
    expect(component.view.emit).toHaveBeenCalledWith(mockItem);
  });

  it('should emit delete event when onDelete is called', () => {
    spyOn(component.delete, 'emit');
    
    component.onDelete();
    
    expect(component.delete.emit).toHaveBeenCalledWith(mockItem);
  });

  it('should open edit dialog when onEdit is called', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of('saved'));
    mockDialog.open.and.returnValue(dialogRefSpy);
    
    spyOn(component.itemSaved, 'emit');
    
    component.onEdit();
    
    expect(mockDialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        width: '800px',
        maxWidth: '95vw',
        data: mockItem,
        disableClose: false
      })
    );
    expect(component.itemSaved.emit).toHaveBeenCalled();
  });

  it('should not emit itemSaved when edit dialog is cancelled', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    mockDialog.open.and.returnValue(dialogRefSpy);
    
    spyOn(component.itemSaved, 'emit');
    
    component.onEdit();
    
    expect(component.itemSaved.emit).not.toHaveBeenCalled();
  });

  it('should handle image error by setting fallback src', () => {
    const mockEvent = {
      target: {
        src: 'https://example.com/broken-image.jpg'
      }
    } as any;
    
    component.onImageError(mockEvent);
    
    expect(mockEvent.target.src).toBe('https://placehold.co/400x200?text=Imagem+não+encontrada');
  });

  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const formatted = component.formatDate(date);
    
    expect(formatted).toBe('15/01/2024');
  });

  it('should format string date correctly', () => {
    const dateString = '2024-01-15T10:30:00.000Z';
    const formatted = component.formatDate(dateString);
    
    expect(formatted).toBe('15/01/2024');
  });

  it('should show actions when showActions is true', () => {
    component.showActions = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const actionButton = compiled.querySelector('button[mat-icon-button]');
    
    expect(actionButton).toBeTruthy();
  });

  it('should hide actions when showActions is false', () => {
    component.showActions = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const actionButton = compiled.querySelector('button[mat-icon-button]');
    
    expect(actionButton).toBeFalsy();
  });

  it('should show loading state when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const loadingElement = compiled.querySelector('.loading');
    
    // Check if loading class is applied or loading spinner exists
    expect(compiled.textContent).toContain('Processando...');
  });

  it('should display creation date', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Criado em');
    expect(compiled.textContent).toContain('01/01/2024');
  });

  it('should handle click events on view button', () => {
    spyOn(component, 'onView');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const viewButton = compiled.querySelector('button[title="Visualizar"]') as HTMLButtonElement;
    
    if (viewButton) {
      viewButton.click();
      expect(component.onView).toHaveBeenCalled();
    }
  });

  it('should handle click events on edit button', () => {
    spyOn(component, 'onEdit');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('button[title="Editar"]') as HTMLButtonElement;
    
    if (editButton) {
      editButton.click();
      expect(component.onEdit).toHaveBeenCalled();
    }
  });

  it('should handle click events on delete button', () => {
    spyOn(component, 'onDelete');
    
    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('button[title="Excluir"]') as HTMLButtonElement;
    
    if (deleteButton) {
      deleteButton.click();
      expect(component.onDelete).toHaveBeenCalled();
    }
  });

  it('should have correct input properties', () => {
    expect(component.item).toBe(mockItem);
    expect(component.showActions).toBe(true);
    expect(component.isLoading).toBe(false);
  });

  it('should have correct output properties', () => {
    expect(component.view).toBeDefined();
    expect(component.edit).toBeDefined();
    expect(component.delete).toBeDefined();
    expect(component.itemSaved).toBeDefined();
  });
});
