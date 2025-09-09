import { StatChartCard } from '../Charts/StatChartCard';
import { StatCard } from '../UI/StatCard';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';
import type { PropertyDetailComponentProps } from '../../types/industrialCity';
import {
  extractPercentage,
  propertyDetailStyles,
} from '../../utils/propertyDetailUtils';

export function WorkforceTalentSection({
  industrialCity,
}: PropertyDetailComponentProps) {
  const { t } = useLocaleTranslation();

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
        {industrialCity.workforceTalent?.availabilityOfSkilleLabor && (
          <StatChartCard
            label={t('property_detail.skilled_labor_availability')}
            value={industrialCity.workforceTalent.availabilityOfSkilleLabor}
            percentage={extractPercentage(
              industrialCity.workforceTalent.availabilityOfSkilleLabor
            )}
            variant='wide'
          />
        )}
        {industrialCity.workforceTalent?.availabilityOfNonSkilleLabor && (
          <StatChartCard
            label={t('property_detail.non_skilled_labor_availability')}
            value={industrialCity.workforceTalent.availabilityOfNonSkilleLabor}
            percentage={extractPercentage(
              industrialCity.workforceTalent.availabilityOfNonSkilleLabor
            )}
            variant='wide'
          />
        )}
        {industrialCity.workforceTalent?.skilledLaborAvgSalary && (
          <StatCard
            label={t('property_detail.skilled_labor_salary')}
            value={industrialCity.workforceTalent.skilledLaborAvgSalary}
            variant='large'
            icon={<span className='size-4 md:size-6 text-brand-600'>SAR</span>}
            labelStyle={customLabelStyle}
          />
        )}
        {industrialCity.workforceTalent?.nonSkilledLaborAvgSalary && (
          <StatCard
            label={t('property_detail.non_skilled_labor_salary')}
            value={industrialCity.workforceTalent.nonSkilledLaborAvgSalary}
            variant='large'
            icon={<span className='size-4 md:size-6 text-brand-600'>SAR</span>}
            labelStyle={customLabelStyle}
          />
        )}
      </div>
      {industrialCity.workforceTalent?.image && (
        <img
          src={industrialCity.workforceTalent?.image}
          alt='Workforce and Talent'
          className={propertyDetailStyles.image.rounded}
        />
      )}
    </div>
  );
}
