import { useState } from "react";
import { PropertyCard } from "@/features/explore/components/PropertyCard";
import { PropertyTable } from "@/features/explore/components/PropertyTable";
import { IPropertyGridProps } from "@/features/explore/types/searchFilters";
import { EViewMode } from "@/features/explore/types/map";

const ITEMS_PER_PAGE_SPLIT = 4;
const ITEMS_PER_PAGE_LIST = 10;

export function PropertyGrid({ 
  properties, 
  totalResults,
  viewMode,
  onCompare, 
  onView 
}: IPropertyGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (viewMode === EViewMode.map) {
    return null;
  }

  // Calculate pagination based on view mode
  const itemsPerPage = viewMode === EViewMode.list ? ITEMS_PER_PAGE_LIST : ITEMS_PER_PAGE_SPLIT;
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Use table view for list mode
  if (viewMode === EViewMode.list) {
    return (
      <div className="w-full">
        <PropertyTable
          properties={currentProperties}
          onCompare={onCompare}
          onView={onView}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      </div>
    );
  }
  
  // Use card grid for split mode - also implement pagination
  return (
    <div className="flex-1 lg:max-w-2xl">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onCompare={onCompare}
            onView={onView}
          />
        ))}
      </div>
      
      {/* Pagination for cards */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <div className="flex items-center gap-1 mx-4">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return pageNumber;
              }).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-400 mx-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === totalPages
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}