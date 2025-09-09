import { useState } from 'react';
import { ButtonGroup, ButtonGroupItem } from '@compass/shared-ui';
import type { MapControlsProps } from '../../types/mapControls';

export function MapControls({ onZoomIn, onZoomOut, onStyleChange, activeMapStyle }: MapControlsProps) {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 items-start">
      {/* Layer/Style Selection - Independent Button */}
      <div className="relative">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center"
          aria-label="Map layers"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor" opacity="0.7"/>
            <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"/>
            <rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor" opacity="0.7"/>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showLayerMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <button
              onClick={() => {
                onStyleChange('streets');
                setShowLayerMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors ${
                activeMapStyle === 'streets' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M6 6h8M6 10h8M6 14h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium">Streets</span>
            </button>
            
            <button
              onClick={() => {
                onStyleChange('satellite');
                setShowLayerMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors ${
                activeMapStyle === 'satellite' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.3"/>
                <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.6"/>
              </svg>
              <span className="text-sm font-medium">Satellite</span>
            </button>
          </div>
        )}
      </div>

      {/* Zoom Controls - ButtonGroup */}
      <ButtonGroup size="sm" className="bg-white shadow-lg">
        <ButtonGroupItem id="zoom-in" onClick={onZoomIn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </ButtonGroupItem>
        <ButtonGroupItem id="zoom-out" onClick={onZoomOut}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
}