import { StatChartCard } from '../Charts/StatChartCard';
import { StatCard } from '../UI/StatCard';
import {
  formatValueWithUnit,
  propertyDetailStyles,
} from '../../utils/propertyDetailUtils';
import { IWorkforceAndTalent } from '../../types/industrialCity';
import { Icon } from '@compass/shared-ui';

export function WorkforceTalentSection({
  avaialbilityOfSkilledLabor,
  avaialbilityOfNonSkilledLabor,
  skilledLaborAvgSalary,
  nonskilledLaborAvgSalary,
  image,
}: IWorkforceAndTalent) {

  const customLabelStyle: React.CSSProperties = {
    color: 'var(--colors-text-text-tertiary-600, #50555E)',
    fontFamily: '"General Sans"',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '21px',
  };

  return (
    <div className={propertyDetailStyles.flexLayout.reverseOnLarge}>
      <div className='lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {avaialbilityOfSkilledLabor && (
          <StatChartCard
            label={avaialbilityOfSkilledLabor.title}
            value={formatValueWithUnit(avaialbilityOfNonSkilledLabor.value, avaialbilityOfNonSkilledLabor.unit)}
            percentage={Number(avaialbilityOfNonSkilledLabor.value)}
            variant='wide'
          />
        )}

        {avaialbilityOfNonSkilledLabor && (
          <StatChartCard
            label={avaialbilityOfNonSkilledLabor.title}
            value={formatValueWithUnit(avaialbilityOfNonSkilledLabor.value, avaialbilityOfNonSkilledLabor.unit)}
            percentage={Number(avaialbilityOfNonSkilledLabor.value)}
            variant='wide'
          />
        )}

        {skilledLaborAvgSalary && (
          <StatCard
            label={skilledLaborAvgSalary.title}
            value={
              <span className='flex items-center gap-1'>
                <Icon name='sar' className='size-4 md:size-6' />
                {skilledLaborAvgSalary.value}
              </span>
            }
            variant='large'
            labelStyle={customLabelStyle}
          />
        )}

        {nonskilledLaborAvgSalary && (
          <StatCard
            label={nonskilledLaborAvgSalary.title}
            value={
              <span className='flex items-center gap-1'>
                <Icon name='sar' className='size-4 md:size-6' />
                {nonskilledLaborAvgSalary.value}
              </span>
            }
            variant='large'
            labelStyle={customLabelStyle}
          />
        )}
      </div>
      {image && (
        <img src={image} alt='Workforce and Talent' className={propertyDetailStyles.image.rounded} />
      )}
    </div>
  );
}
