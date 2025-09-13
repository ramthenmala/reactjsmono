import { StatCard } from '../UI/StatCard';
import { Zap, Drop } from '@untitledui/icons';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';
import type { IInfrastructureSectionProps } from '../../types/industrialCity';
import { Icon } from '@compass/shared-ui';

export function InfrastructureSection({
  title,
  electricity,
  gas,
  water,
  'data-qa-id': dataQaId = 'infrastructure-section',
}: IInfrastructureSectionProps) {
  return (
    <div 
      className={propertyDetailStyles.section}
      data-qa-id={dataQaId}
    >
      <h2 
        className={propertyDetailStyles.sectionTitle}
        data-qa-id={`${dataQaId}-title`}
      >
        {title}
      </h2>

      <div 
        className={propertyDetailStyles.grid.threeColumns}
        data-qa-id={`${dataQaId}-stats`}
      >
        <StatCard
          label={electricity.title}
          value={electricity.value}
          icon={<Zap className='size-8.5' strokeWidth={1} />}
          data-qa-id={`${dataQaId}-electricity`}
        />
        <StatCard
          label={gas.title}
          value={gas.value}
          icon={<Icon name="fire" className='size-8.5' strokeWidth={1} />}
          data-qa-id={`${dataQaId}-gas`}
        />
        <StatCard
          label={water.title}
          value={water.value}
          icon={<Drop className='size-8.5' strokeWidth={1} />}
          data-qa-id={`${dataQaId}-water`}
        />
      </div>
    </div>
  );
}
