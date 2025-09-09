import { useState } from 'react';
import { ButtonGroup, ButtonGroupItem } from '@compass/shared-ui';
import type { MapControlsProps } from '../../types/mapControls';
import { mapStyles } from './styles';

export function MapControls({
  onZoomIn,
  onZoomOut,
  onStyleChange,
  activeMapStyle,
}: MapControlsProps) {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className={mapStyles.controls.container}>
      {/* Layer/Style Selection - Independent Button */}
      <div className='relative'>
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className={mapStyles.controls.layerButton}
          aria-label='Map layers'
        >
          <svg
            width={mapStyles.icons.layers.width}
            height={mapStyles.icons.layers.height}
            viewBox={mapStyles.icons.layers.viewBox}
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              x='2'
              y='3'
              width='12'
              height='2'
              rx='1'
              fill='currentColor'
              opacity='0.7'
            />
            <rect
              x='2'
              y='7'
              width='12'
              height='2'
              rx='1'
              fill='currentColor'
            />
            <rect
              x='2'
              y='11'
              width='12'
              height='2'
              rx='1'
              fill='currentColor'
              opacity='0.7'
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showLayerMenu && (
          <div className={mapStyles.controls.layerDropdown.container}>
            <button
              onClick={() => {
                onStyleChange('streets');
                setShowLayerMenu(false);
              }}
              className={mapStyles.controls.layerDropdown.button(
                activeMapStyle === 'streets',
              )}
            >
              <svg
                width={mapStyles.icons.streetView.width}
                height={mapStyles.icons.streetView.height}
                viewBox={mapStyles.icons.streetView.viewBox}
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect
                  x='2'
                  y='2'
                  width='16'
                  height='16'
                  rx='2'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  fill='none'
                />
                <path
                  d='M6 6h8M6 10h8M6 14h5'
                  stroke='currentColor'
                  strokeWidth='1'
                  strokeLinecap='round'
                />
              </svg>
              <span className={mapStyles.controls.layerDropdown.label}>
                Streets
              </span>
            </button>

            <button
              onClick={() => {
                onStyleChange('satellite');
                setShowLayerMenu(false);
              }}
              className={mapStyles.controls.layerDropdown.button(
                activeMapStyle === 'satellite',
              )}
            >
              <svg
                width={mapStyles.icons.satelliteView.width}
                height={mapStyles.icons.satelliteView.height}
                viewBox={mapStyles.icons.satelliteView.viewBox}
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='10'
                  cy='10'
                  r='7'
                  fill='currentColor'
                  opacity='0.3'
                />
                <circle
                  cx='10'
                  cy='10'
                  r='3'
                  fill='currentColor'
                  opacity='0.6'
                />
              </svg>
              <span className={mapStyles.controls.layerDropdown.label}>
                Satellite
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Zoom Controls - ButtonGroup */}
      <ButtonGroup size='sm' className={mapStyles.controls.zoomGroup}>
        <ButtonGroupItem id='zoom-in' onClick={onZoomIn}>
          <svg
            width={mapStyles.icons.zoom.width}
            height={mapStyles.icons.zoom.height}
            viewBox={mapStyles.icons.zoom.viewBox}
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8 3V13M3 8H13'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </ButtonGroupItem>
        <ButtonGroupItem id='zoom-out' onClick={onZoomOut}>
          <svg
            width={mapStyles.icons.zoom.width}
            height={mapStyles.icons.zoom.height}
            viewBox={mapStyles.icons.zoom.viewBox}
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M3 8H13'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
}
