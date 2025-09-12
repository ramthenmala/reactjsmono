import { useState } from 'react';
import { PropertyCard } from '@/features/explore/components/Property/PropertyCard';
import { PropertyTable } from '@/features/explore/components/Property/PropertyTable';
import { IPropertyGridProps } from '@/features/explore/types/searchFilters';
import { EViewMode } from '@/features/explore/types/map';
import { propertyGridStyles } from './styles';

const ITEMS_PER_PAGE_SPLIT = 4;
const ITEMS_PER_PAGE_LIST = 10;

export function PropertyGrid({
  properties,
  viewMode,
  onCompare,
  onView,
}: Omit<IPropertyGridProps, 'totalResults'>) {
  const [currentPage, setCurrentPage] = useState(1);

  if (viewMode === EViewMode.map) {
    return null;
  }

  // Calculate pagination based on view mode
  const itemsPerPage =
    viewMode === EViewMode.list ? ITEMS_PER_PAGE_LIST : ITEMS_PER_PAGE_SPLIT;
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
      <div className={propertyGridStyles.container.list}>
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
    <div className={propertyGridStyles.container.split}>
      <div className={propertyGridStyles.cardGrid}>
        {currentProperties.map(property => (
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
        <div className={propertyGridStyles.pagination.wrapper}>
          <div className={propertyGridStyles.pagination.container}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${propertyGridStyles.pagination.navButton.base} ${
                currentPage === 1
                  ? propertyGridStyles.pagination.navButton.disabled
                  : propertyGridStyles.pagination.navButton.enabled
              }`}
            >
              <svg
                className={propertyGridStyles.pagination.icons.prev}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Previous
            </button>

            <div className={propertyGridStyles.pagination.numbers.container}>
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
                  className={`${
                    propertyGridStyles.pagination.numbers.button.base
                  } ${
                    currentPage === page
                      ? propertyGridStyles.pagination.numbers.button.active
                      : propertyGridStyles.pagination.numbers.button.inactive
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span
                    className={propertyGridStyles.pagination.numbers.ellipsis}
                  >
                    ...
                  </span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`${
                      propertyGridStyles.pagination.numbers.button.base
                    } ${
                      currentPage === totalPages
                        ? propertyGridStyles.pagination.numbers.button.active
                        : propertyGridStyles.pagination.numbers.button.inactive
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
              className={`${propertyGridStyles.pagination.navButton.base} ${
                currentPage === totalPages
                  ? propertyGridStyles.pagination.navButton.disabled
                  : propertyGridStyles.pagination.navButton.enabled
              }`}
            >
              Next
              <svg
                className={propertyGridStyles.pagination.icons.next}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
