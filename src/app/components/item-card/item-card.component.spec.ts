import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Item } from '../../models/item.model';
import { ItemCardComponent } from './item-card.component';

describe('ItemCardComponent', () => {
    let component: ItemCardComponent;
    let fixture: ComponentFixture<ItemCardComponent>;
    let mockDialog: jasmine.SpyObj<MatDialog>;

    const mockItem: Item = {
        id: '1' as any,
        title: 'Test Item',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: '2024-01-01T00:00:00.000Z' as any,
        updatedAt: '2024-01-01T00:00:00.000Z' as any
    };

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
        // Corrige o retorno do open para simular afterClosed
        mockDialog.open.and.returnValue({ afterClosed: () => of({}) } as any);
        await TestBed.configureTestingModule({
            imports: [ItemCardComponent, NoopAnimationsModule],
            providers: [
                { provide: MatDialog, useValue: mockDialog }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ItemCardComponent);
        component = fixture.componentInstance;
        component.item = mockItem;
        component.showActions = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display item title and description', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Test Item');
        expect(compiled.textContent).toContain('Test Description');
    });

    it('should emit edit event', () => {
        spyOn(component.itemSaved, 'emit');
        component.onEdit();
        // Simula fechamento do dialog com 'saved'
        // O mock já retorna afterClosed: () => of({}), mas precisamos simular 'saved'
        mockDialog.open.and.returnValue({ afterClosed: () => of('saved') } as any);
        component.onEdit();
        expect(component.itemSaved.emit).toHaveBeenCalled();
    });

    it('should emit delete event', () => {
        spyOn(component.delete, 'emit');
        component.onDelete();
        expect(component.delete.emit).toHaveBeenCalledWith(mockItem);
    });

    it('should emit view event', () => {
        spyOn(component.view, 'emit');
        component.onView();
        expect(component.view.emit).toHaveBeenCalledWith(mockItem);
    });
});
