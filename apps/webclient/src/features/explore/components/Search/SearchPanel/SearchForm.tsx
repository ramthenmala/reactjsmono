import React from 'react';
import { Select, MultiSelect, Slider, Button } from '@compass/shared-ui';
import { useListData } from 'react-stately';
import { ICity, IIsicCode, IRegion, ISector, SelectOption } from '@/shared/types';
import type { SearchFormProps } from '../../types/searchForm';

export function SearchForm({
  isics,
  sectors,
  regions,
  filters,
  areaValue,
  areaRange,
  cities,
  onFiltersChange,
  onAreaValueChange,
  onAreaChangeEnd,
  isLoading,
  t,
  onSearch,
  onClear,
  isSearching = false,
  'data-qa-id': dataQaId = 'search-form',
}: SearchFormProps) {

  const isicOptions: SelectOption[] = isics
    .map((isic: IIsicCode) => ({
      id: isic.id.toString(),
      label: isic.code.toString(),
      value: isic.id.toString(),
    }))
    .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));

  const regionOptions: SelectOption[] = regions
    .map((region: IRegion) => ({
      id: region.id,
      label: region.name,
      value: region.id,
    }))
    .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));

  const sectorOptions: SelectOption[] = sectors
    .map((sector: ISector) => ({
      id: sector.id,
      label: sector.name,
      value: sector.id,
    }))
    .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));

  const cityOptions: SelectOption[] = cities
    .map((city: ICity) => ({
      id: city.id,
      label: city.name,
      value: city.id,
    }))
    .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label));

  // Limit available items when user has reached maximum selections
  const availableItems = React.useMemo(() => {
    const selectedIds = new Set(filters.isic || []);

    // If user has 5 or more selections, only show already selected items
    if (selectedIds.size >= 5) {
      return isicOptions.filter(item => selectedIds.has(item.id));
    }

    // Otherwise show all items
    return isicOptions;
  }, [isicOptions, filters.isic]);

  // Initialize selected ISIC items for MultiSelect
  const selectedIsic = useListData<SelectOption>({
    initialItems: [],
  });

  // Sync selectedIsic with form filters whenever they change
  React.useEffect(() => {
    if (isicOptions.length > 0) {
      const selectedItems = isicOptions.filter(item =>
        filters.isic.includes(item.id),
      );
      const currentSelectedIds = selectedIsic.items.map(item => item.id);

      // Only update if there's actually a difference
      const newIds = selectedItems.map(item => item.id);
      const currentIds = new Set(currentSelectedIds);

      // Check if sets are different
      const isDifferent =
        newIds.length !== currentSelectedIds.length ||
        newIds.some(id => !currentIds.has(id));

      if (isDifferent) {
        // Clear and rebuild - but enforce the limit here too
        selectedIsic.items.forEach(item => selectedIsic.remove(item.id));

        // Only add items up to the limit of 5
        const itemsToAdd = selectedItems.slice(0, 5);
        itemsToAdd.forEach(item => selectedIsic.append(item));

        // If we had to truncate, update the form state to match
        if (selectedItems.length > 5) {
          const truncatedIds = itemsToAdd.map(item => item.id);
          onFiltersChange({ isic: truncatedIds });
        }
      }
    }
  }, [filters.isic, isicOptions, onFiltersChange, selectedIsic]);

  const handleIsicItemInserted = (key: React.Key) => {
    const currentIsicIds = filters.isic || [];

    // Hard limit: Don't allow more than 5 selections
    if (currentIsicIds.length >= 5) {
      // Force remove the item that was just added by MultiSelect's internal state
      setTimeout(() => {
        selectedIsic.remove(key.toString());
      }, 0);
      console.warn('⚠️ Maximum 5 ISIC codes allowed');
      return;
    }

    const newIsicIds = [...currentIsicIds, key as string];
    onFiltersChange({ isic: newIsicIds });
  };

  const handleIsicItemCleared = (key: React.Key) => {
    const currentIsicIds = filters.isic || [];
    const newIsicIds = currentIsicIds.filter(id => id !== key);

    // Only update the form state - let MultiSelect manage its own internal state
    onFiltersChange({ isic: newIsicIds });
  };

  const handleAreaChange = (value: number | number[]) => {
    const vals = Array.isArray(value) ? value : [value];
    const [a, b] = vals as [number, number];
    const newValue: [number, number] = [Math.min(a, b), Math.max(a, b)];
    onAreaValueChange(newValue);
  };

  return (
    <div data-qa-id={dataQaId}>
      {/* First row of filters */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 items-end' data-qa-id={`${dataQaId}-first-row`}>
        {isicOptions.length > 0 ? (
          <div className='flex flex-col gap-1' data-qa-id={`${dataQaId}-isic-section`}>
            <MultiSelect
              label={t('search.isic_code')}
              placeholder={t('common.search')}
              selectedItems={selectedIsic}
              items={availableItems}
              onItemInserted={handleIsicItemInserted}
              onItemCleared={handleIsicItemCleared}
              data-qa-id={`${dataQaId}-isic-multiselect`}
            >
              {(item: SelectOption) => (
                <MultiSelect.Item key={item.id} id={item.id}>
                  {item.label}
                </MultiSelect.Item>
              )}
            </MultiSelect>
            {filters.isic && filters.isic.length >= 5 && (
              <p className='text-xs text-amber-600' data-qa-id={`${dataQaId}-isic-limit-message`}>
                Maximum limit reached (5/5). Remove items to select others.
              </p>
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-2' data-qa-id={`${dataQaId}-isic-loading`}>
            <label className='text-sm font-medium text-gray-700' data-qa-id={`${dataQaId}-isic-loading-label`}>
              ISIC Code
            </label>
            <input
              type='text'
              placeholder='Loading ISIC codes...'
              disabled
              className='px-3 py-2 border border-gray-300 rounded-md bg-gray-100'
              data-qa-id={`${dataQaId}-isic-loading-input`}
            />
          </div>
        )}

        <Select
          size='md'
          label={t('search.sector')}
          placeholder={t('search.all_sectors')}
          items={sectorOptions}
          selectedKey={filters.sector || null}
          onSelectionChange={key => onFiltersChange({ sector: key as string })}
          data-qa-id={`${dataQaId}-sector-select`}
        >
          {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>

        <Select
          size='md'
          label={t('search.region')}
          placeholder={t('search.select_region')}
          items={regionOptions}
          selectedKey={filters.region || null}
          onSelectionChange={key => onFiltersChange({ region: key as string })}
          data-qa-id={`${dataQaId}-region-select`}
        >
          {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
      </div>

      {/* Second row of filters */}
      <div className='mt-4 grid grid-cols-1 items-end gap-4 md:grid-cols-3' data-qa-id={`${dataQaId}-second-row`}>
        <Select
          size='md'
          label={t('search.location')}
          placeholder={t('search.select_location')}
          items={cityOptions}
          selectedKey={filters.location || null}
          onSelectionChange={key =>
            onFiltersChange({ location: key as string })
          }
          isDisabled={!filters.region || isLoading}
          data-qa-id={`${dataQaId}-location-select`}
        >
          {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>

        <div className='flex flex-col gap-2' data-qa-id={`${dataQaId}-area-section`}>
          <label className='text-sm font-medium text-secondary' data-qa-id={`${dataQaId}-area-label`}>
            {t('search.land_area') || 'Land Area'}
          </label>
          <div className='flex items-center' data-qa-id={`${dataQaId}-area-slider-container`}>
            <span className='text-xs text-quaternary mr-2' data-qa-id={`${dataQaId}-area-min-value`}>{areaValue[0]}</span>
            <Slider
              aria-label='Land area'
              minValue={areaRange.min}
              maxValue={areaRange.max}
              value={areaValue}
              onChange={handleAreaChange}
              onChangeEnd={onAreaChangeEnd}
              className='mx-2 flex-grow'
              formatOptions={{ style: 'decimal', maximumFractionDigits: 0 }}
              data-qa-id={`${dataQaId}-area-slider`}
            />
            <span className='text-xs text-quaternary ml-2' data-qa-id={`${dataQaId}-area-max-value`}>{areaValue[1]}</span>
          </div>
        </div>

        {/* Action Buttons Column */}
        <div className='flex flex-row items-center gap-3 md:self-end md:justify-end' data-qa-id={`${dataQaId}-actions`}>
          <Button
            size='lg'
            color='secondary'
            onClick={onClear}
            disabled={isLoading}
            data-qa-id={`${dataQaId}-clear-button`}
          >
            {t('common.clear') || 'Clear'}
          </Button>
          <Button
            size='lg'
            color='primary'
            onClick={onSearch}
            disabled={isLoading}
            data-qa-id={`${dataQaId}-search-button`}
          >
            {isSearching
              ? t('common.searching') || 'Searching...'
              : t('navigation.explore') || 'Search'}
          </Button>
        </div>
      </div>
    </div>
  );
}
