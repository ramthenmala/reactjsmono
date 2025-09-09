import { StatChartCard } from '../Charts/StatChartCard';
import { StatCard } from '../UI/StatCard';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';

interface WorkforceTalentSectionProps {
  industrialCity: any;
}

// Helper function to extract percentage value from string
function extractPercentage(value: string | undefined | null): number {
  if (!value) return 0;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export function WorkforceTalentSection({
  industrialCity,
}: WorkforceTalentSectionProps) {
  const { t } = useLocaleTranslation();
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-10">
      <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {industrialCity.workforceTalent?.availabilityOfSkilleLabor && (
          <StatChartCard
            label={t('property_detail.skilled_labor_availability')}
            value={industrialCity.workforceTalent.availabilityOfSkilleLabor}
            percentage={extractPercentage(
              industrialCity.workforceTalent.availabilityOfSkilleLabor
            )}
            variant="wide"
          />
        )}
        {industrialCity.workforceTalent?.availabilityOfNonSkilleLabor && (
          <StatChartCard
            label={t('property_detail.non_skilled_labor_availability')}
            value={industrialCity.workforceTalent.availabilityOfNonSkilleLabor}
            percentage={extractPercentage(
              industrialCity.workforceTalent.availabilityOfNonSkilleLabor
            )}
            variant="wide"
          />
        )}
        {industrialCity.workforceTalent?.skilledLaborAvgSalary && (
          <StatCard
            label={t('property_detail.skilled_labor_salary')}
            value={industrialCity.workforceTalent.skilledLaborAvgSalary}
            variant="large"
            icon={<span className="size-4 md:size-6 text-brand-600">SAR</span>}
          />
        )}
        {industrialCity.workforceTalent?.nonSkilledLaborAvgSalary && (
          <StatCard
            label={t('property_detail.non_skilled_labor_salary')}
            value={industrialCity.workforceTalent.nonSkilledLaborAvgSalary}
            variant="large"
            icon={<span className="size-4 md:size-6 text-brand-600">SAR</span>}
          />
        )}
      </div>
      {industrialCity.workforceTalent?.image && (
        <img
          src={industrialCity.workforceTalent?.image}
          alt="Workforce and Talent"
          className="lg:w-5/12 h-auto rounded-2xl"
        />
      )}
    </div>
  );
}
