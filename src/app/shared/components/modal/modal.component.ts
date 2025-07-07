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
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onOverlayClick()">
        <div 
          class="modal-container"
          [ngClass]="'modal-' + size"
          (click)="$event.stopPropagation()">
          
          <div class="modal-header">
            @if (title) {
              <h2 class="modal-title">{{ title }}</h2>
            }
            
            @if (showCloseButton) {
              <button 
                mat-icon-button 
                class="close-button"
                (click)="onClose()"
                type="button"
                aria-label="Fechar modal">
                <mat-icon>close</mat-icon>
              </button>
            }
          </div>
          
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
          
          @if (showFooter) {
            <div class="modal-footer">
              <ng-content select="[slot=footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 16px;
    }
    
    .modal-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .modal-small {
      width: 100%;
      max-width: 400px;
    }
    
    .modal-medium {
      width: 100%;
      max-width: 600px;
    }
    
    .modal-large {
      width: 100%;
      max-width: 800px;
    }
    
    .modal-fullscreen {
      width: 95vw;
      height: 95vh;
      max-width: none;
      max-height: none;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      border-radius: 8px 8px 0 0;
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: #333;
    }
    
    .close-button {
      color: #666;
      margin-left: 16px;
    }
    
    .modal-body {
      padding: 24px;
      flex: 1;
      overflow-y: auto;
    }
    
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
      border-radius: 0 0 8px 8px;
    }
    
    @media (max-width: 768px) {
      .modal-overlay {
        padding: 8px;
      }
      
      .modal-container {
        width: 100%;
        max-width: none;
        margin: 0;
      }
      
      .modal-header {
        padding: 12px 16px;
      }
      
      .modal-body {
        padding: 16px;
      }
      
      .modal-footer {
        padding: 12px 16px;
      }
    }
  `]
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
