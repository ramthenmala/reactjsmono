import { IProperty } from '../types/explore';

const COMPARISON_KEY = 'compass_property_comparison';
const MAX_COMPARISON_ITEMS = 4;

export class ComparisonService {
  private static getStoredProperties(): IProperty[] {
    try {
      const stored = localStorage.getItem(COMPARISON_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading comparison properties:', error);
      return [];
    }
  }

  private static saveProperties(properties: IProperty[]): void {
    try {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(properties));
    } catch (error) {
      console.error('Error saving comparison properties:', error);
    }
  }

  static getComparisonList(): IProperty[] {
    return this.getStoredProperties();
  }

  static addToComparison(property: IProperty): {
    success: boolean;
    message: string;
    properties: IProperty[];
  } {
    const currentList = this.getStoredProperties();

    // Check if already in comparison
    if (currentList.some(p => p.id === property.id)) {
      return {
        success: false,
        message: 'Property already in comparison list',
        properties: currentList,
      };
    }

    // Check max limit
    if (currentList.length >= MAX_COMPARISON_ITEMS) {
      return {
        success: false,
        message: `Maximum ${MAX_COMPARISON_ITEMS} properties can be compared`,
        properties: currentList,
      };
    }

    const newList = [...currentList, property];
    this.saveProperties(newList);

    return {
      success: true,
      message: 'Property added to comparison',
      properties: newList,
    };
  }

  static removeFromComparison(propertyId: string): {
    success: boolean;
    message: string;
    properties: IProperty[];
  } {
    const currentList = this.getStoredProperties();
    const newList = currentList.filter(p => p.id !== propertyId);

    this.saveProperties(newList);

    return {
      success: true,
      message: 'Property removed from comparison',
      properties: newList,
    };
  }

  static clearComparison(): void {
    localStorage.removeItem(COMPARISON_KEY);
  }

  static isInComparison(propertyId: string): boolean {
    return this.getStoredProperties().some(p => p.id === propertyId);
  }

  static getComparisonCount(): number {
    return this.getStoredProperties().length;
  }
}
