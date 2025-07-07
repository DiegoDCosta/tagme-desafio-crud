/**
 * @fileoverview Componente de formulário para criar/editar itens
 * @author AI Assistant
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject, takeUntil } from 'rxjs';
import { Item, CreateItemDto, UpdateItemDto } from '../../models/item.model';

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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ImageCropperComponent
  ],
  template: `
    <mat-card class="item-form-card">
      <mat-card-header>
        <mat-card-title>
          {{ isEditMode() ? 'Editar Item' : 'Novo Item' }}
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
          <!-- Campo Título -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título</mat-label>
            <input 
              matInput 
              formControlName="title"
              id="input-title"
              placeholder="Digite o título do item"
              maxlength="100">
            <mat-hint>{{ titleControl.value?.length || 0 }}/100</mat-hint>
            @if (titleControl.invalid && (titleControl.dirty || titleControl.touched)) {
              <mat-error>
                @if (titleControl.errors?.['required']) {
                  Título é obrigatório
                }
                @if (titleControl.errors?.['minlength']) {
                  Título deve ter pelo menos 3 caracteres
                }
              </mat-error>
            }
          </mat-form-field>

          <!-- Campo Descrição -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição</mat-label>
            <textarea 
              matInput 
              formControlName="description"
              id="textarea-description"
              placeholder="Digite a descrição do item"
              rows="4"
              maxlength="500">
            </textarea>
            <mat-hint>{{ descriptionControl.value?.length || 0 }}/500</mat-hint>
            @if (descriptionControl.invalid && (descriptionControl.dirty || descriptionControl.touched)) {
              <mat-error>
                @if (descriptionControl.errors?.['required']) {
                  Descrição é obrigatória
                }
                @if (descriptionControl.errors?.['minlength']) {
                  Descrição deve ter pelo menos 10 caracteres
                }
              </mat-error>
            }
          </mat-form-field>

          <!-- Campo URL da Imagem -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>URL da Imagem</mat-label>
            <input 
              matInput 
              formControlName="imageUrl"
              id="input-image-url"
              placeholder="Digite a URL da imagem ou faça upload"
              type="url">
            @if (imageUrlControl.invalid && (imageUrlControl.dirty || imageUrlControl.touched)) {
              <mat-error>
                @if (imageUrlControl.errors?.['required']) {
                  URL da imagem é obrigatória
                }
                @if (imageUrlControl.errors?.['pattern']) {
                  URL deve ser válida
                }
              </mat-error>
            }
          </mat-form-field>

          <!-- Upload de Imagem -->
          <div class="image-upload-section">
            <h3>Upload de Imagem</h3>
            <input 
              type="file" 
              accept="image/*"
              id="input-file-upload"
              (change)="onImageSelected($event)"
              #fileInput
              style="display: none;">
            
            <div class="upload-actions">
              <button 
                type="button"
                mat-raised-button 
                color="accent"
                id="btn-select-image"
                (click)="fileInput.click()">
                <mat-icon>cloud_upload</mat-icon>
                Selecionar Imagem
              </button>
              
              @if (imageChangedEvent) {
                <button 
                  type="button"
                  mat-button 
                  color="warn"
                  id="btn-clear-image"
                  (click)="clearImage()">
                  <mat-icon>clear</mat-icon>
                  Limpar
                </button>
              }
            </div>
            
            <!-- Recorte de Imagem -->
            @if (imageChangedEvent) {
              <div class="image-cropper-container">
                <image-cropper
                  [imageChangedEvent]="imageChangedEvent"
                  [maintainAspectRatio]="true"
                  [aspectRatio]="4/3"
                  [resizeToWidth]="400"
                  [cropperMinWidth]="100"
                  [cropperMinHeight]="100"
                  [roundCropper]="false"
                  [canvasRotation]="0"
                  [allowMoveImage]="true"

                  (imageCropped)="onImageCropped($event)">
                </image-cropper>
              </div>
            }
          </div>

          <!-- Preview da Imagem -->
          @if (imagePreviewUrl()) {
            <div class="image-preview">
              <h3>Preview da Imagem</h3>
              <img 
                [src]="imagePreviewUrl()" 
                alt="Preview"
                class="preview-image"
                (error)="onImageError($event)">
            </div>
          }
        </form>
      </mat-card-content>

      <mat-card-actions class="form-actions">
        <button 
          type="button"
          mat-button 
          id="btn-cancel-form"
          (click)="onCancel()"
          [disabled]="isLoading">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        
        <button 
          type="submit"
          mat-raised-button 
          color="primary"
          id="btn-save-form"
          (click)="onSubmit()"
          [disabled]="itemForm.invalid || isLoading">
          @if (isLoading) {
            <mat-spinner diameter="16"></mat-spinner>
          } @else {
            <mat-icon>save</mat-icon>
          }
          {{ isEditMode() ? 'Atualizar' : 'Criar' }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .item-form-card {
      max-width: 800px;
      margin: 16px auto;
      padding: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .image-upload-section {
      margin: 24px 0;
    }

    .image-upload-section h3 {
      margin-bottom: 16px;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .upload-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .image-cropper-container {
      width: 100%;
      height: 400px;
      margin: 16px 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }

    .image-preview {
      margin: 24px 0;
    }

    .image-preview h3 {
      margin-bottom: 12px;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .preview-image {
      max-width: 100%;
      max-height: 200px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }

    .form-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .item-form-card {
        margin: 8px;
        max-width: none;
      }
      
      .image-cropper-container {
        height: 300px;
      }
      
      .form-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class ItemFormComponent implements OnInit, OnDestroy {
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
   * @param {FormBuilder} fb - FormBuilder para criar formulários reativos
   */
  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  /**
   * Inicialização do componente
   * @returns {void}
   */
  ngOnInit(): void {
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
      imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)]]
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
    if (event.objectUrl) {
      this.croppedImageUrl.set(event.objectUrl);
      this.itemForm.patchValue({
        imageUrl: event.objectUrl
      });
    }
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
      
      if (this.isEditMode()) {
        const updateData: UpdateItemDto = {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl
        };
        this.save.emit(updateData);
      } else {
        const createData: CreateItemDto = {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl
        };
        this.save.emit(createData);
      }
    }
  }

  /**
   * Manipula o cancelamento da edição
   * @returns {void}
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
