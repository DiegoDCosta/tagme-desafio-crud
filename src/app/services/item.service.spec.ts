import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { Item, CreateItemDto, UpdateItemDto, ItemFilter, PaginationOptions } from '../models/item.model';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  const mockItems: Item[] = [
    {
      id: 1,
      title: 'Item 1',
      description: 'Description 1',
      imageUrl: 'https://example.com/image1.jpg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      title: 'Item 2',
      description: 'Description 2',
      imageUrl: 'https://example.com/image2.jpg',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllItems', () => {
    it('should return all items', () => {
      service.getAllItems().subscribe(items => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle error when fetching items', () => {
      service.getAllItems().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getItemsWithFilters', () => {
    const filters: ItemFilter = {
      search: 'Item',
      sortBy: 'updatedAt',
      sortDirection: 'desc'
    };

    const pagination: PaginationOptions = {
      page: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0
    };

    it('should return filtered items without search', () => {
      const filtersWithoutSearch: ItemFilter = {
        sortBy: 'updatedAt',
        sortDirection: 'desc'
      };

      service.getItemsWithFilters(filtersWithoutSearch, pagination).subscribe(response => {
        expect(response.data).toEqual(mockItems);
        expect(response.total).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should return filtered items with search', () => {
      service.getItemsWithFilters(filters, pagination).subscribe(response => {
        expect(response.data).toEqual(mockItems);
        expect(response.total).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should sort items by updatedAt desc', () => {
      const unsortedItems = [...mockItems].reverse();
      
      service.getItemsWithFilters(filters, pagination).subscribe(response => {
        expect(response.data[0].updatedAt).toEqual(new Date('2024-01-02'));
        expect(response.data[1].updatedAt).toEqual(new Date('2024-01-01'));
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      req.flush(unsortedItems);
    });
  });

  describe('getItemById', () => {
    it('should return item by id', () => {
      const itemId = 1;
      const expectedItem = mockItems[0];

      service.getItemById(itemId).subscribe(item => {
        expect(item).toEqual(expectedItem);
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedItem);
    });

    it('should handle error when item not found', () => {
      const itemId = 999;

      service.getItemById(itemId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createItem', () => {
    it('should create new item', () => {
      const newItemData: CreateItemDto = {
        title: 'New Item',
        description: 'New Description',
        imageUrl: 'https://example.com/new-image.jpg'
      };

      const createdItem: Item = {
        id: 3,
        ...newItemData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.createItem(newItemData).subscribe(item => {
        expect(item.title).toBe(newItemData.title);
        expect(item.description).toBe(newItemData.description);
        expect(item.imageUrl).toBe(newItemData.imageUrl);
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.title).toBe(newItemData.title);
      req.flush(createdItem);
    });
  });

  describe('updateItem', () => {
    it('should update existing item', () => {
      const itemId = 1;
      const updateData: UpdateItemDto = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const updatedItem: Item = {
        ...mockItems[0],
        ...updateData,
        updatedAt: new Date()
      };

      service.updateItem(itemId, updateData).subscribe(item => {
        expect(item.title).toBe(updateData.title!);
        expect(item.description).toBe(updateData.description!);
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.title).toBe(updateData.title);
      req.flush(updatedItem);
    });
  });

  describe('deleteItem', () => {
    it('should delete item', () => {
      const itemId = 1;

      service.deleteItem(itemId).subscribe(() => {
        expect().nothing();
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('utility methods', () => {
    it('should set selected item', () => {
      const item = mockItems[0];
      service.setSelectedItem(item);
      
      service.selectedItem$.subscribe(selectedItem => {
        expect(selectedItem).toBe(item);
      });
    });

    it('should clear selected item', () => {
      service.clearSelectedItem();
      
      service.selectedItem$.subscribe(selectedItem => {
        expect(selectedItem).toBeNull();
      });
    });

    it('should return current items', () => {
      const items = service.getCurrentItems();
      expect(Array.isArray(items)).toBeTruthy();
    });

    it('should return current selected item', () => {
      const selectedItem = service.getCurrentSelectedItem();
      expect(selectedItem).toBeNull();
    });
  });
});
