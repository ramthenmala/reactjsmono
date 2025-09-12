import * as utilsIndex from '../index';
import * as unitsModule from '../units';

describe('explore utils index', () => {
  it('should export all utilities from units module', () => {
    expect(utilsIndex.unitLabel).toBe(unitsModule.unitLabel);
    expect(utilsIndex.formatMeasure).toBe(unitsModule.formatMeasure);
  });

  it('should export EUnit type from units module', () => {
    // Type exports can't be directly tested, but we can check that the module structure is correct
    expect(typeof utilsIndex.unitLabel).toBe('function');
    expect(typeof utilsIndex.formatMeasure).toBe('function');
  });

  it('should maintain proper module structure', () => {
    const exportedKeys = Object.keys(utilsIndex);
    const expectedExports = ['unitLabel', 'formatMeasure'];
    
    expectedExports.forEach(exportName => {
      expect(exportedKeys).toContain(exportName);
    });
  });

  it('should re-export functions with same functionality', () => {
    // Test that re-exported functions work the same as original
    const testValue = 100;
    const testUnit = 'MW' as any;
    
    expect(utilsIndex.formatMeasure(testValue, testUnit))
      .toBe(unitsModule.formatMeasure(testValue, testUnit));
    
    expect(utilsIndex.unitLabel(testUnit))
      .toBe(unitsModule.unitLabel(testUnit));
  });
});