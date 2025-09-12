import type { MapBackButtonProps } from '../../types/mapBackButton';
import { mapStyles } from './styles';

export function MapBackButton({
  selectedCity,
  onBackToCities,
}: MapBackButtonProps) {
  if (!selectedCity) return null;

  return (
    <div className={mapStyles.backButton.container}>
      <button onClick={onBackToCities} className={mapStyles.backButton.button}>
        <svg
          width={mapStyles.icons.back.width}
          height={mapStyles.icons.back.height}
          viewBox={mapStyles.icons.back.viewBox}
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10 12L6 8L10 4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        Back to Cities
      </button>
    </div>
  );
}
