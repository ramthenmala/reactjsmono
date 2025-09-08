// Navigation API service
import type { NavigationData } from '../types/navigation';

const API_URL = import.meta.env.VITE_NAVIGATION_API_URL || 'https://www.jsonkeeper.com/b/8SYIF';

let cachedNavigation: NavigationData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const navigationService = {
  async getNavigationData(): Promise<NavigationData> {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (cachedNavigation && (now - cacheTimestamp) < CACHE_DURATION) {
      return cachedNavigation;
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our interface
      const navigationData: NavigationData = {
        header: data.data?.header?.menu || [],
        footer: {
          footerContent: data.data?.footer?.footerContent || '',
          copyrightText: data.data?.footer?.copyrightText || '',
          quickLinks: data.data?.footer?.quickLinks || [],
          legalPages: data.data?.footer?.legalPages || [],
          socialLinks: data.data?.footer?.socialLinks || []
        }
      };

      // Cache the data
      cachedNavigation = navigationData;
      cacheTimestamp = now;

      return navigationData;
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      throw error; // Let the calling component handle the error
    }
  },

  clearCache(): void {
    cachedNavigation = null;
    cacheTimestamp = 0;
  }
};