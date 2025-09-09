import * as usersIndex from '../index';
import { UsersPage } from '../users';
import { ConnectRequestsPage } from '../connect-requests';

describe('users index', () => {
  it('exports UsersPage', () => {
    expect(usersIndex.UsersPage).toBeDefined();
    expect(typeof usersIndex.UsersPage).toBe('function');
  });

  it('exports ConnectRequestsPage', () => {
    expect(usersIndex.ConnectRequestsPage).toBeDefined();
    expect(typeof usersIndex.ConnectRequestsPage).toBe('function');
  });

  it('exports match the users module exports', () => {
    expect(usersIndex.UsersPage).toBe(UsersPage);
    expect(usersIndex.ConnectRequestsPage).toBe(ConnectRequestsPage);
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(usersIndex);
    expect(exports).toHaveLength(2);
  });
});
