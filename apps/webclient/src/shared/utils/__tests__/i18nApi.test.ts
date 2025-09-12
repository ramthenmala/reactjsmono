import { renderHook } from '@testing-library/react';
import {
  getLocalizedField,
  useLocalizedFields,
  localizeApiData,
  localizeApiDataArray,
  getLocalizedIndustrialCityField,
  LocalizableIndustrialCity,
} from '@/utils/i18nApi';

// Mock the i18n module
jest.mock('../../../i18n', () => ({
  useLanguage: jest.fn(),
}));

import { useLanguage } from 'i18n';

describe('i18nApi utilities', () => {
  const mockUseLanguage = useLanguage as jest.MockedFunction<
    typeof useLanguage
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      isRTL: false,
      direction: 'ltr',
      changeLanguage: jest.fn(),
      isLoading: false,
    });
  });

  describe('getLocalizedField', () => {
    const testData = {
      name: 'English Name',
      arabicName: 'اسم عربي',
      description: 'English Description',
      arabicDescription: 'وصف عربي',
      value: 100,
      arabicValue: 200,
    };

    it('should return English field for English language', () => {
      const result = getLocalizedField(testData, 'name', 'en');
      expect(result).toBe('English Name');
    });

    it('should return Arabic field for Arabic language', () => {
      const result = getLocalizedField(testData, 'name', 'ar');
      expect(result).toBe('اسم عربي');
    });

    it('should fallback to English field if Arabic field is missing', () => {
      const dataWithoutArabic = {
        name: 'English Name',
        description: 'English Description',
      };
      const result = getLocalizedField(dataWithoutArabic, 'name', 'ar');
      expect(result).toBe('English Name');
    });

    it('should return empty string if both fields are missing', () => {
      const emptyData = {};
      const result = getLocalizedField(emptyData, 'name', 'ar');
      expect(result).toBe('');
    });

    it('should handle numeric fields', () => {
      const result = getLocalizedField(testData, 'value', 'ar');
      expect(result).toBe(200);
    });

    it('should handle fields with different casing', () => {
      const result = getLocalizedField(testData, 'description', 'ar');
      expect(result).toBe('وصف عربي');
    });

    it('should return English field for unknown language', () => {
      const result = getLocalizedField(testData, 'name', 'fr');
      expect(result).toBe('English Name');
    });

    it('should handle null values', () => {
      const dataWithNull = {
        name: null,
        arabicName: 'اسم عربي',
      };
      const result = getLocalizedField(dataWithNull, 'name', 'en');
      expect(result).toBe('');
    });

    it('should handle undefined values', () => {
      const dataWithUndefined = {
        name: undefined,
        arabicName: 'اسم عربي',
      };
      const result = getLocalizedField(dataWithUndefined, 'name', 'en');
      expect(result).toBe('');
    });

    it('should handle empty string values', () => {
      const dataWithEmpty = {
        name: '',
        arabicName: 'اسم عربي',
      };
      const result = getLocalizedField(dataWithEmpty, 'name', 'en');
      expect(result).toBe('');
    });

    it('should handle false boolean values correctly', () => {
      const dataWithBoolean = {
        active: false,
        arabicActive: true,
      };
      const result = getLocalizedField(dataWithBoolean, 'active', 'en');
      // getLocalizedField returns empty string for falsy values
      expect(result).toBe('');
    });

    it('should handle zero values correctly', () => {
      const dataWithZero = {
        count: 0,
        arabicCount: 5,
      };
      const result = getLocalizedField(dataWithZero, 'count', 'en');
      // getLocalizedField returns empty string for falsy values (0)
      expect(result).toBe('');
    });
  });

  describe('useLocalizedFields', () => {
    const testData = {
      name: 'English Name',
      arabicName: 'اسم عربي',
      description: 'English Description',
      arabicDescription: 'وصف عربي',
    };

    it('should return function that gets localized fields using English', () => {
      const { result } = renderHook(() => useLocalizedFields(testData));
      
      expect(result.current('name')).toBe('English Name');
      expect(result.current('description')).toBe('English Description');
    });

    it('should return function that gets localized fields using Arabic', () => {
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ar',
        isRTL: true,
        direction: 'rtl',
        changeLanguage: jest.fn(),
        isLoading: false,
      });

      const { result } = renderHook(() => useLocalizedFields(testData));
      
      expect(result.current('name')).toBe('اسم عربي');
      expect(result.current('description')).toBe('وصف عربي');
    });

    it('should handle missing Arabic fields', () => {
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ar',
        isRTL: true,
        direction: 'rtl',
        changeLanguage: jest.fn(),
        isLoading: false,
      });

      const dataWithoutArabic = {
        name: 'English Only',
        description: 'English Description',
      };

      const { result } = renderHook(() => useLocalizedFields(dataWithoutArabic));
      
      expect(result.current('name')).toBe('English Only');
    });

    it('should handle empty data object', () => {
      const { result } = renderHook(() => useLocalizedFields({}));
      
      expect(result.current('anyField')).toBe('');
    });
  });

  describe('localizeApiData', () => {
    const testData = {
      id: 1,
      name: 'English Name',
      arabicName: 'اسم عربي',
      description: 'English Description',
      arabicDescription: 'وصف عربي',
      status: 'active',
    };

    it('should localize specified fields for English', () => {
      const result = localizeApiData(testData, ['name', 'description'], 'en');
      
      expect(result).toEqual({
        id: 1,
        name: 'English Name',
        arabicName: 'اسم عربي',
        description: 'English Description',
        arabicDescription: 'وصف عربي',
        status: 'active',
      });
    });

    it('should localize specified fields for Arabic', () => {
      const result = localizeApiData(testData, ['name', 'description'], 'ar');
      
      expect(result).toEqual({
        id: 1,
        name: 'اسم عربي',
        arabicName: 'اسم عربي',
        description: 'وصف عربي',
        arabicDescription: 'وصف عربي',
        status: 'active',
      });
    });

    it('should handle empty fields array', () => {
      const result = localizeApiData(testData, [], 'ar');
      
      expect(result).toEqual(testData);
    });

    it('should handle non-existent fields', () => {
      const result = localizeApiData(testData, ['nonExistent'], 'ar');
      
      expect(result).toEqual({
        ...testData,
        nonExistent: '',
      });
    });

    it('should preserve non-localized fields', () => {
      const result = localizeApiData(testData, ['name'], 'ar');
      
      expect(result.id).toBe(1);
      expect(result.status).toBe('active');
      expect(result.name).toBe('اسم عربي');
    });

    it('should create a new object (not mutate original)', () => {
      const result = localizeApiData(testData, ['name'], 'ar');
      
      expect(result).not.toBe(testData);
      expect(testData.name).toBe('English Name');
    });

    it('should handle null data fields', () => {
      const dataWithNull = {
        name: null,
        arabicName: 'اسم',
      };
      
      const result = localizeApiData(dataWithNull, ['name'], 'ar');
      expect(result.name).toBe('اسم');
    });

    it('should handle multiple field types', () => {
      const mixedData = {
        title: 'Title',
        arabicTitle: 'عنوان',
        count: 10,
        arabicCount: 20,
        active: true,
        arabicActive: false,
      };
      
      const result = localizeApiData(mixedData, ['title', 'count', 'active'], 'ar');
      
      expect(result.title).toBe('عنوان');
      expect(result.count).toBe(20);
      // False is falsy, so getLocalizedField returns the English value (true)
      expect(result.active).toBe(true);
    });
  });

  describe('localizeApiDataArray', () => {
    const testDataArray = [
      {
        id: 1,
        name: 'First',
        arabicName: 'الأول',
        description: 'First Description',
        arabicDescription: 'الوصف الأول',
      },
      {
        id: 2,
        name: 'Second',
        arabicName: 'الثاني',
        description: 'Second Description',
        arabicDescription: 'الوصف الثاني',
      },
      {
        id: 3,
        name: 'Third',
        arabicName: 'الثالث',
        description: 'Third Description',
        arabicDescription: 'الوصف الثالث',
      },
    ];

    it('should localize all items in array for English', () => {
      const result = localizeApiDataArray(testDataArray, ['name', 'description'], 'en');
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('First');
      expect(result[1].name).toBe('Second');
      expect(result[2].name).toBe('Third');
      expect(result[0].description).toBe('First Description');
    });

    it('should localize all items in array for Arabic', () => {
      const result = localizeApiDataArray(testDataArray, ['name', 'description'], 'ar');
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('الأول');
      expect(result[1].name).toBe('الثاني');
      expect(result[2].name).toBe('الثالث');
      expect(result[0].description).toBe('الوصف الأول');
    });

    it('should handle empty array', () => {
      const result = localizeApiDataArray([], ['name'], 'ar');
      
      expect(result).toEqual([]);
    });

    it('should handle array with single item', () => {
      const result = localizeApiDataArray([testDataArray[0]], ['name'], 'ar');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('الأول');
    });

    it('should preserve non-localized fields in all items', () => {
      const result = localizeApiDataArray(testDataArray, ['name'], 'ar');
      
      result.forEach((item, index) => {
        expect(item.id).toBe(testDataArray[index].id);
        expect(item.arabicDescription).toBe(testDataArray[index].arabicDescription);
      });
    });

    it('should handle items with missing Arabic fields', () => {
      const mixedArray = [
        { name: 'First', arabicName: 'الأول' },
        { name: 'Second' }, // Missing arabicName
        { name: 'Third', arabicName: 'الثالث' },
      ];
      
      const result = localizeApiDataArray(mixedArray, ['name'], 'ar');
      
      expect(result[0].name).toBe('الأول');
      expect(result[1].name).toBe('Second'); // Falls back to English
      expect(result[2].name).toBe('الثالث');
    });

    it('should create new array and objects (not mutate)', () => {
      const result = localizeApiDataArray(testDataArray, ['name'], 'ar');
      
      expect(result).not.toBe(testDataArray);
      expect(result[0]).not.toBe(testDataArray[0]);
      expect(testDataArray[0].name).toBe('First');
    });
  });

  describe('getLocalizedIndustrialCityField', () => {
    const cityData: LocalizableIndustrialCity = {
      name: 'Industrial City',
      arabicName: 'المدينة الصناعية',
      description: 'A modern industrial city',
      arabicDescription: 'مدينة صناعية حديثة',
      region: 'Eastern Region',
      arabicRegion: 'المنطقة الشرقية',
    };

    it('should get English name field', () => {
      const result = getLocalizedIndustrialCityField(cityData, 'name', 'en');
      expect(result).toBe('Industrial City');
    });

    it('should get Arabic name field', () => {
      const result = getLocalizedIndustrialCityField(cityData, 'name', 'ar');
      expect(result).toBe('المدينة الصناعية');
    });

    it('should get English description field', () => {
      const result = getLocalizedIndustrialCityField(cityData, 'description', 'en');
      expect(result).toBe('A modern industrial city');
    });

    it('should get Arabic description field', () => {
      const result = getLocalizedIndustrialCityField(cityData, 'description', 'ar');
      expect(result).toBe('مدينة صناعية حديثة');
    });

    it('should get English region field', () => {
      const result = getLocalizedIndustrialCityField(cityData, 'region', 'en');
      expect(result).toBe('Eastern Region');
    });

    it('should get Arabic region field', () => {
      const result = getLocalizedIndustrialCityField(cityData, 'region', 'ar');
      expect(result).toBe('المنطقة الشرقية');
    });

    it('should handle missing Arabic fields', () => {
      const cityWithoutArabic: LocalizableIndustrialCity = {
        name: 'City Name',
        description: 'City Description',
        region: 'City Region',
      };
      
      const result = getLocalizedIndustrialCityField(cityWithoutArabic, 'name', 'ar');
      expect(result).toBe('City Name');
    });

    it('should handle missing optional fields', () => {
      const minimalCity: LocalizableIndustrialCity = {
        name: 'Minimal City',
      };
      
      const result = getLocalizedIndustrialCityField(minimalCity, 'description', 'en');
      expect(result).toBe('');
    });

    it('should handle all optional Arabic fields', () => {
      const cityWithOptional: LocalizableIndustrialCity = {
        name: 'Test City',
        arabicName: 'مدينة اختبار',
        // No description or region fields
      };
      
      expect(getLocalizedIndustrialCityField(cityWithOptional, 'name', 'ar')).toBe('مدينة اختبار');
      expect(getLocalizedIndustrialCityField(cityWithOptional, 'description', 'ar')).toBe('');
      expect(getLocalizedIndustrialCityField(cityWithOptional, 'region', 'ar')).toBe('');
    });
  });

  describe('capitalize helper function (via getLocalizedField)', () => {
    it('should capitalize field names correctly', () => {
      const data = {
        name: 'English',
        arabicName: 'Arabic',
        someField: 'English Value',
        arabicSomeField: 'Arabic Value',
        anotherField: 'Another English',
        arabicAnotherField: 'Another Arabic',
      };

      // Test that field name capitalization works correctly
      expect(getLocalizedField(data, 'name', 'ar')).toBe('Arabic');
      expect(getLocalizedField(data, 'someField', 'ar')).toBe('Arabic Value');
      expect(getLocalizedField(data, 'anotherField', 'ar')).toBe('Another Arabic');
    });

    it('should handle single letter field names', () => {
      const data = {
        x: 'English X',
        arabicX: 'Arabic X',
      };

      expect(getLocalizedField(data, 'x', 'ar')).toBe('Arabic X');
    });

    it('should handle empty field names', () => {
      const data = {
        '': 'Empty English',
        'arabic': 'Empty Arabic',
      };

      expect(getLocalizedField(data, '', 'ar')).toBe('Empty Arabic');
    });
  });
});