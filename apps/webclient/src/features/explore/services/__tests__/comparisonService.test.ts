import { ComparisonService } from '../comparisonService';
import { IProperty } from '../../types/explore';

// Mock console methods - note that jest.setup.js already overrides console
const consoleSpy = {
  error: jest.fn(),
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test data
const mockProperty1: IProperty = {
  id: 'prop-1',
  slug: 'property-1',
  city: 'Riyadh',
  title: 'Industrial Property 1',
  area: 5000,
  image: '/images/prop1.jpg',
  status: 'available',
  electricity: 'Available',
  water: 'Available',
  gas: 'Not Available',
  featured: true,
  coordinates: { lat: 24.7136, lng: 46.6753 },
};

const mockProperty2: IProperty = {
  id: 'prop-2',
  slug: 'property-2',
  city: 'Jeddah',
  title: 'Industrial Property 2',
  area: 3000,
  image: '/images/prop2.jpg',
  status: 'available',
};

const mockProperty3: IProperty = {
  id: 'prop-3',
  slug: 'property-3',
  city: 'Dammam',
  title: 'Industrial Property 3',
  area: 7000,
  image: '/images/prop3.jpg',
  status: 'available',
};

const mockProperty4: IProperty = {
  id: 'prop-4',
  slug: 'property-4',
  city: 'Mecca',
  title: 'Industrial Property 4',
  area: 2000,
  image: '/images/prop4.jpg',
  status: 'available',
};

const mockProperty5: IProperty = {
  id: 'prop-5',
  slug: 'property-5',
  city: 'Medina',
  title: 'Industrial Property 5',
  area: 4000,
  image: '/images/prop5.jpg',
  status: 'available',
};

describe('ComparisonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.error.mockClear();
    // Mock console.error to capture calls
    console.error = consoleSpy.error;
  });

  describe('getComparisonList', () => {
    it('should return empty array when no items in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = ComparisonService.getComparisonList();

      expect(result).toEqual([]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('compass_property_comparison');
    });

    it('should return parsed properties from localStorage', () => {
      const storedProperties = [mockProperty1, mockProperty2];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedProperties));

      const result = ComparisonService.getComparisonList();

      expect(result).toEqual(storedProperties);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('compass_property_comparison');
    });

    it('should return empty array when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      const result = ComparisonService.getComparisonList();

      expect(result).toEqual([]);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error loading comparison properties:',
        expect.any(Error)
      );
    });

    it('should return empty array when localStorage contains invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const result = ComparisonService.getComparisonList();

      expect(result).toEqual([]);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error loading comparison properties:',
        expect.any(Error)
      );
    });
  });

  describe('addToComparison', () => {
    it('should successfully add property to empty comparison list', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = ComparisonService.addToComparison(mockProperty1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property added to comparison');
      expect(result.properties).toEqual([mockProperty1]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'compass_property_comparison',
        JSON.stringify([mockProperty1])
      );
    });

    it('should successfully add property to existing comparison list', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1]));

      const result = ComparisonService.addToComparison(mockProperty2);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property added to comparison');
      expect(result.properties).toEqual([mockProperty1, mockProperty2]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'compass_property_comparison',
        JSON.stringify([mockProperty1, mockProperty2])
      );
    });

    it('should fail to add property that already exists in comparison', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1]));

      const result = ComparisonService.addToComparison(mockProperty1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Property already in comparison list');
      expect(result.properties).toEqual([mockProperty1]);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should fail to add property when maximum limit reached (4 properties)', () => {
      const maxProperties = [mockProperty1, mockProperty2, mockProperty3, mockProperty4];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(maxProperties));

      const result = ComparisonService.addToComparison(mockProperty5);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Maximum 4 properties can be compared');
      expect(result.properties).toEqual(maxProperties);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle localStorage save error gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = ComparisonService.addToComparison(mockProperty1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property added to comparison');
      expect(result.properties).toEqual([mockProperty1]);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error saving comparison properties:',
        expect.any(Error)
      );
    });

    it('should identify property by id for duplicate check', () => {
      const duplicateProperty = { ...mockProperty1, title: 'Different Title' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1]));

      const result = ComparisonService.addToComparison(duplicateProperty);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Property already in comparison list');
      expect(result.properties).toEqual([mockProperty1]);
    });
  });

  describe('removeFromComparison', () => {
    it('should successfully remove property from comparison list', () => {
      const storedProperties = [mockProperty1, mockProperty2, mockProperty3];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedProperties));

      const result = ComparisonService.removeFromComparison('prop-2');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property removed from comparison');
      expect(result.properties).toEqual([mockProperty1, mockProperty3]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'compass_property_comparison',
        JSON.stringify([mockProperty1, mockProperty3])
      );
    });

    it('should handle removal of non-existent property gracefully', () => {
      const storedProperties = [mockProperty1, mockProperty2];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedProperties));

      const result = ComparisonService.removeFromComparison('non-existent-id');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property removed from comparison');
      expect(result.properties).toEqual(storedProperties);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'compass_property_comparison',
        JSON.stringify(storedProperties)
      );
    });

    it('should remove property from empty list gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = ComparisonService.removeFromComparison('prop-1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property removed from comparison');
      expect(result.properties).toEqual([]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'compass_property_comparison',
        JSON.stringify([])
      );
    });

    it('should handle localStorage save error during removal', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1, mockProperty2]));
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = ComparisonService.removeFromComparison('prop-1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property removed from comparison');
      expect(result.properties).toEqual([mockProperty2]);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error saving comparison properties:',
        expect.any(Error)
      );
    });
  });

  describe('clearComparison', () => {
    it('should remove comparison data from localStorage', () => {
      ComparisonService.clearComparison();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('compass_property_comparison');
    });
  });

  describe('isInComparison', () => {
    it('should return true when property is in comparison list', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1, mockProperty2]));

      const result = ComparisonService.isInComparison('prop-1');

      expect(result).toBe(true);
    });

    it('should return false when property is not in comparison list', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1, mockProperty2]));

      const result = ComparisonService.isInComparison('prop-3');

      expect(result).toBe(false);
    });

    it('should return false when comparison list is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = ComparisonService.isInComparison('prop-1');

      expect(result).toBe(false);
    });

    it('should return false when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = ComparisonService.isInComparison('prop-1');

      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('getComparisonCount', () => {
    it('should return correct count for stored properties', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1, mockProperty2, mockProperty3]));

      const result = ComparisonService.getComparisonCount();

      expect(result).toBe(3);
    });

    it('should return 0 for empty comparison list', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = ComparisonService.getComparisonCount();

      expect(result).toBe(0);
    });

    it('should return 0 when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = ComparisonService.getComparisonCount();

      expect(result).toBe(0);
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('edge cases and integration scenarios', () => {
    it('should handle malformed localStorage data', () => {
      mockLocalStorage.getItem.mockReturnValue('{"invalid": "structure"}');

      const count = ComparisonService.getComparisonCount();
      const list = ComparisonService.getComparisonList();
      const inComparison = ComparisonService.isInComparison('prop-1');

      expect(count).toBe(0);
      expect(list).toEqual([]);
      expect(inComparison).toBe(false);
      // No console errors because malformed structure is handled gracefully
      expect(consoleSpy.error).toHaveBeenCalledTimes(0);
    });

    it('should handle localStorage quota exceeded scenario', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

      const result = ComparisonService.addToComparison(mockProperty1);

      expect(result.success).toBe(true);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error saving comparison properties:',
        expect.any(DOMException)
      );
    });

    it('should maintain comparison list integrity across operations', () => {
      // Start with empty list
      mockLocalStorage.getItem.mockReturnValue(null);

      // Add first property
      mockLocalStorage.getItem.mockReturnValue(null);
      ComparisonService.addToComparison(mockProperty1);

      // Simulate localStorage now having the property
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1]));

      // Check it's in comparison
      expect(ComparisonService.isInComparison('prop-1')).toBe(true);
      expect(ComparisonService.getComparisonCount()).toBe(1);

      // Add second property
      const result = ComparisonService.addToComparison(mockProperty2);
      expect(result.properties).toHaveLength(2);

      // Remove first property
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProperty1, mockProperty2]));
      const removeResult = ComparisonService.removeFromComparison('prop-1');
      expect(removeResult.properties).toEqual([mockProperty2]);
    });
  });

  describe('constants validation', () => {
    it('should respect MAX_COMPARISON_ITEMS constant', () => {
      // Fill comparison list to maximum
      const maxProperties = [mockProperty1, mockProperty2, mockProperty3, mockProperty4];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(maxProperties));

      // Try to add one more
      const result = ComparisonService.addToComparison(mockProperty5);

      expect(result.success).toBe(false);
      expect(result.message).toContain('4 properties');
    });

    it('should use consistent COMPARISON_KEY for localStorage operations', () => {
      const expectedKey = 'compass_property_comparison';

      // Test all methods that use localStorage
      ComparisonService.getComparisonList();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(expectedKey);

      ComparisonService.clearComparison();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(expectedKey);
    });
  });
});