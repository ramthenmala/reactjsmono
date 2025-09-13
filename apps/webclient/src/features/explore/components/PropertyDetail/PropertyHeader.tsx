'use client';

import { Banner } from '../Banner';
import type { IPropertyHeaderProps } from '../../types/industrialCity';

export function PropertyHeader({
  banner, 
  name, 
  description,
  'data-qa-id': dataQaId = 'property-header',
}: IPropertyHeaderProps) {
  return (
    <div data-qa-id={dataQaId}>
      <Banner imageSrc={banner ?? ''} data-qa-id={`${dataQaId}-banner`} />

      {/* Header */}
      <div 
        className='flex flex-col md:flex-row items-start justify-between gap-4'
        data-qa-id={`${dataQaId}-content`}
      >
        <div className='flex flex-col gap-5' data-qa-id={`${dataQaId}-info`}>
          <h1 
            className='text-4xl font-semibold md:font-medium text-brand-900'
            data-qa-id={`${dataQaId}-title`}
          >
            {name}
          </h1>
          <p 
            className='text-lg font-medium text-gray-600 max-w-[629px]'
            data-qa-id={`${dataQaId}-description`}
          >
            {description}
          </p>
        </div>
        {/* <Button size="md" color="primary" className="mx-auto md:mx-0">
          {t('common.connect')}
        </Button> */}
      </div>
    </div>
  );
}
