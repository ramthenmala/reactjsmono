import { useState, useEffect, useCallback } from 'react';
import { SelectOption, AreaRange } from '../types/search';
import { searchService } from '../services/searchService';
import { AreaService } from '../services/areaService';

interface UseSearchDataReturn {
  regions: SelectOption[];
  sectors: SelectOption[];
  isics: SelectOption[];
  cities: SelectOption[];
  areaRange: AreaRange;
  isLoading: boolean;
  loadCities: (regionId: string) => Promise<void>;
}

export function useSearchData(): UseSearchDataReturn {
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [sectors, setSectors] = useState<SelectOption[]>([]);
  const [isics, setIsics] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [areaRange, setAreaRange] = useState<AreaRange>({ min: 0, max: 25000 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [regionsData, sectorsData, isicsData, areaRangeData] = await Promise.all([
          searchService.getRegions(),
          searchService.getSectors(),
          searchService.getIsicCodes(),
          AreaService.fetchAreaRange(),
        ]);
        
        setRegions(regionsData);
        setSectors(sectorsData);
        setIsics(isicsData);
        setAreaRange(areaRangeData);
      } catch (error) {
        console.error('Failed to load search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadCities = useCallback(async (regionId: string) => {
    if (!regionId || regionId === 'all') {
      setCities([]);
      return;
    }

    try {
      setIsLoading(true);
      const citiesData = await searchService.getCitiesByRegion(regionId);
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    regions,
    sectors,
    isics,
    cities,
    areaRange,
    isLoading,
    loadCities,
  };
}