import React from 'react';
import { Select, MultiSelect, Slider } from "@compass/shared-ui";
import { useListData } from 'react-stately';
import { useMemo } from 'react';
import { SearchFilters, SelectOption } from '../../../../shared/types';
import { formatAreaRange } from '../../../../shared/utils';

interface SearchFormProps {
  filters: SearchFilters;
  areaValue: [number, number];
  regions: SelectOption[];
  sectors: SelectOption[];
  isics: SelectOption[];
  cities: SelectOption[];
  onFiltersChange: (updates: Partial<SearchFilters>) => void;
  onAreaValueChange: (value: [number, number]) => void;
  onAreaChangeEnd: (values: number[]) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

export function SearchForm({
  filters,
  areaValue,
  regions,
  sectors,
  isics,
  cities,
  onFiltersChange,
  onAreaValueChange,
  onAreaChangeEnd,
  isLoading,
  t,
}: SearchFormProps) {
  // Initialize selected ISIC items for MultiSelect
  const selectedIsic = useListData({
    initialItems: useMemo(() => {
      return isics.filter(item => filters.isic.includes(item.id));
    }, [filters.isic, isics]),
  });

  const handleIsicItemInserted = (key: React.Key) => {
    const currentIsicIds = filters.isic || [];
    const newIsicIds = [...currentIsicIds, key as string];
    onFiltersChange({ isic: newIsicIds });
  };

  const handleIsicItemCleared = (key: React.Key) => {
    const currentIsicIds = filters.isic || [];
    const newIsicIds = currentIsicIds.filter(id => id !== key);
    onFiltersChange({ isic: newIsicIds });
  };

  const handleAreaChange = (vals: number[]) => {
    const [a, b] = vals as [number, number];
    const newValue: [number, number] = [Math.min(a, b), Math.max(a, b)];
    onAreaValueChange(newValue);
  };

  return (
    <>
      {/* First row of filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MultiSelect
          size="md"
          label={t('search.isic_code') || 'ISIC Code'}
          placeholder={t('search.select_isic') || 'Select ISIC Code'}
          selectedItems={selectedIsic}
          items={isics}
          popoverClassName="max-h-[320px]"
          onItemInserted={handleIsicItemInserted}
          onItemCleared={handleIsicItemCleared}
          className="font-medium text-sm leading-5 tracking-normal"
        >
          {(item) => (
            <MultiSelect.Item key={item.id} id={item.id} textValue={item.label}>
              {item.label}
            </MultiSelect.Item>
          )}
        </MultiSelect>

        <Select
          size="md"
          label={t('search.sector') || 'Sector'}
          placeholder={t('search.all_sectors') || 'All Sectors'}
          items={sectors}
          selectedKey={filters.sector || null}
          onSelectionChange={(key) => onFiltersChange({ sector: key as string })}
        >
          {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>

        <Select
          size="md"
          label={t('search.region') || 'Region'}
          placeholder={t('search.select_region') || 'Select Region'}
          items={regions}
          selectedKey={filters.region || null}
          onSelectionChange={(key) => onFiltersChange({ region: key as string })}
        >
          {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
      </div>

      {/* Second row of filters */}
      <div className="mt-4 grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        <Select
          size="md"
          label={t('search.location') || 'Location'}
          placeholder={t('search.select_city') || 'Select City'}
          items={cities}
          selectedKey={filters.location || null}
          onSelectionChange={(key) => onFiltersChange({ location: key as string })}
          isDisabled={!filters.region || isLoading}
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
              minValue={0}
              maxValue={25000}
              value={areaValue}
              onChange={handleAreaChange}
              onChangeEnd={onAreaChangeEnd}
              className="mx-2 flex-grow"
              formatOptions={{ style: 'decimal', maximumFractionDigits: 0 }}
            />
            <span className="text-xs text-quaternary ml-2">25000</span>
          </div>
          <div className="text-xs text-secondary text-center">
            {formatAreaRange(areaValue[0], areaValue[1])}
          </div>
        </div>

        {/* Placeholder for third column */}
        <div></div>
      </div>
    </>
  );
}