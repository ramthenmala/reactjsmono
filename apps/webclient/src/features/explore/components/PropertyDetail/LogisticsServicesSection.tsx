import { StatCard } from '../UI/StatCard';
import { Anchor, Plane, Train } from '@untitledui/icons';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';
import type { PropertyDetailComponentProps } from '../../types/industrialCity';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';

export function LogisticsServicesSection({
  industrialCity,
}: PropertyDetailComponentProps) {
  const { t } = useLocaleTranslation();
  return (
    <>
      <h2 className={propertyDetailStyles.sectionTitleSmall}>
        {t('property_detail.logistics_services')}
      </h2>
      <div className={propertyDetailStyles.grid.threeColumns}>
        {industrialCity.logisticsServices?.dryPort && (
          <StatCard
            label={industrialCity.logisticsServices.dryPort.name}
            value={industrialCity.logisticsServices.dryPort.distance}
            icon={<Anchor className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
          />
        )}
        {industrialCity.logisticsServices?.airport && (
          <StatCard
            label={industrialCity.logisticsServices.airport.name}
            value={industrialCity.logisticsServices.airport.distance}
            icon={<Plane className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
          />
        )}
        {industrialCity.logisticsServices?.railwayStation && (
          <StatCard
            className='col-span-2 md:col-span-1'
            label={industrialCity.logisticsServices.railwayStation.name}
            value={industrialCity.logisticsServices.railwayStation.distance}
            icon={<Train className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
          />
        )}
      </div>
      <div className={propertyDetailStyles.card.withPadding}>
        <h3 className={propertyDetailStyles.text.cardSubtitle}>
          {t('property_detail.nearby_logistic_centers')}
        </h3>
        <div className='flex flex-col md:flex-row gap-4'>
          {(industrialCity.logisticsServices?.nearbyLogisticCenters ?? []).map(
            (center: string, index: number) => (
              <div key={index} className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-purple-600 flex-shrink-0'></div>
                <div className='text-sm font-medium'>{center}</div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
