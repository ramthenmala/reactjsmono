import { Button } from "@compass/shared-ui";
import { ChevronDown, FilterLines, List, Map01, Map02 } from "@untitledui/icons";
import { useState } from "react";
import { EViewMode } from "../types/map";
import { useLocaleTranslation } from "../../../shared/lib/i18n";

interface ViewControlsProps {
  viewMode: EViewMode;
  onViewModeChange: (mode: EViewMode) => void;
}

export function ViewControls({ viewMode, onViewModeChange }: ViewControlsProps) {
  const { t } = useLocaleTranslation();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left side - Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          color="secondary" 
          size="sm"
          iconLeading={FilterLines}
        >
          {t('explore.filters') || 'Filters'}
        </Button>

        {/* Sort Dropdown */}
        <div className="relative">
          <Button 
            color="tertiary" 
            size="sm"
            iconTrailing={ChevronDown}
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            {t('explore.sort_by') || 'Sort by'}
          </Button>
          
          {isSortDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-32 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50">
              <div className="p-1">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                  {t('explore.sort.distance') || 'Distance'}
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                  {t('explore.sort.land_area') || 'Land Area'}
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded">
                  {t('explore.sort.electricity') || 'Electricity'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - View Controls */}
      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
        <button
          onClick={() => onViewModeChange(EViewMode.list)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
            viewMode === EViewMode.list
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <List className="size-4" />
          {t('explore.view.list') || 'List'}
        </button>
        <button
          onClick={() => onViewModeChange(EViewMode.split)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer ${
            viewMode === EViewMode.split
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Map02 className="size-4" />
          {t('explore.view.split') || 'Split'}
        </button>
        <button
          onClick={() => onViewModeChange(EViewMode.map)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer ${
            viewMode === EViewMode.map
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Map01 className="size-4" />
          {t('explore.view.map') || 'Map'}
        </button>
      </div>
    </div>
  );
}