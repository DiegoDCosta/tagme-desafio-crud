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
  template: `
    <div class="item-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>{{ data.title }}</h2>
        <button 
          mat-icon-button 
          mat-dialog-close
          aria-label="Fechar diálogo">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div mat-dialog-content class="dialog-content">
        <!-- Imagem Principal -->
        <div class="image-container">
          <img 
            [src]="data.imageUrl" 
            [alt]="data.title"
            class="item-image"
            (error)="onImageError($event)">
        </div>

        <!-- Informações do Item -->
        <div class="item-info">
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>Informações Gerais</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <div class="info-row">
                <span class="info-label">
                  <mat-icon>label</mat-icon>
                  ID:
                </span>
                <span class="info-value">{{ data.id }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">
                  <mat-icon>title</mat-icon>
                  Título:
                </span>
                <span class="info-value">{{ data.title }}</span>
              </div>

              <div class="info-row description-row">
                <span class="info-label">
                  <mat-icon>description</mat-icon>
                  Descrição:
                </span>
                <span class="info-value">{{ data.description }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">
                  <mat-icon>image</mat-icon>
                  URL da Imagem:
                </span>
                <span class="info-value image-url">
                  <a [href]="data.imageUrl" target="_blank" rel="noopener">
                    {{ data.imageUrl }}
                    <mat-icon>open_in_new</mat-icon>
                  </a>
                </span>
              </div>

              @if (data.createdAt) {
                <div class="info-row">
                  <span class="info-label">
                    <mat-icon>event</mat-icon>
                    Criado em:
                  </span>
                  <span class="info-value">
                    {{ formatDate(data.createdAt) }}
                  </span>
                </div>
              }

              @if (data.updatedAt && data.updatedAt !== data.createdAt) {
                <div class="info-row">
                  <span class="info-label">
                    <mat-icon>update</mat-icon>
                    Atualizado em:
                  </span>
                  <span class="info-value">
                    {{ formatDate(data.updatedAt) }}
                  </span>
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Estatísticas -->
          <mat-card class="stats-card">
            <mat-card-header>
              <mat-card-title>Estatísticas</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <div class="stats-container">
                <div class="stat-item">
                  <mat-icon>text_fields</mat-icon>
                  <span class="stat-value">{{ data.title.length }}</span>
                  <span class="stat-label">Chars no Título</span>
                </div>
                
                <div class="stat-item">
                  <mat-icon>article</mat-icon>
                  <span class="stat-value">{{ data.description.length }}</span>
                  <span class="stat-label">Chars na Descrição</span>
                </div>
                
                <div class="stat-item">
                  <mat-icon>word_count</mat-icon>
                  <span class="stat-value">{{ getWordCount(data.description) }}</span>
                  <span class="stat-label">Palavras</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Tags/Categorias (simuladas) -->
          <mat-card class="tags-card">
            <mat-card-header>
              <mat-card-title>Tags</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <div class="tags-container">
                @for (tag of generateTags(); track tag) {
                  <mat-chip-set>
                    <mat-chip>{{ tag }}</mat-chip>
                  </mat-chip-set>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button 
          mat-button 
          mat-dialog-close
          color="primary">
          <mat-icon>close</mat-icon>
          Fechar
        </button>
        
        <button 
          mat-raised-button 
          color="accent"
          (click)="openImageInNewTab()">
          <mat-icon>open_in_new</mat-icon>
          Ver Imagem
        </button>
        
        <button 
          mat-raised-button 
          color="primary"
          (click)="editItem()">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .item-dialog {
      max-width: 900px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .dialog-content {
      padding: 24px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .image-container {
      text-align: center;
      margin-bottom: 24px;
    }

    .item-image {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      object-fit: cover;
    }

    .item-info {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .info-card,
    .stats-card,
    .tags-card {
      background: white;
      border: 1px solid #e0e0e0;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      gap: 12px;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #555;
      min-width: 140px;
      flex-shrink: 0;
    }

    .info-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .info-value {
      flex: 1;
      color: #333;
      word-break: break-word;
    }

    .description-row {
      align-items: flex-start;
    }

    .description-row .info-value {
      line-height: 1.6;
      text-align: justify;
    }

    .image-url a {
      color: #673ab7;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .image-url a:hover {
      text-decoration: underline;
    }

    .image-url mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }

    .stat-item mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #673ab7;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tags-container mat-chip {
      background: #e3f2fd;
      color: #1976d2;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .dialog-content {
        padding: 16px;
      }
      
      .item-info {
        grid-template-columns: 1fr;
      }
      
      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .info-label {
        min-width: auto;
      }
      
      .stats-container {
        grid-template-columns: 1fr;
      }
      
      .dialog-actions {
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .dialog-actions button {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
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
   * @param {Event} event - Evento de erro
   * @returns {void}
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300?text=Imagem+não+encontrada';
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
