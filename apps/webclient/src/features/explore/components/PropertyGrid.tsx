import { PropertyCard } from "./PropertyCard";
import { IPropertyGridProps } from "../types/searchFilters";
import { EViewMode } from "../types/map";

export function PropertyGrid({ 
  properties, 
  totalResults,
  viewMode,
  onCompare, 
  onView 
}: IPropertyGridProps) {
  if (viewMode === EViewMode.map) {
    return null;
  }
  
  return (
    <div className={viewMode === EViewMode.list ? "w-full" : "flex-1 lg:max-w-2xl"}>
      {/* Property Cards Grid */}
      <div className={`grid gap-6 ${
        viewMode === EViewMode.list 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
          : "grid-cols-1 md:grid-cols-2"
      }`}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onCompare={onCompare}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}