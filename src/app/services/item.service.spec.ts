import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import 'zone.js';
import 'zone.js/testing';
import { CreateItemDto, Item, UpdateItemDto } from '../models/item.model';
import { ItemService } from './item.service';

describe('ItemService - CRUD Operations', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  const mockItems: Item[] = [
    {
      id: '1' as any,
      title: 'Item 1',
      description: 'Description 1',
      imageUrl: 'https://example.com/image1.jpg',
      createdAt: '2024-01-01T00:00:00.000Z' as any,
      updatedAt: '2024-01-01T00:00:00.000Z' as any
    },
    {
      id: '2' as any,
      title: 'Item 2',
      description: 'Description 2',
      imageUrl: 'https://example.com/image2.jpg',
      createdAt: '2024-01-02T00:00:00.000Z' as any,
      updatedAt: '2024-01-02T00:00:00.000Z' as any
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

  describe('CREATE - createItem', () => {
    it('should create a new item', () => {
      const newItemData: CreateItemDto = {
        title: 'New Item',
        description: 'New Description',
        imageUrl: 'https://example.com/new-image.jpg'
      };

      const createdItem: Item = {
        id: '3' as any,
        ...newItemData,
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any
      };

      service.createItem(newItemData).subscribe(item => {
        expect(item.title).toBe(newItemData.title);
        expect(item.description).toBe(newItemData.description);
        expect(item.imageUrl).toBe(newItemData.imageUrl);
        expect(item.id).toBe('3' as any);
        expect(item.createdAt).toBeDefined();
        expect(item.updatedAt).toBeDefined();
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.title).toBe(newItemData.title);
      expect(req.request.body.description).toBe(newItemData.description);
      expect(req.request.body.imageUrl).toBe(newItemData.imageUrl);
      expect(req.request.body.createdAt).toBeDefined();
      expect(req.request.body.updatedAt).toBeDefined();

      req.flush(createdItem);
    });

    it('should handle create error', () => {
      const newItemData: CreateItemDto = {
        title: 'New Item',
        description: 'New Description',
        imageUrl: 'https://example.com/new-image.jpg'
      };

      service.createItem(newItemData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Falha ao criar item');
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('READ - getAllItems', () => {
    it('should get all items', () => {
      service.getAllItems().subscribe(items => {
        expect(items).toEqual(mockItems);
        expect(items.length).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle get all items error', () => {
      service.getAllItems().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Falha ao carregar itens');
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/items');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('READ - getItemById', () => {
    it('should get item by id', () => {
      const itemId = '1' as any;
      const expectedItem = mockItems[0];

      service.getItemById(Number(itemId)).subscribe(item => {
        expect(item).toEqual(expectedItem);
        expect(item.id).toBe('1' as any);
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedItem);
    });

    it('should handle get item by id error', () => {
      const itemId = 999;

      service.getItemById(itemId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe(`Item com ID ${itemId} não encontrado`);
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('UPDATE - updateItem', () => {
    it('should update an existing item', () => {
      const itemId = '1' as any;
      const updateData: UpdateItemDto = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const updatedItem: Item = {
        ...mockItems[0],
        ...updateData,
        updatedAt: new Date().toISOString() as any
      };

      service.updateItem(Number(itemId), updateData).subscribe(item => {
        expect(item.title).toBe(updateData.title!);
        expect(item.description).toBe(updateData.description!);
        expect(item.id).toBe('1' as any);
        expect(item.updatedAt).toBeDefined();
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.title).toBe(updateData.title);
      expect(req.request.body.description).toBe(updateData.description);
      expect(req.request.body.updatedAt).toBeDefined();

      req.flush(updatedItem);
    });

    it('should handle update error', () => {
      const itemId = '1' as any;
      const updateData: UpdateItemDto = {
        title: 'Updated Title'
      };

      service.updateItem(Number(itemId), updateData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Falha ao atualizar item');
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('DELETE - deleteItem', () => {
    it('should delete an item', () => {
      const itemId = '1' as any;

      service.deleteItem(Number(itemId)).subscribe(() => {
        expect().nothing(); // Apenas verifica se a operação foi bem-sucedida
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle delete error', () => {
      const itemId = '1' as any;

      service.deleteItem(Number(itemId)).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Falha ao deletar item');
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/items/${itemId}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('CRUD Integration', () => {
    it('should perform complete CRUD cycle', () => {
      // 1. CREATE
      const newItemData: CreateItemDto = {
        title: 'Test Item',
        description: 'Test Description',
        imageUrl: 'https://example.com/test.jpg'
      };

      const createdItem: Item = {
        id: '3' as any,
        ...newItemData,
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any
      };

      service.createItem(newItemData).subscribe(item => {
        expect(item.id).toBe('3' as any);
        expect(item.title).toBe(newItemData.title);
      });

      const createReq = httpMock.expectOne('http://localhost:3000/items');
      expect(createReq.request.method).toBe('POST');
      createReq.flush(createdItem);

      // 2. READ
      service.getItemById(Number('3')).subscribe(item => {
        expect(item).toEqual(createdItem);
      });

      const readReq = httpMock.expectOne('http://localhost:3000/items/3');
      expect(readReq.request.method).toBe('GET');
      readReq.flush(createdItem);

      // 3. UPDATE
      const updateData: UpdateItemDto = {
        title: 'Updated Test Item'
      };

      const updatedItem: Item = {
        ...createdItem,
        ...updateData,
        updatedAt: new Date().toISOString() as any
      };

      service.updateItem(Number('3'), updateData).subscribe(item => {
        expect(item.title).toBe(updateData.title!);
      });

      const updateReq = httpMock.expectOne('http://localhost:3000/items/3');
      expect(updateReq.request.method).toBe('PUT');
      updateReq.flush(updatedItem);

      // 4. DELETE
      service.deleteItem(Number('3')).subscribe(() => {
        expect().nothing();
      });

      const deleteReq = httpMock.expectOne('http://localhost:3000/items/3');
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush({});
    });
  });
});
