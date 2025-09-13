import React, { memo, useCallback } from 'react';
import { Copy01 } from '@untitledui/icons';
import { ButtonUtility, Table, TableCard } from '@compass/shared-ui';
import { IProperty } from '@/features/explore/types/explore';
import type { IPropertyTableProps } from '../../types/propertyTable';

export const PropertyTable = memo(
  ({
    properties,
    onView,
    onCompare,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    itemsPerPage = 10,
    'data-qa-id': dataQaId = 'property-table',
  }: IPropertyTableProps) => {
    const handleCompare = useCallback(
      (property: IProperty) => {
        onCompare?.(property);
      },
      [onCompare],
    );

    return (
      <TableCard.Root data-qa-id={dataQaId}>
        <div className='overflow-x-auto' data-qa-id={`${dataQaId}-container`}>
          <Table aria-label='Industrial Cities' size='md' data-qa-id={`${dataQaId}-table`}>
            <Table.Header data-qa-id={`${dataQaId}-header`}>
              <Table.Head id='slNo' label='Sl No.' className='w-20' data-qa-id={`${dataQaId}-header-sl-no`} />
              <Table.Head
                id='title'
                label='Industrial City'
                isRowHeader
                className='w-full max-w-1/4'
                data-qa-id={`${dataQaId}-header-title`}
              />
              <Table.Head id='city' label='City' data-qa-id={`${dataQaId}-header-city`} />
              <Table.Head id='area' label='Available Land' data-qa-id={`${dataQaId}-header-area`} />
              <Table.Head id='electricity' label='Electricity' data-qa-id={`${dataQaId}-header-electricity`} />
              <Table.Head id='gas' label='Gas' data-qa-id={`${dataQaId}-header-gas`} />
              <Table.Head id='water' label='Water' data-qa-id={`${dataQaId}-header-water`} />
              <Table.Head id='actions' data-qa-id={`${dataQaId}-header-actions`} />
            </Table.Header>

            <Table.Body items={properties} data-qa-id={`${dataQaId}-body`}>
              {property => {
                const index = properties.findIndex(p => p.id === property.id);
                const serialNumber =
                  (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <Table.Row id={property.id} data-qa-id={`${dataQaId}-row-${property.id}`}>
                    <Table.Cell data-qa-id={`${dataQaId}-cell-sl-no-${property.id}`}>
                      <span className='text-sm font-medium text-primary' data-qa-id={`${dataQaId}-sl-no-${property.id}`}>
                        {serialNumber}.
                      </span>
                    </Table.Cell>
                    <Table.Cell data-qa-id={`${dataQaId}-cell-title-${property.id}`}>
                      <button
                        onClick={() => onView?.(property)}
                        className='text-sm font-medium text-primary hover:text-brand-600 transition-colors text-left'
                        data-qa-id={`${dataQaId}-title-button-${property.id}`}
                      >
                        {property.title}
                      </button>
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap' data-qa-id={`${dataQaId}-cell-city-${property.id}`}>
                      {property.city}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap' data-qa-id={`${dataQaId}-cell-area-${property.id}`}>
                      {property.area.toLocaleString()} km²
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap' data-qa-id={`${dataQaId}-cell-electricity-${property.id}`}>
                      {property.electricity || '-'}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap' data-qa-id={`${dataQaId}-cell-gas-${property.id}`}>
                      {property.gas || '-'}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap' data-qa-id={`${dataQaId}-cell-water-${property.id}`}>
                      {property.water || '-'}
                    </Table.Cell>
                    <Table.Cell className='px-4' data-qa-id={`${dataQaId}-cell-actions-${property.id}`}>
                      <div className='flex justify-end' data-qa-id={`${dataQaId}-actions-container-${property.id}`}>
                        <ButtonUtility
                          size='xs'
                          color='tertiary'
                          tooltip='Compare'
                          icon={Copy01}
                          onClick={() => handleCompare(property)}
                          data-qa-id={`${dataQaId}-compare-button-${property.id}`}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table>

          {/* Pagination */}
          <div className='px-6 py-4 bg-white border-t border-gray-200' data-qa-id={`${dataQaId}-pagination`}>
            <div className='flex items-center justify-between' data-qa-id={`${dataQaId}-pagination-wrapper`}>
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                data-qa-id={`${dataQaId}-pagination-previous`}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  data-qa-id={`${dataQaId}-pagination-previous-icon`}
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

              <div className='flex items-center gap-2' data-qa-id={`${dataQaId}-pagination-numbers`}>
                {Array.from(
                  { length: Math.min(totalPages, 10) },
                  (_, i) => i + 1,
                ).map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    data-qa-id={`${dataQaId}-pagination-page-${page}`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 10 && (
                  <>
                    <span className='text-gray-500' data-qa-id={`${dataQaId}-pagination-ellipsis`}>...</span>
                    <button
                      onClick={() => onPageChange?.(totalPages)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      data-qa-id={`${dataQaId}-pagination-page-${totalPages}`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                data-qa-id={`${dataQaId}-pagination-next`}
              >
                Next
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  data-qa-id={`${dataQaId}-pagination-next-icon`}
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
        </div>
      </TableCard.Root>
    );
  },
);

PropertyTable.displayName = 'PropertyTable';
