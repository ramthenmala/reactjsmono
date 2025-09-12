import { StatCard } from '../UI/StatCard';
import { Zap, Drop } from '@untitledui/icons';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';
import { IInfrastructureInfo } from '../../types/industrialCity';
import { Icon } from '@compass/shared-ui';

export function InfrastructureSection({
  title,
  electricity,
  gas,
  water,
} : IInfrastructureInfo) {
  return (
    <div className={propertyDetailStyles.section}>
      <h2 className={propertyDetailStyles.sectionTitle}>{title}</h2>

      <div className={propertyDetailStyles.grid.threeColumns}>
        <StatCard
          label={electricity.title}
          value={electricity.value}
          icon={<Zap className='size-8.5' strokeWidth={1} />}
        />
        <StatCard
          label={gas.title}
          value={gas.value}
          icon={<Icon name="fire" className='size-8.5' strokeWidth={1} />}
        />
        <StatCard
          label={water.title}
          value={water.value}
          icon={<Drop className='size-8.5' strokeWidth={1} />}
        />
      </div>
    </div>
  );
}
