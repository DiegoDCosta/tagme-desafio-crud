import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset document body class
    document.body.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.getCurrentTheme()).toBe(false);
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    
    // Create new service instance to trigger initialization
    const newService = new ThemeService();
    
    expect(newService.getCurrentTheme()).toBe(true);
  });

  it('should toggle theme from light to dark', () => {
    expect(service.getCurrentTheme()).toBe(false);
    
    service.toggleTheme();
    
    expect(service.getCurrentTheme()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  it('should toggle theme from dark to light', () => {
    // Set to dark first
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe(true);
    
    // Toggle back to light
    service.toggleTheme();
    
    expect(service.getCurrentTheme()).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('should set dark theme', () => {
    service.setTheme(true);
    
    expect(service.getCurrentTheme()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  it('should set light theme', () => {
    // Set to dark first
    service.setTheme(true);
    expect(service.getCurrentTheme()).toBe(true);
    
    // Set to light
    service.setTheme(false);
    
    expect(service.getCurrentTheme()).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('should emit theme changes', () => {
    let emittedTheme: boolean | undefined;
    
    service.isDarkTheme$.subscribe(isDark => {
      emittedTheme = isDark;
    });
    
    service.toggleTheme();
    
    expect(emittedTheme).toBe(true);
  });

  it('should handle invalid localStorage value', () => {
    localStorage.setItem('theme', 'invalid');
    
    // Create new service instance
    const newService = new ThemeService();
    
    // Should default to light theme
    expect(newService.getCurrentTheme()).toBe(false);
  });

  it('should handle localStorage not being available', () => {
    // Mock localStorage to throw error
    const originalLocalStorage = window.localStorage;
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jasmine.createSpy('getItem').and.throwError('localStorage not available'),
        setItem: jasmine.createSpy('setItem').and.throwError('localStorage not available')
      },
      writable: true
    });
    
    expect(() => {
      const newService = new ThemeService();
      newService.toggleTheme();
    }).not.toThrow();
    
    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should apply theme class to document body', () => {
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    
    service.setTheme(true);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    
    service.setTheme(false);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });
});
