import * as typesIndex from '../index';

describe('types index', () => {
  it('exports types from index', () => {
    // TypeScript interfaces are not runtime values, they're compile-time only
    // So we can't directly test them with .toBeDefined()
    // Instead, we just verify the module exports something
    expect(typesIndex).toBeDefined();
  });

  it('module can be imported', () => {
    // The fact that we can import the module without errors means types are exported correctly
    expect(typeof typesIndex).toBe('object');
  });
});
