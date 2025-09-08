import { createPortal } from 'react-dom';
import { IProperty } from '@/features/explore/types/explore';
import { PropertyCard } from '@/features/explore/components/PropertyCard';

interface MapPopupProps {
  property: IProperty | null;
  container: HTMLDivElement | null;
  onClose: () => void;
  onView?: (property: IProperty) => void;
}

export function MapPopup({ property, container, onClose, onView }: MapPopupProps) {
  if (!property || !container) return null;

  return createPortal(
    <div className="relative w-full">
      <div className="w-full min-w-[380px]">
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
        className="absolute top-3 right-3 z-50 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-all cursor-pointer shadow-md"
      >
        ×
      </button>
    </div>,
    container
  );
}