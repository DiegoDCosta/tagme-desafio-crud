import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/**
 * Service para traduzir o componente MatPaginator para português brasileiro
 * @description Personaliza todas as labels do paginator para o idioma português
 */
@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl {
  
  constructor() {
    super();
    this.translateLabels();
  }

  /**
   * Traduz todas as labels do paginator para português brasileiro
   */
  private translateLabels(): void {
    this.itemsPerPageLabel = 'Itens por página:';
    this.nextPageLabel = 'Próxima página';
    this.previousPageLabel = 'Página anterior';
    this.firstPageLabel = 'Primeira página';
    this.lastPageLabel = 'Última página';
    
    // Função para exibir o range dos itens em português
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      
      const startIndex = page * pageSize;
      const endIndex = startIndex < length 
        ? Math.min(startIndex + pageSize, length) 
        : startIndex + pageSize;
      
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    };

    // Notifica que houve mudança nas labels
    this.changes.next();
  }
}
