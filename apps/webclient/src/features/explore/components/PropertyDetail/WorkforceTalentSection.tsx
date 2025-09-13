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
  'data-qa-id': dataQaId = 'workforce-talent',
}: IWorkforceAndTalent) {
  return (
    <div 
      className={propertyDetailStyles.flexLayout.reverseOnLarge}
      data-qa-id={dataQaId}
    >
      <div 
        className='lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-4'
        data-qa-id={`${dataQaId}-stats`}
      >
        {avaialbilityOfSkilledLabor && (
          <StatChartCard
            label={avaialbilityOfSkilledLabor.title}
            value={formatValueWithUnit(avaialbilityOfSkilledLabor.value, avaialbilityOfSkilledLabor.unit)}
            percentage={Number(avaialbilityOfSkilledLabor.value)}
            variant='wide'
            data-qa-id={`${dataQaId}-skilled-availability`}
          />
        )}

        {avaialbilityOfNonSkilledLabor && (
          <StatChartCard
            label={avaialbilityOfNonSkilledLabor.title}
            value={formatValueWithUnit(avaialbilityOfNonSkilledLabor.value, avaialbilityOfNonSkilledLabor.unit)}
            percentage={Number(avaialbilityOfNonSkilledLabor.value)}
            variant='wide'
            data-qa-id={`${dataQaId}-non-skilled-availability`}
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
            data-qa-id={`${dataQaId}-skilled-salary`}
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
            data-qa-id={`${dataQaId}-non-skilled-salary`}
          />
        )}
      </div>
      {image && (
        <img 
          src={image} 
          alt='Workforce and Talent' 
          className={propertyDetailStyles.image.rounded}
          data-qa-id={`${dataQaId}-image`}
        />
      )}
    </div>
  );
}
