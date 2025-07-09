/**
 * @fileoverview Service para notificações e feedback ao usuário
 * @author AI Assistant
 */

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Tipos de notificação disponíveis
 * @enum {string}
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Configuração customizada para notificações
 * @interface NotificationConfig
 */
export interface NotificationConfig extends MatSnackBarConfig {
  /** Tipo da notificação */
  type?: NotificationType;
  /** Texto do botão de ação */
  actionText?: string;
  /** Duração personalizada em milissegundos */
  duration?: number;
}

/**
 * Service responsável por exibir notificações ao usuário
 * @class NotificationService
 * @description Fornece métodos para exibir diferentes tipos de notificações
 * usando o MatSnackBar do Angular Material
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * Configurações padrão para notificações
   * @private
   * @readonly
   */
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    panelClass: []
  };

  /**
   * Construtor do service
   * @param {MatSnackBar} snackBar - Service do Material Design para snackbar
   */
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Exibe uma notificação genérica
   * @param {string} message - Mensagem a ser exibida
   * @param {NotificationConfig} config - Configurações da notificação
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.show('Mensagem personalizada', {
   *   type: NotificationType.INFO,
   *   actionText: 'Fechar',
   *   duration: 5000
   * });
   * ```
   */
  show(message: string, config: NotificationConfig = {}): void {
    const snackBarConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: this.getPanelClass(config.type)
    };

    this.snackBar.open(message, config.actionText || 'Fechar', snackBarConfig);
  }

  /**
   * Exibe uma notificação de sucesso
   * @param {string} message - Mensagem de sucesso
   * @param {number} duration - Duração em milissegundos (opcional)
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.success('Item criado com sucesso!');
   * ```
   */
  success(message: string, duration?: number): void {
    this.show(message, {
      type: NotificationType.SUCCESS,
      duration: duration || 3000,
      actionText: '✓'
    });
  }

  /**
   * Exibe uma notificação de erro
   * @param {string} message - Mensagem de erro
   * @param {number} duration - Duração em milissegundos (opcional)
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.error('Erro ao salvar item!');
   * ```
   */
  error(message: string, duration?: number): void {
    this.show(message, {
      type: NotificationType.ERROR,
      duration: duration || 5000,
      actionText: '✗'
    });
  }

  /**
   * Exibe uma notificação de aviso
   * @param {string} message - Mensagem de aviso
   * @param {number} duration - Duração em milissegundos (opcional)
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.warning('Alguns campos são obrigatórios!');
   * ```
   */
  warning(message: string, duration?: number): void {
    this.show(message, {
      type: NotificationType.WARNING,
      duration: duration || 4000,
      actionText: '⚠'
    });
  }

  /**
   * Exibe uma notificação informativa
   * @param {string} message - Mensagem informativa
   * @param {number} duration - Duração em milissegundos (opcional)
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.info('Carregando dados...');
   * ```
   */
  info(message: string, duration?: number): void {
    this.show(message, {
      type: NotificationType.INFO,
      duration: duration || 3000,
      actionText: 'i'
    });
  }

  /**
   * Exibe uma notificação de confirmação com ação
   * @param {string} message - Mensagem da confirmação
   * @param {string} actionText - Texto do botão de ação
   * @param {() => void} actionCallback - Callback executado ao clicar na ação
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.confirm(
   *   'Alterações salvas',
   *   'Desfazer',
   *   () => this.undoChanges()
   * );
   * ```
   */
  confirm(message: string, actionText: string, actionCallback: () => void): void {
    const snackBarRef = this.snackBar.open(message, actionText, {
      ...this.defaultConfig,
      duration: 6000,
      panelClass: ['notification-confirm']
    });

    snackBarRef.onAction().subscribe(() => {
      actionCallback();
    });
  }

  /**
   * Fecha todas as notificações abertas
   * @returns {void}
   * @example
   * ```typescript
   * this.notificationService.dismiss();
   * ```
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }

  /**
   * Obtém as classes CSS para o tipo de notificação
   * @private
   * @param {NotificationType} type - Tipo da notificação
   * @returns {string[]} Array de classes CSS
   */
  private getPanelClass(type?: NotificationType): string[] {
    const baseClasses = ['notification'];
    
    if (type) {
      baseClasses.push(`notification-${type}`);
    }
    
    return baseClasses;
  }
}
