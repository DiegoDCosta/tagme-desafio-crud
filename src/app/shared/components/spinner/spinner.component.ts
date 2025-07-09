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
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
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
