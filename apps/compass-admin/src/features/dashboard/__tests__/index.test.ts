import * as dashboardIndex from '../index';
import { DashboardPage } from '../dashboard';

describe('dashboard index', () => {
  it('exports DashboardPage', () => {
    expect(dashboardIndex.DashboardPage).toBeDefined();
    expect(typeof dashboardIndex.DashboardPage).toBe('function');
  });

  it('exports match the dashboard module exports', () => {
    expect(dashboardIndex.DashboardPage).toBe(DashboardPage);
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(dashboardIndex);
    expect(exports).toHaveLength(1);
  });
});
