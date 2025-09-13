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
  'data-qa-id': dataQaId = 'map-popup',
}: MapPopupProps) {
  if (!property || !container) return null;

  return createPortal(
    <div className={mapStyles.popup.container} data-qa-id={dataQaId}>
      <div className={mapStyles.popup.content} data-qa-id={`${dataQaId}-content`}>
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
          data-qa-id={`${dataQaId}-property-card`}
        />
      </div>
      <button onClick={onClose} className={mapStyles.popup.closeButton} data-qa-id={`${dataQaId}-close-button`}>
        <XClose className='size-4' data-qa-id={`${dataQaId}-close-icon`} />
      </button>
    </div>,
    container,
  );
}
