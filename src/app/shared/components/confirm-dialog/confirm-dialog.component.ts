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
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
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
