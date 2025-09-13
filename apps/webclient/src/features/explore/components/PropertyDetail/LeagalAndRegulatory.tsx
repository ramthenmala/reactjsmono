import React from 'react';
import { ILeagalAndRegulatory } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { Badge } from '@compass/shared-ui';

export const LeagalAndRegulatory: React.FC<ILeagalAndRegulatory> = ({
  subTitle,
  value,
  image,
  'data-qa-id': dataQaId = 'legal-regulatory',
}) => {
  return (
    <div 
      className='flex flex-col-reverse lg:flex-row gap-4'
      data-qa-id={dataQaId}
    >
      <div 
        className='lg:w-1/2'
        data-qa-id={`${dataQaId}-content`}
      >
        <StatCard
          label={subTitle}
          value={
            <Badge 
              type="pill-color" 
              color="brand" 
              size="lg" 
              className='px-6'
              data-qa-id={`${dataQaId}-badge`}
            >
              {value}
            </Badge>
          }
          data-qa-id={`${dataQaId}-stat`}
        />
      </div>
      {image && (
        <img 
          src={image} 
          alt='Legal and Regulatory' 
          className='lg:w-1/2 h-auto rounded-2xl'
          data-qa-id={`${dataQaId}-image`}
        />
      )}
    </div>
  );
};

export default LeagalAndRegulatory;
