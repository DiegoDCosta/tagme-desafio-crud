/**
 * @fileoverview Componente genérico de diálogo de confirmação
 * @author AI Assistant
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Interface para dados do diálogo de confirmação
 * @interface ConfirmDialogData
 * @description Estrutura dos dados passados para o diálogo
 */
export interface ConfirmDialogData {
  /** Título do diálogo */
  title: string;
  /** Mensagem do diálogo */
  message: string;
  /** Texto do botão de confirmação */
  confirmText?: string;
  /** Texto do botão de cancelamento */
  cancelText?: string;
  /** Ícone a ser exibido */
  icon?: string;
  /** Tipo de diálogo (afeta a cor do botão) */
  type?: 'warn' | 'primary' | 'accent';
}

/**
 * Componente genérico para diálogos de confirmação
 * @class ConfirmDialogComponent
 * @description Componente reutilizável para confirmações de ações
 * @example
 * ```typescript
 * const dialogRef = this.dialog.open(ConfirmDialogComponent, {
 *   data: {
 *     title: 'Confirmar exclusão',
 *     message: 'Tem certeza que deseja excluir este item?',
 *     confirmText: 'Excluir',
 *     cancelText: 'Cancelar',
 *     icon: 'delete',
 *     type: 'warn'
 *   }
 * });
 * ```
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header">
        @if (data.icon) {
          <mat-icon [class]="'icon-' + (data.type || 'primary')">{{ data.icon }}</mat-icon>
        }
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>
      
      <div mat-dialog-actions class="dialog-actions">
        <button 
          mat-button 
          (click)="onCancel()"
          type="button">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          mat-raised-button 
          [color]="data.type || 'primary'"
          (click)="onConfirm()"
          type="button">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 300px;
      max-width: 500px;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
    
    .icon-primary {
      color: #673ab7;
    }
    
    .icon-accent {
      color: #e91e63;
    }
    
    .icon-warn {
      color: #f44336;
    }
    
    mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `]
})
export class ConfirmDialogComponent {
  /**
   * Construtor do componente
   * @param {MatDialogRef<ConfirmDialogComponent>} dialogRef - Referência do diálogo
   * @param {ConfirmDialogData} data - Dados do diálogo
   */
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  /**
   * Método chamado quando o usuário confirma a ação
   * @returns {void}
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Método chamado quando o usuário cancela a ação
   * @returns {void}
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
