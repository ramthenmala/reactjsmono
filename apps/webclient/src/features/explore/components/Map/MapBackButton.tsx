import type { MapBackButtonProps } from '../../types/mapBackButton';

export function MapBackButton({ selectedCity, onBackToCities }: MapBackButtonProps) {
  if (!selectedCity) return null;

  return (
    <div className="absolute top-4 left-4 z-10 border-2 border-gray-300 rounded-lg">
      <button
        onClick={onBackToCities}
        className="bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Cities
      </button>
    </div>
  );
}