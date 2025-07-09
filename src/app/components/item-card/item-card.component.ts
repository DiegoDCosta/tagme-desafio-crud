/**
 * @fileoverview Componente para exibir um item em formato de card
 * @author AI Assistant
 */

import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../models/item.model';
import { ItemFormComponent } from '../item-form/item-form.component';

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
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  /**
   * Injeção de dependências
   */
  private readonly dialog = inject(MatDialog);

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
   * Evento emitido quando o item é salvo após edição
   * @type {EventEmitter<void>}
   */
  @Output() itemSaved = new EventEmitter<void>();

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
   * Abre modal com formulário de edição
   * @returns {void}
   */
  onEdit(): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: this.item,
      disableClose: false // Permite fechar com ESC e clique fora
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.itemSaved.emit();
      }
    });
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
