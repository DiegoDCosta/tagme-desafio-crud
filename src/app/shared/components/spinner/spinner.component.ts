/**
 * @fileoverview Componente genérico de carregamento (spinner)
 * @author AI Assistant
 */

import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Componente genérico para exibir indicador de carregamento
 * @class SpinnerComponent
 * @description Componente reutilizável para mostrar estados de carregamento
 * @example
 * ```html
 * <app-spinner [size]="50" [message]="'Carregando dados...'" />
 * ```
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner-container">
      <mat-spinner [diameter]="size" [color]="color"></mat-spinner>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .spinner-message {
      margin-top: 16px;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  `]
})
export class SpinnerComponent {
  /**
   * Tamanho do spinner em pixels
   * @type {number}
   * @default 40
   */
  @Input() size: number = 40;

  /**
   * Cor do spinner
   * @type {'primary' | 'accent' | 'warn'}
   * @default 'primary'
   */
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  /**
   * Mensagem opcional para exibir abaixo do spinner
   * @type {string}
   */
  @Input() message?: string;
}
