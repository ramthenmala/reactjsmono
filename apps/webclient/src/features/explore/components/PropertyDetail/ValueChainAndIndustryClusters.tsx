import React from 'react';
import { IValueChainAndIndustryClusters } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { Badge, Icon } from '@compass/shared-ui';

const ValueChainAndIndustryClusters: React.FC<IValueChainAndIndustryClusters> = ({
  valueParks,
  organicClusters,
  knowHowAndInnovation,
  'data-qa-id': dataQaId = 'value-chain-clusters',
}) => {
  return (
    <div 
      className='flex flex-col gap-4'
      data-qa-id={dataQaId}
    >
      <div 
        className='grid grid-cols-1 md:grid-cols-3 gap-4'
        data-qa-id={`${dataQaId}-grid`}
      >
        {valueParks && (
          <StatCard
            label={valueParks.title}
            value={
              <div className='flex flex-wrap gap-2' data-qa-id={`${dataQaId}-value-parks-badges`}>
                {valueParks.value.map((value, index) => (
                  <Badge 
                    key={index} 
                    color='brand' 
                    size='lg' 
                    className='px-6'
                    data-qa-id={`${dataQaId}-value-park-${index}`}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            }
            icon={<Icon name='tree' className='size-11' />}
            data-qa-id={`${dataQaId}-value-parks`}
          />
        )}
        {organicClusters && (
          <StatCard
            label={organicClusters.title}
            value={
              <div className='flex flex-wrap gap-2' data-qa-id={`${dataQaId}-organic-clusters-badges`}>
                {organicClusters.value.map((value, index) => (
                  <Badge 
                    key={index} 
                    color='brand' 
                    size='lg' 
                    className='px-6'
                    data-qa-id={`${dataQaId}-organic-cluster-${index}`}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            }
            icon={<Icon name='cluster' className='size-11' />}
            data-qa-id={`${dataQaId}-organic-clusters`}
          />
        )}
        {knowHowAndInnovation && (
          <StatCard
            label={knowHowAndInnovation.title}
            value={knowHowAndInnovation.value}
            icon={<Icon name='innovation' className='size-11' />}
            variant='large'
            data-qa-id={`${dataQaId}-innovation`}
          />
        )}
      </div>
    </div>
  );
};

export default ValueChainAndIndustryClusters;
