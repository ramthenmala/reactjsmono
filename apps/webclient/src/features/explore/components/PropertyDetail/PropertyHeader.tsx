'use client';

import { Banner } from '../Banner';

export function PropertyHeader({
  banner, name, description,
}: {
  banner: string | null;
  name: string;
  description: string | null;
}) {
  return (
    <>
      <Banner imageSrc={banner ?? ''} />

      {/* Header */}
      <div className='flex flex-col md:flex-row items-start justify-between gap-4'>
        <div className='flex flex-col gap-5'>
          <h1 className='text-4xl font-semibold md:font-medium text-brand-900'>
            {name}
          </h1>
          <p className='text-lg font-medium text-gray-600 max-w-[629px]'>
            {description}
          </p>
        </div>
        {/* <Button size="md" color="primary" className="mx-auto md:mx-0">
          {t('common.connect')}
        </Button> */}
      </div>
    </>
  );
}
