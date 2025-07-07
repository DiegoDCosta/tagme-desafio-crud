/**
 * @fileoverview Componente para exibir um item em formato de card
 * @author AI Assistant
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Item } from '../../models/item.model';

/**
 * Componente para exibir um item em formato de card
 * @class ItemCardComponent
 * @description Componente reutilizável para exibir informações de um item
 * em formato de card com ações disponíveis
 * @example
 * ```html
 * <app-item-card
 *   [item]="item"
 *   [showActions]="true"
 *   (edit)="onEditItem($event)"
 *   (delete)="onDeleteItem($event)"
 *   (view)="onViewItem($event)">
 * </app-item-card>
 * ```
 */
@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-card class="item-card" [class.loading]="isLoading">
      <div class="card-header">
        <mat-card-header>
          <mat-card-title>{{ item.title }}</mat-card-title>
          <mat-card-subtitle>
            @if (item.createdAt) {
              Criado em {{ formatDate(item.createdAt) }}
            }
          </mat-card-subtitle>
        </mat-card-header>
        
        @if (showActions) {
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="menu"
            aria-label="Ações do item">
            <mat-icon>more_vert</mat-icon>
          </button>
          
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onView()">
              <mat-icon>visibility</mat-icon>
              <span>Visualizar</span>
            </button>
            <button mat-menu-item (click)="onEdit()">
              <mat-icon>edit</mat-icon>
              <span>Editar</span>
            </button>
            <button mat-menu-item (click)="onDelete()" class="delete-action">
              <mat-icon>delete</mat-icon>
              <span>Excluir</span>
            </button>
          </mat-menu>
        }
      </div>

      <div class="card-image" (click)="onView()">
        <img 
          [src]="item.imageUrl" 
          [alt]="item.title"
          (error)="onImageError($event)"
          loading="lazy">
      </div>

      <mat-card-content>
        <p class="item-description">{{ item.description }}</p>
        
        @if (item.updatedAt && item.updatedAt !== item.createdAt) {
          <p class="last-updated">
            Atualizado em {{ formatDate(item.updatedAt) }}
          </p>
        }
      </mat-card-content>

      @if (showActions) {
        <mat-card-actions class="card-actions">
          <button 
            mat-button 
            color="primary" 
            (click)="onView()">
            <mat-icon>visibility</mat-icon>
            Ver Detalhes
          </button>
          <button 
            mat-button 
            color="accent" 
            (click)="onEdit()">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: [`
    .item-card {
      max-width: 400px;
      margin: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .item-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .item-card.loading {
      opacity: 0.7;
      pointer-events: none;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 16px 0;
    }

    .card-header mat-card-header {
      flex: 1;
      padding: 0;
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .card-image:hover {
      transform: scale(1.05);
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .item-description {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      margin: 12px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .last-updated {
      font-size: 12px;
      color: #999;
      margin: 8px 0 0;
      font-style: italic;
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px 16px;
    }

    .card-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .delete-action {
      color: #f44336;
    }

    .delete-action mat-icon {
      color: #f44336;
    }

    mat-card-title {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    mat-card-subtitle {
      font-size: 12px;
      color: #666;
    }

    @media (max-width: 768px) {
      .item-card {
        margin: 8px;
        max-width: none;
      }
      
      .card-image {
        height: 150px;
      }
    }
  `]
})
export class ItemCardComponent {
  /**
   * Item a ser exibido no card
   * @type {Item}
   */
  @Input({ required: true }) item!: Item;

  /**
   * Controla se as ações devem ser exibidas
   * @type {boolean}
   * @default true
   */
  @Input() showActions: boolean = true;

  /**
   * Controla se o card está em estado de carregamento
   * @type {boolean}
   * @default false
   */
  @Input() isLoading: boolean = false;

  /**
   * Evento emitido quando o usuário clica para visualizar o item
   * @type {EventEmitter<Item>}
   */
  @Output() view = new EventEmitter<Item>();

  /**
   * Evento emitido quando o usuário clica para editar o item
   * @type {EventEmitter<Item>}
   */
  @Output() edit = new EventEmitter<Item>();

  /**
   * Evento emitido quando o usuário clica para excluir o item
   * @type {EventEmitter<Item>}
   */
  @Output() delete = new EventEmitter<Item>();

  /**
   * Manipula o evento de visualização do item
   * @returns {void}
   */
  onView(): void {
    this.view.emit(this.item);
  }

  /**
   * Manipula o evento de edição do item
   * @returns {void}
   */
  onEdit(): void {
    this.edit.emit(this.item);
  }

  /**
   * Manipula o evento de exclusão do item
   * @returns {void}
   */
  onDelete(): void {
    this.delete.emit(this.item);
  }

  /**
   * Manipula erros de carregamento de imagem
   * Substitui por placeholder do serviço placehold.co em caso de erro
   * @param {Event} event - Evento de erro da imagem
   * @returns {void}
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x200?text=Imagem+não+encontrada';
  }

  /**
   * Formata uma data para exibição
   * @param {Date | string} date - Data a ser formatada
   * @returns {string} Data formatada
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
