import React from 'react';
import { IMarketAccessAndDemand } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { BadgeWithDot } from '@compass/shared-ui';

export const MarketAccessAndDemand: React.FC<IMarketAccessAndDemand> = ({
  subTitle,
  value,
  image,
}) => {
  return (
    <div className='flex flex-col-reverse lg:flex-row gap-4'>
      <div className='lg:w-1/3'>
        <StatCard
          label={subTitle}
          value={
            <BadgeWithDot type="pill-color" color="brand" size="lg">
              {value}
            </BadgeWithDot>
          }
      />
      </div>
      {image && (
        <img src={image} alt='Workforce and Talent' className='lg:w-2/3 h-auto rounded-2xl' />
      )}
    </div>
  );
};

export default MarketAccessAndDemand;
