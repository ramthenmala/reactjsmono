import React from 'react';
import { ILeagalAndRegulatory } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { Badge } from '@compass/shared-ui';

export const LeagalAndRegulatory: React.FC<ILeagalAndRegulatory> = ({
  subTitle,
  value,
  image,
}) => {
  return (
    <div className='flex flex-col-reverse lg:flex-row gap-4'>
      <div className='lg:w-1/2'>
        <StatCard
          label={subTitle}
          value={
            <Badge type="pill-color" color="brand" size="lg" className='px-6'>
              {value}
            </Badge>
          }
      />
      </div>
      {image && (
        <img src={image} alt='Workforce and Talent' className='lg:w-1/2 h-auto rounded-2xl' />
      )}
    </div>
  );
};

export default LeagalAndRegulatory;
