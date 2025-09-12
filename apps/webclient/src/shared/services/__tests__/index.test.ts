import * as services from '@/services/index';
import { searchService } from '@/services/searchService';
import { filterOptionsService } from '@/services/filterOptionsService';
import { layoutService } from '@/services/layoutService';

describe('services index exports', () => {
  it('should export searchService', () => {
    expect(services.searchService).toBeDefined();
    expect(services.searchService).toBe(searchService);
    expect(typeof services.searchService.buildSearchUrl).toBe('function');
  });

  it('should export filterOptionsService', () => {
    expect(services.filterOptionsService).toBeDefined();
    expect(services.filterOptionsService).toBe(filterOptionsService);
    expect(typeof services.filterOptionsService.getFilterData).toBe('function');
  });

  it('should export layoutService', () => {
    expect(services.layoutService).toBeDefined();
    expect(services.layoutService).toBe(layoutService);
    expect(typeof services.layoutService.getLayoutData).toBe('function');
  });

  it('should only export expected services', () => {
    const expectedExports = ['searchService', 'filterOptionsService', 'layoutService'];
    const actualExports = Object.keys(services);
    
    expect(actualExports.sort()).toEqual(expectedExports.sort());
  });

  it('should export services with correct structure', () => {
    // Verify searchService structure
    expect(services.searchService).toHaveProperty('buildSearchUrl');
    expect(typeof services.searchService.buildSearchUrl).toBe('function');

    // Verify filterOptionsService structure
    expect(services.filterOptionsService).toHaveProperty('getFilterData');
    expect(typeof services.filterOptionsService.getFilterData).toBe('function');

    // Verify layoutService structure
    expect(services.layoutService).toHaveProperty('getLayoutData');
    expect(typeof services.layoutService.getLayoutData).toBe('function');
  });
});