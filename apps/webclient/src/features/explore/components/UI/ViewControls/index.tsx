import { Button } from '@compass/shared-ui';
import {
  ChevronDown,
  FilterLines,
  List,
  Map01,
  Map02,
} from '@untitledui/icons';
import { useState } from 'react';
import { EViewMode } from '@/features/explore/types/map';
import { useLocaleTranslation } from '@/i18n';
import type { ViewControlsProps } from '../../types/viewControls';
import { viewControlsStyles } from './styles';

export function ViewControls({
  viewMode,
  onViewModeChange,
  'data-qa-id': dataQaId = 'view-controls',
}: ViewControlsProps) {
  const { t } = useLocaleTranslation();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  return (
    <div className={viewControlsStyles.container} data-qa-id={dataQaId}>
      {/* Left side - Filters */}
      <div className={viewControlsStyles.filters.container} data-qa-id={`${dataQaId}-filters`}>
        <Button color='secondary' size='sm' iconLeading={FilterLines} data-qa-id={`${dataQaId}-filters-button`}>
          {t('common.filters')}
        </Button>

        {/* Sort Dropdown */}
        <div className={viewControlsStyles.filters.dropdown.container} data-qa-id={`${dataQaId}-sort-dropdown`}>
          <Button
            color='tertiary'
            size='sm'
            iconTrailing={ChevronDown}
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            data-qa-id={`${dataQaId}-sort-button`}
          >
            {t('common.sort_by')}
          </Button>

          {isSortDropdownOpen && (
            <div className={viewControlsStyles.filters.dropdown.menu} data-qa-id={`${dataQaId}-sort-menu`}>
              <div className={viewControlsStyles.filters.dropdown.padding} data-qa-id={`${dataQaId}-sort-options`}>
                <button className={viewControlsStyles.filters.dropdown.item} data-qa-id={`${dataQaId}-sort-distance`}>
                  {t('explore.sort.distance') || 'Distance'}
                </button>
                <button className={viewControlsStyles.filters.dropdown.item} data-qa-id={`${dataQaId}-sort-land-area`}>
                  {t('explore.sort.land_area') || 'Land Area'}
                </button>
                <button className={viewControlsStyles.filters.dropdown.item} data-qa-id={`${dataQaId}-sort-newest`}>
                  {t('explore.sort.newest') || 'Newest'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - View Controls */}
      <div className={viewControlsStyles.viewButtons.container} data-qa-id={`${dataQaId}-view-buttons`}>
        <button
          onClick={() => onViewModeChange(EViewMode.list)}
          className={`${viewControlsStyles.viewButtons.button.base} ${
            viewMode === EViewMode.list
              ? viewControlsStyles.viewButtons.button.active
              : viewControlsStyles.viewButtons.button.inactive
          }`}
          data-qa-id={`${dataQaId}-list-button`}
        >
          <List className={viewControlsStyles.viewButtons.icon} />
          {t('explore.view.list') || 'List'}
        </button>
        <button
          onClick={() => onViewModeChange(EViewMode.split)}
          className={`${viewControlsStyles.viewButtons.button.base} ${
            viewControlsStyles.viewButtons.button.withBorder
          } ${
            viewMode === EViewMode.split
              ? viewControlsStyles.viewButtons.button.active
              : viewControlsStyles.viewButtons.button.inactive
          }`}
          data-qa-id={`${dataQaId}-split-button`}
        >
          <Map02 className={viewControlsStyles.viewButtons.icon} />
          {t('explore.view.split') || 'Split'}
        </button>
        <button
          onClick={() => onViewModeChange(EViewMode.map)}
          className={`${viewControlsStyles.viewButtons.button.base} ${
            viewControlsStyles.viewButtons.button.withBorder
          } ${
            viewMode === EViewMode.map
              ? viewControlsStyles.viewButtons.button.active
              : viewControlsStyles.viewButtons.button.inactive
          }`}
          data-qa-id={`${dataQaId}-map-button`}
        >
          <Map01 className={viewControlsStyles.viewButtons.icon} />
          {t('explore.view.map') || 'Map'}
        </button>
      </div>
    </div>
  );
}
