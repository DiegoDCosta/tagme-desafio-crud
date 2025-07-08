import { TestBed } from '@angular/core/testing';
import { PaginatorIntlService } from './paginator-intl.service';

describe('PaginatorIntlService', () => {
  let service: PaginatorIntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginatorIntlService]
    });
    service = TestBed.inject(PaginatorIntlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have Portuguese labels', () => {
    expect(service.itemsPerPageLabel).toBe('Itens por página:');
    expect(service.nextPageLabel).toBe('Próxima página');
    expect(service.previousPageLabel).toBe('Página anterior');
    expect(service.firstPageLabel).toBe('Primeira página');
    expect(service.lastPageLabel).toBe('Última página');
  });

  describe('getRangeLabel', () => {
    it('should return correct range for first page', () => {
      const result = service.getRangeLabel(0, 10, 50);
      expect(result).toBe('1 – 10 de 50');
    });

    it('should return correct range for middle page', () => {
      const result = service.getRangeLabel(2, 10, 50);
      expect(result).toBe('21 – 30 de 50');
    });

    it('should return correct range for last page with fewer items', () => {
      const result = service.getRangeLabel(2, 10, 25);
      expect(result).toBe('21 – 25 de 25');
    });

    it('should return correct range when no items', () => {
      const result = service.getRangeLabel(0, 10, 0);
      expect(result).toBe('0 de 0');
    });

    it('should return correct range when pageSize is 0', () => {
      const result = service.getRangeLabel(0, 0, 50);
      expect(result).toBe('0 de 50');
    });

    it('should return correct range for single item', () => {
      const result = service.getRangeLabel(0, 10, 1);
      expect(result).toBe('1 – 1 de 1');
    });

    it('should return correct range when page would exceed total', () => {
      const result = service.getRangeLabel(1, 10, 5);
      expect(result).toBe('11 – 15 de 5');
    });
  });

  it('should emit changes when labels are translated', () => {
    let changeEmitted = false;
    service.changes.subscribe(() => {
      changeEmitted = true;
    });

    // Create a new instance to trigger the translation
    const newService = new PaginatorIntlService();
    
    expect(changeEmitted).toBe(true);
  });
});
