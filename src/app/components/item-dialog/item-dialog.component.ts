/**
 * @fileoverview Componente de diálogo para visualizar detalhes de um item
 * @author AI Assistant
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Item } from '../../models/item.model';

/**
 * Componente de diálogo para visualizar detalhes completos de um item
 * @class ItemDialogComponent
 * @description Componente que exibe informações detalhadas de um item
 * em formato de diálogo modal
 * @example
 * ```typescript
 * const dialogRef = this.dialog.open(ItemDialogComponent, {
 *   width: '800px',
 *   data: item
 * });
 * ```
 */
@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class ItemDialogComponent {
  /**
   * Construtor do componente
   * @param {MatDialogRef<ItemDialogComponent>} dialogRef - Referência do diálogo
   * @param {Item} data - Dados do item a ser exibido
   */
  constructor(
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {}

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Conta o número de palavras em um texto
   * @param {string} text - Texto para contar palavras
   * @returns {number} Número de palavras
   */
  getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Gera tags baseadas no título e descrição
   * @returns {string[]} Array de tags
   */
  generateTags(): string[] {
    const commonWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'dos', 'das', 'para', 'por', 'em', 'com', 'e', 'ou'];
    const text = `${this.data.title} ${this.data.description}`.toLowerCase();
    const words = text.split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word))
      .filter(word => /^[a-záàâãéèêíïóôõöúûüç]+$/.test(word));
    
    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 5).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    );
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
   * Abre a imagem em uma nova aba
   * @returns {void}
   */
  openImageInNewTab(): void {
    window.open(this.data.imageUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Fecha o diálogo e emite evento para editar o item
   * @returns {void}
   */
  editItem(): void {
    this.dialogRef.close('edit');
  }
}
