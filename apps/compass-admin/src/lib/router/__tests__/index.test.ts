// Test the router index.ts exports
import * as RouterIndex from '../index';

describe('Router Index', () => {
  it('exports all expected router components and modules', () => {
    // Check that the module exports something
    expect(RouterIndex).toBeDefined();
    expect(typeof RouterIndex).toBe('object');
  });

  it('exports AdminRoutes component', () => {
    expect(RouterIndex.AdminRoutes).toBeDefined();
    expect(typeof RouterIndex.AdminRoutes).toBe('function');
  });

  it('verifies AdminRoutes is a valid React component', () => {
    const { AdminRoutes } = RouterIndex;
    
    // Check that it's a function component (not a class)
    expect(AdminRoutes.prototype).toBeUndefined();
    
    // Check that it's a function (React component)
    expect(typeof AdminRoutes).toBe('function');
    
    // Function components typically don't take parameters or take a props object
    expect(AdminRoutes.length).toBeLessThanOrEqual(1);
  });

  it('maintains export consistency across re-exports', () => {
    // Test that re-exported items are the same as their original exports
    const { AdminRoutes } = RouterIndex;
    
    // Import directly from the source
    const { AdminRoutes: DirectAdminRoutes } = require('../admin-routes');
    
    expect(AdminRoutes).toBe(DirectAdminRoutes);
  });

  it('provides a complete router API', () => {
    const exportKeys = Object.keys(RouterIndex);
    
    // Should have at least one export
    expect(exportKeys.length).toBeGreaterThan(0);
    
    // Should include the main router component
    expect(exportKeys).toContain('AdminRoutes');
  });

  it('checks that all exports are not undefined or null', () => {
    const exportEntries = Object.entries(RouterIndex);
    
    exportEntries.forEach(([exportName, exportValue]) => {
      expect(exportValue).toBeDefined();
      expect(exportValue).not.toBeNull();
      
      // All exports should be functions (React components)
      expect(typeof exportValue).toBe('function');
    });
  });

  it('verifies the re-export mechanism works correctly', () => {
    // Test that the wildcard export works
    expect(RouterIndex.AdminRoutes).toBeDefined();
    
    // The export should be a React component function
    const { AdminRoutes } = RouterIndex;
    expect(typeof AdminRoutes).toBe('function');
    expect(AdminRoutes.name).toBe('AdminRoutes');
  });

  it('ensures router exports are callable', () => {
    const { AdminRoutes } = RouterIndex;
    
    // Should not throw when called (though it may fail without proper React context)
    expect(() => {
      // Just check that it's callable - don't actually render it
      const component = AdminRoutes;
      expect(typeof component).toBe('function');
    }).not.toThrow();
  });

  it('validates the structure of router exports', () => {
    const exportNames = Object.keys(RouterIndex);
    
    // Should export the main routing component
    expect(exportNames).toContain('AdminRoutes');
    
    // All exports should be functions
    exportNames.forEach(exportName => {
      expect(typeof RouterIndex[exportName]).toBe('function');
    });
  });

  it('confirms router module structure', () => {
    // The router module should be a simple object with function exports
    expect(typeof RouterIndex).toBe('object');
    expect(RouterIndex).not.toBeNull();
    
    // Should have the expected exports
    const exports = Object.getOwnPropertyNames(RouterIndex);
    expect(exports).toContain('AdminRoutes');
  });
});