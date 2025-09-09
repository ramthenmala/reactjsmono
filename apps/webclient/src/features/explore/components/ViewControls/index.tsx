import { Button } from "@compass/shared-ui";
import { ChevronDown, FilterLines, List, Map01, Map02 } from "@untitledui/icons";
import { useState } from "react";
import { EViewMode } from "@/features/explore/types/map";
import { useLocaleTranslation } from "@/shared/lib/i18n";
import type { ViewControlsProps } from '../../types/viewControls';
import { viewControlsStyles } from './styles';

export function ViewControls({ viewMode, onViewModeChange }: ViewControlsProps) {
  const { t } = useLocaleTranslation();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  return (
    <div className={viewControlsStyles.container}>
      {/* Left side - Filters */}
      <div className={viewControlsStyles.filters.container}>
        <Button 
          color="secondary" 
          size="sm"
          iconLeading={FilterLines}
        >
          {t('explore.filters') || 'Filters'}
        </Button>

        {/* Sort Dropdown */}
        <div className={viewControlsStyles.filters.dropdown.container}>
          <Button 
            color="tertiary" 
            size="sm"
            iconTrailing={ChevronDown}
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            {t('explore.sort_by') || 'Sort by'}
          </Button>
          
          {isSortDropdownOpen && (
            <div className={viewControlsStyles.filters.dropdown.menu}>
              <div className={viewControlsStyles.filters.dropdown.padding}>
                <button className={viewControlsStyles.filters.dropdown.item}>
                  {t('explore.sort.distance') || 'Distance'}
                </button>
                <button className={viewControlsStyles.filters.dropdown.item}>
                  {t('explore.sort.land_area') || 'Land Area'}
                </button>
                <button className={viewControlsStyles.filters.dropdown.item}>
                  {t('explore.sort.electricity') || 'Electricity'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - View Controls */}
      <div className={viewControlsStyles.viewButtons.container}>
        <button
          onClick={() => onViewModeChange(EViewMode.list)}
          className={`${viewControlsStyles.viewButtons.button.base} ${
            viewMode === EViewMode.list
              ? viewControlsStyles.viewButtons.button.active
              : viewControlsStyles.viewButtons.button.inactive
          }`}
        >
          <List className={viewControlsStyles.viewButtons.icon} />
          {t('explore.view.list') || 'List'}
        </button>
        <button
          onClick={() => onViewModeChange(EViewMode.split)}
          className={`${viewControlsStyles.viewButtons.button.base} ${viewControlsStyles.viewButtons.button.withBorder} ${
            viewMode === EViewMode.split
              ? viewControlsStyles.viewButtons.button.active
              : viewControlsStyles.viewButtons.button.inactive
          }`}
        >
          <Map02 className={viewControlsStyles.viewButtons.icon} />
          {t('explore.view.split') || 'Split'}
        </button>
        <button
          onClick={() => onViewModeChange(EViewMode.map)}
          className={`${viewControlsStyles.viewButtons.button.base} ${viewControlsStyles.viewButtons.button.withBorder} ${
            viewMode === EViewMode.map
              ? viewControlsStyles.viewButtons.button.active
              : viewControlsStyles.viewButtons.button.inactive
          }`}
        >
          <Map01 className={viewControlsStyles.viewButtons.icon} />
          {t('explore.view.map') || 'Map'}
        </button>
      </div>
    </div>
  );
}