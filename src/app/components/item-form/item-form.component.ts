/**
 * @fileoverview Componente de formulário para criar/editar itens
 * @author AI Assistant
 */

import { Component, computed, EventEmitter, Inject, inject, Input, OnDestroy, OnInit, Optional, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Subject, takeUntil } from 'rxjs';
import { CreateItemDto, Item, UpdateItemDto } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { NotificationService } from '../../services/notification.service';

/**
 * Componente de formulário para criar e editar itens
 * @class ItemFormComponent
 * @description Componente reutilizável para formulários de item com validação
 * e upload de imagem com recorte
 * @example
 * ```html
 * <app-item-form
 *   [item]="selectedItem"
 *   [isLoading]="isLoading"
 *   (save)="onSaveItem($event)"
 *   (cancel)="onCancelEdit()">
 * </app-item-form>
 * ```
 */
@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ImageCropperComponent
  ],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit, OnDestroy {
  /**
   * Injeção de dependências
   */
  private readonly fb = inject(FormBuilder);
  private readonly itemService = inject(ItemService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  /**
   * Item para edição (opcional)
   * @type {Item | null}
   */
  @Input() item: Item | null = null;

  /**
   * Controla o estado de carregamento
   * @type {boolean}
   * @default false
   */
  @Input() isLoading: boolean = false;

  /**
   * Evento emitido ao salvar o item
   * @type {EventEmitter<CreateItemDto | UpdateItemDto>}
   */
  @Output() save = new EventEmitter<CreateItemDto | UpdateItemDto>();

  /**
   * Evento emitido ao cancelar a edição
   * @type {EventEmitter<void>}
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Formulário reativo
   * @type {FormGroup}
   */
  itemForm!: FormGroup;

  /**
   * Evento de mudança de imagem para o cropper
   * @type {Event | null}
   */
  imageChangedEvent: Event | null = null;

  /**
   * URL da imagem recortada
   * @private
   */
  private readonly croppedImageUrl = signal<string>('');

  /**
   * Signal computado para determinar se está em modo de edição
   * @readonly
   */
  readonly isEditMode = computed(() => this.item !== null);

  /**
   * Signal computado para URL de preview da imagem
   * @readonly
   */
  readonly imagePreviewUrl = computed(() => {
    const croppedUrl = this.croppedImageUrl();
    const formUrl = this.itemForm?.get('imageUrl')?.value;
    return croppedUrl || formUrl || '';
  });

  /**
   * Subject para destruição de subscriptions
   * @private
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Construtor do componente
   */
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: Item | null,
    @Optional() public dialogRef: MatDialogRef<ItemFormComponent>
  ) {
    // Se o componente for usado como diálogo, usa os dados do diálogo
    if (this.dialogData) {
      this.item = this.dialogData;
    }
    // Inicialização do formulário será feita no ngOnInit
  }

  /**
   * Inicialização do componente
   * @returns {void}
   */
  ngOnInit(): void {
    this.initializeForm();
    this.setupForm();
    this.setupFormValueChanges();
  }

  /**
   * Destruição do componente
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Getter para o controle do título
   * @returns {AbstractControl} Controle do título
   */
  get titleControl() {
    return this.itemForm.get('title')!;
  }

  /**
   * Getter para o controle da descrição
   * @returns {AbstractControl} Controle da descrição
   */
  get descriptionControl() {
    return this.itemForm.get('description')!;
  }

  /**
   * Getter para o controle da URL da imagem
   * @returns {AbstractControl} Controle da URL da imagem
   */
  get imageUrlControl() {
    return this.itemForm.get('imageUrl')!;
  }

  /**
   * Inicializa o formulário
   * @private
   * @returns {void}
   */
  private initializeForm(): void {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required]]
    });
  }



  /**
   * Configura o formulário com dados do item
   * @private
   * @returns {void}
   */
  private setupForm(): void {
    if (this.item) {
      this.itemForm.patchValue({
        title: this.item.title,
        description: this.item.description,
        imageUrl: this.item.imageUrl
      });
    }
  }

  /**
   * Configura observadores para mudanças no formulário
   * @private
   * @returns {void}
   */
  private setupFormValueChanges(): void {
    this.itemForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Limpa imagem recortada quando URL é alterada manualmente
        if (this.croppedImageUrl()) {
          this.croppedImageUrl.set('');
        }
      });
  }

  /**
   * Manipula a seleção de arquivo de imagem
   * @param {Event} event - Evento de seleção de arquivo
   * @returns {void}
   */
  onImageSelected(event: Event): void {
    this.imageChangedEvent = event;
    this.croppedImageUrl.set('');
  }

  /**
   * Manipula o evento de imagem recortada
   * @param {ImageCroppedEvent} event - Evento de recorte de imagem
   * @returns {void}
   */
  onImageCropped(event: ImageCroppedEvent): void {
    console.log('onImageCropped chamado:', event);
    console.log('event.base64 existe?', !!event.base64);
    console.log('event.blob existe?', !!event.blob);

    if (event.base64) {
      // Se já tem base64, usa direto
      this.croppedImageUrl.set(event.base64);
      this.itemForm.patchValue({
        imageUrl: event.base64
      });
      console.log('FormControl imageUrl atualizado com base64:', this.itemForm.get('imageUrl')?.value?.length, 'caracteres');
    } else if (event.blob) {
      // Se tem blob, converte para base64
      console.log('Convertendo blob para base64...');
      this.convertBlobToBase64(event.blob);
    } else {
      console.log('Nem base64 nem blob disponível');
    }
  }

  /**
   * Converte blob para base64
   */
  private convertBlobToBase64(blob: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log('Blob convertido para base64, tamanho:', base64.length);
      this.croppedImageUrl.set(base64);
      this.itemForm.patchValue({
        imageUrl: base64
      });
      console.log('FormControl imageUrl atualizado com blob->base64:', this.itemForm.get('imageUrl')?.value?.length, 'caracteres');
    };
    reader.readAsDataURL(blob);
  }

  /**
   * Limpa a imagem selecionada
   * @returns {void}
   */
  clearImage(): void {
    this.imageChangedEvent = null;
    this.croppedImageUrl.set('');
    this.itemForm.patchValue({
      imageUrl: ''
    });
  }

  /**
   * Manipula erros de carregamento de imagem
   * Substitui por placeholder do serviço placehold.co em caso de erro
   * @param {Event} event - Evento de erro
   * @returns {void}
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x300?text=Imagem+não+encontrada';
  }

  /**
   * Manipula o envio do formulário
   * @returns {void}
   */
  onSubmit(): void {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      this.isLoading = true;

      if (this.isEditMode()) {
        const updateData: UpdateItemDto = {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl
        };

        // Se usado como diálogo, chama o service diretamente
        if (this.dialogRef && this.item) {
          this.itemService.updateItem(this.item.id, updateData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.notificationService.success('Item atualizado com sucesso');
                this.dialogRef.close('saved');
                this.redirectToList();
              },
              error: () => {
                this.notificationService.error('Erro ao atualizar item');
                this.isLoading = false;
              }
            });
        } else {
          this.save.emit(updateData);
        }
      } else {
        const createData: CreateItemDto = {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl
        };

        // Se usado como diálogo, chama o service diretamente
        if (this.dialogRef) {
          this.itemService.createItem(createData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.notificationService.success('Item criado com sucesso');
                this.dialogRef.close('saved');
                this.redirectToList();
              },
              error: () => {
                this.notificationService.error('Erro ao criar item');
                this.isLoading = false;
              }
            });
        } else {
          this.save.emit(createData);
        }
      }
    }
  }

  /**
   * Manipula o cancelamento da edição
   * @returns {void}
   */
  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.cancel.emit();
    }
  }

  /**
   * Retorna os erros do formulário para debug
   * @returns {string}
   */
  getFormErrors(): string {
    const errors: string[] = [];

    if (this.titleControl.errors) {
      errors.push(`Título: ${JSON.stringify(this.titleControl.errors)}`);
    }

    if (this.descriptionControl.errors) {
      errors.push(`Descrição: ${JSON.stringify(this.descriptionControl.errors)}`);
    }

    if (this.imageUrlControl.errors) {
      errors.push(`Imagem: ${JSON.stringify(this.imageUrlControl.errors)}`);
    }

    return errors.join(', ');
  }

  // Após salvar/criar item, redireciona para lista
  private redirectToList() {
    // Aguarda 2 segundos para mostrar a mensagem de sucesso antes de redirecionar
    setTimeout(() => {
      this.router.navigate(['/items']);
    }, 2000);
  }
}
