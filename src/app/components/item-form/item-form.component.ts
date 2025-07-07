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
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
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
