import { StatCard } from '../UI/StatCard';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';

interface InfrastructureSectionProps {
  industrialCity: any;
}

export function InfrastructureSection({
  industrialCity,
}: InfrastructureSectionProps) {
  const { t } = useLocaleTranslation();
  return (
    <>
      <h2 className="text-md md:text-2xl font-semibold">
        {t('property_detail.infrastructure')}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {industrialCity.infrastructure?.totalElectricityCapacity && (
          <StatCard
            label={t('property_detail.total_electricity_capacity')}
            value={industrialCity.infrastructure.totalElectricityCapacity}
          />
        )}
        {industrialCity.infrastructure?.totalWaterCapacity && (
          <StatCard
            label={t('property_detail.total_water_capacity')}
            value={industrialCity.infrastructure.totalWaterCapacity}
          />
        )}
        {industrialCity.infrastructure?.totalGasCapacity && (
          <StatCard
            label={t('property_detail.total_gas_capacity')}
            value={industrialCity.infrastructure.totalGasCapacity}
          />
        )}
      </div>
    </>
  );
}
