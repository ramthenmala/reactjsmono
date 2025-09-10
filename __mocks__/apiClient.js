// Mock API client for Jest testing
// This avoids import.meta.env issues in Jest environment

export async function apiFetch(endpoint, options = {}) {
  // Mock implementation for testing
  return Promise.resolve({
    data: 'mock-data',
    status: 'success',
  });
}