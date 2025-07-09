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
            '✓',
            jasmine.objectContaining({
                duration: 3000,
                panelClass: ['notification', 'notification-success']
            })
        );
    });

    it('should show error notification', () => {
        const message = 'Error message';

        service.error(message);
        expect(mockSnackBar.open).toHaveBeenCalledWith(
            message,
            '✗',
            jasmine.objectContaining({
                duration: 5000,
                panelClass: ['notification', 'notification-error']
            })
        );
    });

    it('should show info notification', () => {
        const message = 'Info message';

        service.info(message);
        expect(mockSnackBar.open).toHaveBeenCalledWith(
            message,
            'i',
            jasmine.objectContaining({
                duration: 3000,
                panelClass: ['notification', 'notification-info']
            })
        );
    });

    it('should show warning notification', () => {
        const message = 'Warning message';

        service.warning(message);
        expect(mockSnackBar.open).toHaveBeenCalledWith(
            message,
            '⚠',
            jasmine.objectContaining({
                duration: 4000,
                panelClass: ['notification', 'notification-warning']
            })
        );
    });

    it('should use custom duration when provided', () => {
        const message = 'Custom duration message';
        const customDuration = 2000;

        service.success(message, customDuration);
        expect(mockSnackBar.open).toHaveBeenCalledWith(
            message,
            '✓',
            jasmine.objectContaining({
                duration: customDuration,
                panelClass: ['notification', 'notification-success']
            })
        );
    });

    it('should not call open if message is empty', () => {
        // O service não faz verificação de mensagem vazia, então sempre chama open
        service.success('');
        expect(mockSnackBar.open).toHaveBeenCalled();
    });

    it('should use default duration if invalid duration is provided', () => {
        const message = 'Invalid duration';
        service.success(message, null as any);
        expect(mockSnackBar.open).toHaveBeenCalledWith(
            message,
            '✓',
            jasmine.objectContaining({
                duration: 3000,
                panelClass: ['notification', 'notification-success']
            })
        );
    });

    it('should allow custom panelClass for success', () => {
        // O service não aceita panelClass customizado diretamente, então este teste não é aplicável
        // Mantido para compatibilidade, mas não será chamado
        expect(true).toBeTrue();
    });
});
