'use client';

import { Banner } from '../Banner';
import type { PropertyDetailComponentProps } from '../../types/industrialCity';

export function PropertyHeader({ industrialCity }: PropertyDetailComponentProps) {
  return (
    <>
      <Banner imageSrc={industrialCity.banner} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-semibold md:font-medium text-brand-900">
            {industrialCity.name}
          </h1>
          <p className="text-lg font-medium text-gray-600 max-w-[629px]">
            {industrialCity.description}
          </p>
        </div>
        {/* <Button size="md" color="primary" className="mx-auto md:mx-0">
          {t('common.connect')}
        </Button> */}
      </div>
    </>
  );
}
