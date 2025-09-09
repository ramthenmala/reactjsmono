import { StatCard } from '../UI/StatCard';
import { Zap, Drop, Settings01 } from '@untitledui/icons';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';

export function InfrastructureSection() {
  return (
    <div className={propertyDetailStyles.section}>
      <h2 className={propertyDetailStyles.sectionTitle}>Infrastructure</h2>

      <div className={propertyDetailStyles.grid.threeColumns}>
        <StatCard
          label='Electricity Daily Capacity (MW)'
          value='174 MW'
          icon={<Zap className='w-5 h-5' />}
        />
        <StatCard
          label='Gas Daily Capacity (MMW)'
          value='N/A MMSCFD'
          icon={<Settings01 className='w-5 h-5' />}
        />
        <StatCard
          label='Water Daily Capacity (m³/day)'
          value='17,500 m³/day'
          icon={<Drop className='w-5 h-5' />}
        />
      </div>
    </div>
  );
}
