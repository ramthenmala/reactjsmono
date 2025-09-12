import * as hooksIndex from '../index';

describe('hooks index', () => {
  it('exports useScrollSpy hook', () => {
    expect(hooksIndex.useScrollSpy).toBeDefined();
    expect(typeof hooksIndex.useScrollSpy).toBe('function');
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(hooksIndex);
    expect(exports).toHaveLength(1);
  });
});
