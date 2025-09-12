import { useState, useEffect, useCallback } from 'react';
import { filterOptionsService } from '../services';
import { IAreaRange, ICity, IIsicCode, IRegion, ISector } from '../types';
import { useCurrentLocale } from '../lib';

interface UseSearchDataReturn {
  isics: IIsicCode[];
  sectors: ISector[];
  regions: IRegion[];
  cities: ICity[];
  areaRange: IAreaRange;
  isLoading: boolean;
  loadCities: (regionId: string) => Promise<void>;
}

export function useSearchData(): UseSearchDataReturn {
  const [isics, setIsics] = useState<IIsicCode[]>([]);
  const [sectors, setSectors] = useState<ISector[]>([]);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [areaRange, setAreaRange] = useState<IAreaRange>({ min: 0, max: 25000 });
  const [isLoading, setIsLoading] = useState(false);
  const currentLocale = useCurrentLocale();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [isicsData, sectorsData, regionsData , areaRangeData] =
          await Promise.all([
            filterOptionsService.getFilterData(currentLocale, 'isicCode'),
            filterOptionsService.getFilterData(currentLocale, 'sector'),
            filterOptionsService.getFilterData(currentLocale, 'region'),
            filterOptionsService.getFilterData(currentLocale, 'area'),
          ]);

        setRegions(regionsData.regions ?? []);
        setSectors(sectorsData.sectors ?? []);
        setIsics(isicsData.isicCodes ?? []);
        setAreaRange(areaRangeData.areaRange ?? { min: 0, max: 25000 });
      } catch (error) {
        console.error('Failed to load search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [currentLocale]);

  const loadCities = useCallback(async (regionId: string) => {
    if (!regionId || regionId === 'all') {
      setCities([]);
      return;
    }

    try {
      setIsLoading(true);
      const citiesData = await filterOptionsService.getFilterData(currentLocale, 'city', regionId);
      setCities(citiesData.cities ?? []);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentLocale]);

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
