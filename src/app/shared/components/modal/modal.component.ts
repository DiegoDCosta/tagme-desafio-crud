/**
 * @fileoverview Componente genérico de modal
 * @author AI Assistant
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

/**
 * Componente genérico para modais
 * @class ModalComponent
 * @description Componente reutilizável para exibir conteúdo em modal
 * @example
 * ```html
 * <app-modal 
 *   [isOpen]="showModal"
 *   [title]="'Título do Modal'"
 *   [size]="'large'"
 *   [showCloseButton]="true"
 *   (closeModal)="onCloseModal()">
 *   <div class="modal-content">
 *     Conteúdo do modal aqui
 *   </div>
 * </app-modal>
 * ```
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  /**
   * Controla se o modal está aberto
   * @type {boolean}
   * @default false
   */
  @Input() isOpen: boolean = false;

  /**
   * Título do modal
   * @type {string}
   */
  @Input() title?: string;

  /**
   * Tamanho do modal
   * @type {'small' | 'medium' | 'large' | 'fullscreen'}
   * @default 'medium'
   */
  @Input() size: 'small' | 'medium' | 'large' | 'fullscreen' = 'medium';

  /**
   * Mostra o botão de fechar
   * @type {boolean}
   * @default true
   */
  @Input() showCloseButton: boolean = true;

  /**
   * Mostra o rodapé do modal
   * @type {boolean}
   * @default false
   */
  @Input() showFooter: boolean = false;

  /**
   * Permite fechar o modal clicando no overlay
   * @type {boolean}
   * @default true
   */
  @Input() closeOnOverlayClick: boolean = true;

  /**
   * Permite fechar o modal com a tecla ESC
   * @type {boolean}
   * @default true
   */
  @Input() closeOnEscape: boolean = true;

  /**
   * Evento emitido quando o modal é fechado
   * @type {EventEmitter<void>}
   */
  @Output() closeModal = new EventEmitter<void>();

  /**
   * Listener para tecla ESC
   * @private
   */
  private escapeListener?: (event: KeyboardEvent) => void;

  /**
   * Inicialização do componente
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.closeOnEscape) {
      this.escapeListener = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.isOpen) {
          this.onClose();
        }
      };
      document.addEventListener('keydown', this.escapeListener);
    }
  }

  /**
   * Limpeza do componente
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
    }
  }

  /**
   * Fecha o modal
   * @returns {void}
   */
  onClose(): void {
    this.closeModal.emit();
  }

  /**
   * Manipula o clique no overlay
   * @returns {void}
   */
  onOverlayClick(): void {
    if (this.closeOnOverlayClick) {
      this.onClose();
    }
  }
}
