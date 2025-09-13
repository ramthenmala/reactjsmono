import { StatCard } from '../UI/StatCard';
import { Anchor, Plane, Train } from '@untitledui/icons';
import { useLocaleTranslation } from '../../../../i18n';
import { formatValueWithUnit, propertyDetailStyles } from '../../utils/propertyDetailUtils';
import type { ILogisticsServicesSectionProps } from '../../types/industrialCity';

export function LogisticsServicesSection({
  logisticsServicesInfo,
  nearByLogisticCentersInfo,
  'data-qa-id': dataQaId = 'logistics-services-section',
}: ILogisticsServicesSectionProps) {
  const { t } = useLocaleTranslation();
  return (
    <div data-qa-id={dataQaId}>
      <h2 
        className={propertyDetailStyles.sectionTitleSmall}
        data-qa-id={`${dataQaId}-title`}
      >
        {logisticsServicesInfo.title}
      </h2>
      <div 
        className={propertyDetailStyles.grid.threeColumns}
        data-qa-id={`${dataQaId}-services`}
      >
        {logisticsServicesInfo?.value?.dryPort && (
          <StatCard
            label={t('property_detail.dry_port')}
            value={logisticsServicesInfo.value.dryPort}
            icon={<Anchor className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
            data-qa-id={`${dataQaId}-dry-port`}
          />
        )}

        {logisticsServicesInfo?.value?.airport?.name && (
          <StatCard
            label={logisticsServicesInfo.value.airport.name || ''}
            value={
              logisticsServicesInfo.value.airport.distance
                ? formatValueWithUnit(logisticsServicesInfo.value.airport.distance, logisticsServicesInfo.value.airport.unit)
                : undefined
            }
            icon={<Plane className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
            data-qa-id={`${dataQaId}-airport`}
          />
        )}

        {logisticsServicesInfo?.value?.railwayStation?.name && (
          <StatCard
            className='col-span-2 md:col-span-1'
            label={logisticsServicesInfo.value.railwayStation.name || ''}
            value={
              logisticsServicesInfo.value.railwayStation.distance
                ? formatValueWithUnit(logisticsServicesInfo.value.railwayStation.distance, logisticsServicesInfo.value.railwayStation.unit)
                : undefined
            }
            icon={<Train className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
            data-qa-id={`${dataQaId}-railway`}
          />
        )}
        {logisticsServicesInfo?.value?.neartestSeaport?.name && (
          <StatCard
            label={logisticsServicesInfo.value.neartestSeaport.name || ''}
            value={
              logisticsServicesInfo.value.neartestSeaport.distance
                ? formatValueWithUnit(logisticsServicesInfo.value.neartestSeaport.distance, logisticsServicesInfo.value.neartestSeaport.unit)
                : undefined
            }
            icon={<Anchor className='w-6 h-6 text-[#695DC2]' />}
            variant='logistics'
            data-qa-id={`${dataQaId}-seaport`}
          />
        )}
      </div>
      <div 
        className={propertyDetailStyles.card.withPadding}
        data-qa-id={`${dataQaId}-centers-card`}
      >
        <h3 
          className={propertyDetailStyles.text.cardSubtitle}
          data-qa-id={`${dataQaId}-centers-title`}
        >
          {nearByLogisticCentersInfo.title}
        </h3>
        <div 
          className='flex flex-col md:flex-row gap-4'
          data-qa-id={`${dataQaId}-centers-list`}
        >
          {(nearByLogisticCentersInfo?.value ?? []).map((center: string, index: number) => (
            <div 
              key={index} 
              className='flex items-center gap-2'
              data-qa-id={`${dataQaId}-center-${index}`}
            >
              <div className='w-2 h-2 rounded-full bg-purple-600 flex-shrink-0'></div>
              <div className='text-sm font-medium'>{center}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
