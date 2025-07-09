import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemFormComponent } from './item-form.component';

describe('ItemFormComponent', () => {
    let component: ItemFormComponent;
    let fixture: ComponentFixture<ItemFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemFormComponent, ReactiveFormsModule, NoopAnimationsModule, HttpClientTestingModule]
        }).compileComponents();
        fixture = TestBed.createComponent(ItemFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit save event when form is valid and submitted', () => {
        spyOn(component.save, 'emit');
        // Garante que não está em modo dialog
        (component as any).dialogRef = undefined;
        component.itemForm.patchValue({
            title: 'Test',
            description: 'Descrição válida',
            imageUrl: 'url'
        });
        component.onSubmit();
        expect(component.save.emit).toHaveBeenCalled();
    });

    it('should emit cancel event', () => {
        spyOn(component.cancel, 'emit');
        component.onCancel();
        expect(component.cancel.emit).toHaveBeenCalled();
    });
});
