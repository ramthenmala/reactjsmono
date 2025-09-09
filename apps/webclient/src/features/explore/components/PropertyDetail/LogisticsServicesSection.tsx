import { StatCard } from '../UI/StatCard';
import { Anchor, Plane, Train } from '@untitledui/icons';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';

interface LogisticsServicesSectionProps {
  industrialCity: any;
}

export function LogisticsServicesSection({
  industrialCity,
}: LogisticsServicesSectionProps) {
  const { t } = useLocaleTranslation();
  return (
    <>
      <h2 className="text-md md:text-2xl font-semibold">
        {t('property_detail.logistics_services')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {industrialCity.logisticsServices?.dryPort && (
          <StatCard
            label={industrialCity.logisticsServices.dryPort.name}
            value={industrialCity.logisticsServices.dryPort.distance}
            icon={<Anchor className="w-6 h-6 text-brand-600" />}
          />
        )}
        {industrialCity.logisticsServices?.airport && (
          <StatCard
            label={industrialCity.logisticsServices.airport.name}
            value={industrialCity.logisticsServices.airport.distance}
            icon={<Plane className="w-6 h-6 text-brand-600" />}
          />
        )}
        {industrialCity.logisticsServices?.railwayStation && (
          <StatCard
            className="col-span-2 md:col-span-1"
            label={industrialCity.logisticsServices.railwayStation.name}
            value={industrialCity.logisticsServices.railwayStation.distance}
            icon={<Train className="w-6 h-6 text-brand-600" />}
          />
        )}
      </div>
      <div className="rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden flex flex-col gap-4 md:gap-8 p-6">
        <h3 className="text-sm font-medium text-gray-600">
          {t('property_detail.nearby_logistic_centers')}
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          {(industrialCity.logisticsServices?.nearbyLogisticCenters ?? []).map(
            (center: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0"></div>
                <div className="text-sm font-medium">{center}</div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
