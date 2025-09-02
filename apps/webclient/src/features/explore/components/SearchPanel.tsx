import { Button, Select, MultiSelect, Slider } from "@compass/shared-ui";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { useCurrentLocale } from '../../../shared/lib/router';
import { useListData } from 'react-stately';

interface SearchFilters {
  isic: string[];
  sector: string;
  region: string;
  location: string;
  minArea: number;
  maxArea: number;
}

interface SearchPanelProps {
  onSearch?: (searchParams?: SearchFilters) => void;
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();
  const navigate = useNavigate();

  // Basic state management (simplified for now)
  const [filters, setFilters] = useState<SearchFilters>({
    isic: [] as string[],
    sector: '',
    region: '',
    location: '',
    minArea: 0,
    maxArea: 25000,
  });

  const [regions, setRegions] = useState<Array<{ id: string; label: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: string; label: string }>>([]);
  const [sectors, setSectors] = useState<Array<{ id: string; label: string }>>([]);
  const [isics, setIsics] = useState<Array<{ id: string; label: string }>>([]);
  const [areaRange] = useState<{ min: number; max: number }>({ min: 0, max: 25000 });
  const [areaValue, setAreaValue] = useState<[number, number]>([0, 25000]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selected ISIC items for MultiSelect
  const selectedIsic = useListData({
    initialItems: useMemo(() => {
      return isics.filter(item => filters.isic.includes(item.id));
    }, [filters.isic, isics]),
  });

  // Sample data for now (will be replaced with API calls)
  useEffect(() => {
    // Simulate API loading
    setRegions([
      { id: 'riyadh', label: 'Riyadh Region' },
      { id: 'eastern', label: 'Eastern Province' },
      { id: 'western', label: 'Western Province' },
      { id: 'southern', label: 'Southern Region' },
    ]);

    setSectors([
      { id: 'manufacturing', label: 'Manufacturing' },
      { id: 'logistics', label: 'Logistics & Storage' },
      { id: 'petrochemicals', label: 'Petrochemicals' },
      { id: 'food', label: 'Food Processing' },
    ]);

    setIsics([
      { id: '101234', label: '101234' },
      { id: '101345', label: '101345' },
      { id: '222100', label: '222100' },
      { id: '471900', label: '471900' },
      { id: '620100', label: '620100' },
    ]);
  }, [currentLocale]);

  // Load cities when region changes
  useEffect(() => {
    if (filters.region && filters.region !== 'all') {
      // Simulate city loading based on region
      const cityMap: Record<string, Array<{ id: string; label: string }>> = {
        riyadh: [
          { id: 'riyadh-city', label: 'Riyadh City' },
          { id: 'industrial-city-1', label: 'Industrial City 1' },
        ],
        eastern: [
          { id: 'dammam', label: 'Dammam' },
          { id: 'jubail', label: 'Jubail' },
        ],
        western: [
          { id: 'jeddah', label: 'Jeddah' },
          { id: 'yanbu', label: 'Yanbu' },
        ],
      };
      setCities(cityMap[filters.region] || []);
    } else {
      setCities([]);
    }
  }, [filters.region]);

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      isic: [],
      sector: '',
      region: '',
      location: '',
      minArea: 0,
      maxArea: 25000,
    });
    setAreaValue([0, 25000]);
    selectedIsic.setSelectedKeys(new Set());
  }, [selectedIsic]);

  const handleSearchClick = useCallback(() => {
    if (onSearch) {
      onSearch(filters);
      return;
    }

    setIsLoading(true);
    
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        if (value.length) qs.set(key, value.join(','));
      } else {
        qs.set(key, String(value));
      }
    });

    const queryString = qs.toString();
    const listingUrl = queryString
      ? `/${currentLocale}/explore/listing?${queryString}`
      : `/${currentLocale}/explore/listing`;

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(listingUrl);
    }, 500);
  }, [onSearch, filters, currentLocale, navigate]);

  return (
    <section className="relative z-10 -mt-32 mx-auto w-full max-w-7xl px-4">
      <div className="relative rounded-2xl border border-white/30 bg-gradient-to-r from-white/10 to-white/5 p-6 shadow-[0px_4px_8px_-2px_#1018281A,0_2px_4px_-2px_#1018280F] backdrop-blur-[15px] overflow-hidden">
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content with relative positioning */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MultiSelect
              size="md"
              label={t('search.isic_code') || 'ISIC Code'}
              placeholder={t('search.select_isic') || 'Select ISIC Code'}
              selectedItems={selectedIsic}
              items={isics}
              popoverClassName="max-h-[320px]"
              onItemInserted={(key) => {
                const currentIsicIds = filters.isic || [];
                const newIsicIds = [...currentIsicIds, key as string];
                updateFilters({ isic: newIsicIds });
              }}
              onItemCleared={(key) => {
                const currentIsicIds = filters.isic || [];
                const newIsicIds = currentIsicIds.filter(id => id !== key);
                updateFilters({ isic: newIsicIds });
              }}
              className="font-medium text-sm leading-5 tracking-normal"
            >
              {(item) => <MultiSelect.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</MultiSelect.Item>}
            </MultiSelect>

            <Select
              size="md"
              label={t('search.sector') || 'Sector'}
              placeholder={t('search.all_sectors') || 'All Sectors'}
              items={sectors}
              selectedKey={filters.sector || null}
              onSelectionChange={(key) => updateFilters({ sector: key as string })}
            >
              {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>

            <Select
              size="md"
              label={t('search.region') || 'Region'}
              placeholder={t('search.select_region') || 'Select Region'}
              items={regions}
              selectedKey={filters.region || null}
              onSelectionChange={(key) => updateFilters({ region: key as string })}
            >
              {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
          </div>

          <div className="mt-4 grid grid-cols-1 items-center gap-3 md:grid-cols-3">
            <Select
              size="md"
              label={t('search.location') || 'Location'}
              placeholder={t('search.select_city') || 'Select City'}
              items={cities}
              selectedKey={filters.location || null}
              onSelectionChange={(key) => updateFilters({ location: key as string })}
              isDisabled={!filters.region}
            >
              {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>

            <div className="flex flex-col gap-2 md:pl-2">
              <label className="text-sm font-medium text-secondary">
                {t('search.land_area') || 'Land Area'}
              </label>
              <div className="flex items-center">
                <span className="text-xs text-quaternary mr-2">0</span>
                <Slider
                  aria-label="Land area"
                  minValue={areaRange.min || 0}
                  maxValue={areaRange.max || 25000}
                  value={areaValue}
                  onChange={(vals) => {
                    const [a, b] = vals as [number, number];
                    const newValue: [number, number] = [Math.min(a, b), Math.max(a, b)];
                    setAreaValue(newValue);
                  }}
                  onChangeEnd={(vals) => {
                    const [a, b] = vals as [number, number];
                    const newValue: [number, number] = [Math.min(a, b), Math.max(a, b)];
                    updateFilters({ minArea: Math.round(newValue[0]), maxArea: Math.round(newValue[1]) });
                  }}
                  className="mx-2 flex-grow"
                  formatOptions={{ style: 'decimal', maximumFractionDigits: 0 }}
                />
                <span className="text-xs text-quaternary ml-2">25000</span>
              </div>
              <div className="text-xs text-secondary text-center">
                {areaValue[0].toLocaleString()} - {areaValue[1].toLocaleString()} m²
              </div>
            </div>

            {/* Placeholder for third column */}
            <div></div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              size="lg"
              color="secondary"
              className="min-w-32"
              onClick={clearFilters}
              disabled={isLoading}
            >
              {t('common.clear') || 'Clear'}
            </Button>
            <Button
              size="lg"
              color="primary"
              className="h-12 rounded-xl px-[18px] text-white font-semibold text-base leading-6 tracking-normal shadow-sm transition bg-[linear-gradient(90deg,#5547B5_0%,#695DC2_100%)] hover:brightness-105 active:brightness-95"
              onClick={handleSearchClick}
              disabled={isLoading}
            >
              {isLoading ? (t('common.searching') || 'Searching...') : (t('navigation.explore') || 'Search')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}