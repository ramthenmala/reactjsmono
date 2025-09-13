import React from 'react';
import { IValueChainAndIndustryClusters } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { Badge, Icon } from '@compass/shared-ui';

const ValueChainAndIndustryClusters: React.FC<IValueChainAndIndustryClusters> = ({
  valueParks,
  organicClusters,
  knowHowAndInnovation,
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {valueParks && (
          <StatCard
            label={valueParks.title}
            value={
              <div className='flex flex-wrap gap-2'>
                {valueParks.value.map((value, index) => (
                  <Badge key={index} color='brand' size='lg' className='px-6'>
                    {value}
                  </Badge>
                ))}
              </div>
            }
            icon={<Icon name='tree' className='size-11' />}
          />
        )}
        {organicClusters && (
          <StatCard
            label={organicClusters.title}
            value={
              <div className='flex flex-wrap gap-2'>
                {organicClusters.value.map((value, index) => (
                  <Badge key={index} color='brand' size='lg' className='px-6'>
                    {value}
                  </Badge>
                ))}
              </div>
            }
            icon={<Icon name='cluster' className='size-11' />}
          />
        )}
        {knowHowAndInnovation && (
          <StatCard
            label={knowHowAndInnovation.title}
            value={knowHowAndInnovation.value}
            icon={<Icon name='innovation' className='size-11' />}
            variant='large'
          />
        )}
      </div>
    </div>
  );
};

export default ValueChainAndIndustryClusters;
