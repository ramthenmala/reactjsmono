import { useLanguage } from '../lib/i18n';

/**
 * Utility functions to handle multilingual API content
 * These functions help select the correct language-specific fields from API responses
 */

/**
 * Gets the localized field value based on current language
 * @param data - API object containing both English and Arabic fields
 * @param fieldName - Base field name (e.g., 'name', 'description')
 * @param currentLanguage - Current language code ('en' | 'ar')
 * @returns The localized field value or falls back to English
 */
export function getLocalizedField<T extends Record<string, any>>(
  data: T,
  fieldName: keyof T,
  currentLanguage: string
): string {
  if (currentLanguage === 'ar') {
    const arabicField = `arabic${capitalize(fieldName as string)}` as keyof T;
    return data[arabicField] || data[fieldName] || '';
  }
  return data[fieldName] || '';
}

/**
 * Hook to get localized field values from API data
 * @param data - API object containing both English and Arabic fields
 * @returns Function to get localized field values
 */
export function useLocalizedFields<T extends Record<string, any>>(data: T) {
  const { currentLanguage } = useLanguage();

  return (fieldName: keyof T): string =>
    getLocalizedField(data, fieldName, currentLanguage);
}

/**
 * Transforms API data object to use localized fields
 * @param data - API object with multilingual fields
 * @param fields - Array of field names to localize
 * @param currentLanguage - Current language code
 * @returns Transformed object with localized field values
 */
export function localizeApiData<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[],
  currentLanguage: string
): T {
  const localized = { ...data };

  fields.forEach(field => {
    localized[field] = getLocalizedField(
      data,
      field,
      currentLanguage
    ) as T[keyof T];
  });

  return localized;
}

/**
 * Transforms an array of API objects to use localized fields
 * @param dataArray - Array of API objects
 * @param fields - Array of field names to localize
 * @param currentLanguage - Current language code
 * @returns Array of transformed objects with localized field values
 */
export function localizeApiDataArray<T extends Record<string, any>>(
  dataArray: T[],
  fields: (keyof T)[],
  currentLanguage: string
): T[] {
  return dataArray.map(data => localizeApiData(data, fields, currentLanguage));
}

/**
 * Helper to capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Type-safe localized field getter for IndustrialCity
 */
export interface LocalizableIndustrialCity {
  name: string;
  arabicName?: string;
  description?: string;
  arabicDescription?: string;
  region?: string;
  arabicRegion?: string;
}

export function getLocalizedIndustrialCityField(
  city: LocalizableIndustrialCity,
  field: 'name' | 'description' | 'region',
  currentLanguage: string
): string {
  return getLocalizedField(city, field, currentLanguage);
}
