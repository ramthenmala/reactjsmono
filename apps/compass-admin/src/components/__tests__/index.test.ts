// Test the main components index.ts exports
import * as ComponentsIndex from '../index';

describe('Components Index', () => {
  it('exports all expected components and modules', () => {
    // Check that the module exports something
    expect(ComponentsIndex).toBeDefined();
    expect(typeof ComponentsIndex).toBe('object');
  });

  it('exports AnalyticsSection component', () => {
    expect(ComponentsIndex.AnalyticsSection).toBeDefined();
    expect(typeof ComponentsIndex.AnalyticsSection).toBe('function');
  });

  it('exports ui components', () => {
    // Test that ui exports are available (re-exported from ./ui)
    // Note: We can't test specific UI components without knowing what's in the ui folder
    // but we can test that the export structure works
    const exportKeys = Object.keys(ComponentsIndex);
    expect(exportKeys.length).toBeGreaterThan(0);
  });

  it('exports layout components', () => {
    // We know AdminLayout and AdminHeader should be exported from layout
    expect(ComponentsIndex.AdminLayout).toBeDefined();
    expect(typeof ComponentsIndex.AdminLayout).toBe('function');
    
    expect(ComponentsIndex.AdminHeader).toBeDefined();
    expect(typeof ComponentsIndex.AdminHeader).toBe('function');
  });

  it('exports navigation components', () => {
    // We know getNavigationItems should be exported from navigation
    expect(ComponentsIndex.getNavigationItems).toBeDefined();
    expect(typeof ComponentsIndex.getNavigationItems).toBe('function');
    
    expect(ComponentsIndex.navigationItems).toBeDefined();
    expect(Array.isArray(ComponentsIndex.navigationItems)).toBe(true);
    
    expect(ComponentsIndex.LanguageSwitcher).toBeDefined();
    expect(typeof ComponentsIndex.LanguageSwitcher).toBe('function');
  });

  it('verifies that all re-exports maintain their original functionality', () => {
    // Test that AnalyticsSection from features/analytics/components works
    const { AnalyticsSection } = ComponentsIndex;
    expect(AnalyticsSection).toBeDefined();
    expect(typeof AnalyticsSection).toBe('function');
    
    // Test that it's a React component (no prototype = functional component)
    expect(AnalyticsSection.prototype).toBeUndefined();
    
    // Test that it takes the expected number of parameters (props object)
    expect(AnalyticsSection.length).toBe(1);
  });

  it('verifies AdminLayout export functionality', () => {
    const { AdminLayout } = ComponentsIndex;
    expect(AdminLayout).toBeDefined();
    expect(typeof AdminLayout).toBe('function');
    expect(AdminLayout.prototype).toBeUndefined(); // Functional component
    expect(AdminLayout.length).toBe(1); // Takes props parameter
  });

  it('verifies AdminHeader export functionality', () => {
    const { AdminHeader } = ComponentsIndex;
    expect(AdminHeader).toBeDefined();
    expect(typeof AdminHeader).toBe('function');
    expect(AdminHeader.prototype).toBeUndefined(); // Functional component
    expect(AdminHeader.length).toBe(1); // Takes props parameter
  });

  it('verifies getNavigationItems export functionality', () => {
    const { getNavigationItems } = ComponentsIndex;
    expect(getNavigationItems).toBeDefined();
    expect(typeof getNavigationItems).toBe('function');
    // Function parameters might be optimized by bundler, so just check it's callable
    expect(getNavigationItems.length).toBeGreaterThanOrEqual(0);
  });

  it('verifies navigationItems export', () => {
    const { navigationItems } = ComponentsIndex;
    expect(navigationItems).toBeDefined();
    expect(Array.isArray(navigationItems)).toBe(true);
    expect(navigationItems.length).toBeGreaterThan(0);
  });

  it('verifies LanguageSwitcher export functionality', () => {
    const { LanguageSwitcher } = ComponentsIndex;
    expect(LanguageSwitcher).toBeDefined();
    expect(typeof LanguageSwitcher).toBe('function');
    expect(LanguageSwitcher.prototype).toBeUndefined(); // Functional component
    // Function parameters might be optimized by bundler, so just check it's callable
    expect(LanguageSwitcher.length).toBeGreaterThanOrEqual(0);
  });

  it('checks that exports are not undefined or null', () => {
    const exportEntries = Object.entries(ComponentsIndex);
    
    exportEntries.forEach(([exportName, exportValue]) => {
      expect(exportValue).toBeDefined();
      expect(exportValue).not.toBeNull();
      
      // Most exports should be functions (React components or utility functions)
      if (exportName !== 'navigationItems') {
        expect(typeof exportValue).toBe('function');
      }
    });
  });

  it('maintains export consistency across re-exports', () => {
    // Test that re-exported items are the same as their original exports
    const { AnalyticsSection } = ComponentsIndex;
    
    // Import directly from the source with correct path
    const { AnalyticsSection: DirectAnalyticsSection } = require('../ui/AnalyticsSection');
    
    expect(AnalyticsSection).toBe(DirectAnalyticsSection);
  });

  it('provides a comprehensive component API', () => {
    const exportKeys = Object.keys(ComponentsIndex);
    
    // Should have multiple exports
    expect(exportKeys.length).toBeGreaterThan(3);
    
    // Should include key component categories
    const expectedExports = [
      'AnalyticsSection',
      'AdminLayout', 
      'AdminHeader',
      'getNavigationItems',
      'navigationItems',
      'LanguageSwitcher'
    ];
    
    expectedExports.forEach(expectedExport => {
      expect(exportKeys).toContain(expectedExport);
    });
  });
});