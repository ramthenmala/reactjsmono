import React from 'react';
import { IMarketAccessAndDemand } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { BadgeWithDot } from '@compass/shared-ui';

export const MarketAccessAndDemand: React.FC<IMarketAccessAndDemand> = ({
  subTitle,
  value,
  image,
  'data-qa-id': dataQaId = 'market-access-demand',
}) => {
  return (
    <div 
      className='flex flex-col-reverse lg:flex-row gap-4'
      data-qa-id={dataQaId}
    >
      <div 
        className='lg:w-1/3'
        data-qa-id={`${dataQaId}-content`}
      >
        <StatCard
          label={subTitle}
          value={
            <BadgeWithDot 
              type="pill-color" 
              color="brand" 
              size="lg"
              data-qa-id={`${dataQaId}-badge`}
            >
              {value}
            </BadgeWithDot>
          }
          data-qa-id={`${dataQaId}-stat`}
        />
      </div>
      {image && (
        <img 
          src={image} 
          alt='Market Access and Demand' 
          className='lg:w-2/3 h-auto rounded-2xl'
          data-qa-id={`${dataQaId}-image`}
        />
      )}
    </div>
  );
};

export default MarketAccessAndDemand;
