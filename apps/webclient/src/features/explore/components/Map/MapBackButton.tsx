import type { MapBackButtonProps } from '../../types/mapBackButton';
import { mapStyles } from './styles';

export function MapBackButton({
  selectedCity,
  onBackToCities,
  'data-qa-id': dataQaId = 'map-back-button',
}: MapBackButtonProps) {
  if (!selectedCity) return null;

  return (
    <div className={mapStyles.backButton.container} data-qa-id={dataQaId}>
      <button onClick={onBackToCities} className={mapStyles.backButton.button} data-qa-id={`${dataQaId}-button`}>
        <svg
          width={mapStyles.icons.back.width}
          height={mapStyles.icons.back.height}
          viewBox={mapStyles.icons.back.viewBox}
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          data-qa-id={`${dataQaId}-icon`}
        >
          <path
            d='M10 12L6 8L10 4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <span data-qa-id={`${dataQaId}-text`}>Back to Cities</span>
      </button>
    </div>
  );
}
