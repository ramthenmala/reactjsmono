import { createPortal } from 'react-dom';
import { PropertyCard } from '@/features/explore/components/Property/PropertyCard';
import type { MapPopupProps } from '../../types/mapPopup';
import { mapStyles } from './styles';
import { XClose } from '@untitledui/icons';

export function MapPopup({
  property,
  container,
  onClose,
  onView,
}: MapPopupProps) {
  if (!property || !container) return null;

  return createPortal(
    <div className={mapStyles.popup.container}>
      <div className={mapStyles.popup.content}>
        <PropertyCard
          property={property}
          hideDistance={true}
          onView={() => {
            onClose();
            onView?.(property);
          }}
          onCompare={() => {
            // Handle compare functionality
          }}
        />
      </div>
      <button onClick={onClose} className={mapStyles.popup.closeButton}>
        <XClose className='size-4' />
      </button>
    </div>,
    container,
  );
}
