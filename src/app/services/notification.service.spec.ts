import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success notification', () => {
    const message = 'Success message';
    
    service.success(message);
    
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: 3000,
        panelClass: ['success-snackbar']
      })
    );
  });

  it('should show error notification', () => {
    const message = 'Error message';
    
    service.error(message);
    
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: 5000,
        panelClass: ['error-snackbar']
      })
    );
  });

  it('should show info notification', () => {
    const message = 'Info message';
    
    service.info(message);
    
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: 4000,
        panelClass: ['info-snackbar']
      })
    );
  });

  it('should show warning notification', () => {
    const message = 'Warning message';
    
    service.warning(message);
    
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: 4000,
        panelClass: ['warning-snackbar']
      })
    );
  });

  it('should use custom duration when provided', () => {
    const message = 'Custom duration message';
    const customDuration = 2000;
    
    service.success(message, customDuration);
    
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: customDuration,
        panelClass: ['success-snackbar']
      })
    );
  });
});
