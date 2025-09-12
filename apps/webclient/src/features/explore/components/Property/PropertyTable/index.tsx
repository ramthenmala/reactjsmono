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
  }: IPropertyTableProps) => {
    const handleCompare = useCallback(
      (property: IProperty) => {
        onCompare?.(property);
      },
      [onCompare],
    );

    return (
      <TableCard.Root>
        <div className='overflow-x-auto'>
          <Table aria-label='Industrial Cities' size='md'>
            <Table.Header>
              <Table.Head id='slNo' label='Sl No.' className='w-20' />
              <Table.Head
                id='title'
                label='Industrial City'
                isRowHeader
                className='w-full max-w-1/4'
              />
              <Table.Head id='city' label='City' />
              <Table.Head id='area' label='Available Land' />
              <Table.Head id='electricity' label='Electricity' />
              <Table.Head id='gas' label='Gas' />
              <Table.Head id='water' label='Water' />
              <Table.Head id='actions' />
            </Table.Header>

            <Table.Body items={properties}>
              {property => {
                const index = properties.findIndex(p => p.id === property.id);
                const serialNumber =
                  (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <Table.Row id={property.id}>
                    <Table.Cell>
                      <span className='text-sm font-medium text-primary'>
                        {serialNumber}.
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => onView?.(property)}
                        className='text-sm font-medium text-primary hover:text-brand-600 transition-colors text-left'
                      >
                        {property.title}
                      </button>
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap'>
                      {property.city}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap'>
                      {property.area.toLocaleString()} km²
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap'>
                      {property.electricity || '-'}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap'>
                      {property.gas || '-'}
                    </Table.Cell>
                    <Table.Cell className='whitespace-nowrap'>
                      {property.water || '-'}
                    </Table.Cell>
                    <Table.Cell className='px-4'>
                      <div className='flex justify-end'>
                        <ButtonUtility
                          size='xs'
                          color='tertiary'
                          tooltip='Compare'
                          icon={Copy01}
                          onClick={() => handleCompare(property)}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table>

          {/* Pagination */}
          <div className='px-6 py-4 bg-white border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                <svg
                  className='w-5 h-5'
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

              <div className='flex items-center gap-2'>
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
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 10 && (
                  <>
                    <span className='text-gray-500'>...</span>
                    <button
                      onClick={() => onPageChange?.(totalPages)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
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
              >
                Next
                <svg
                  className='w-5 h-5'
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
        </div>
      </TableCard.Root>
    );
  },
);

PropertyTable.displayName = 'PropertyTable';
