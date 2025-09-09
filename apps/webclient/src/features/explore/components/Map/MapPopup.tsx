import { createPortal } from 'react-dom';
import { IProperty } from '@/features/explore/types/explore';
import { PropertyCard } from '@/features/explore/components/PropertyCard';
import type { MapPopupProps } from '../../types/mapPopup';
import { mapStyles } from './styles';

export function MapPopup({ property, container, onClose, onView }: MapPopupProps) {
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
      <button
        onClick={onClose}
        className={mapStyles.popup.closeButton}
      >
        ×
      </button>
    </div>,
    container
  );
}