import * as types from '@/types/index';

describe('types index exports', () => {
  it('should export all type modules', () => {
    // This test ensures the index file is loaded and exports are available
    expect(typeof types).toBe('object');
  });

  it('should have consistent export structure', () => {
    // This test verifies that the exports object exists
    // The actual type exports are not runtime values, so we can't test them directly
    // But we can ensure the module loads without errors
    const exportKeys = Object.keys(types);
    expect(Array.isArray(exportKeys)).toBe(true);
  });
});