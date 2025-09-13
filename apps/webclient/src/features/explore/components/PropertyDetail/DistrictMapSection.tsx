import { StatCard } from '../UI/StatCard';
import { BarChart } from '../Charts/BarChart';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';
import type { IDistrictMapSectionProps } from '../../types/industrialCity';

export function DistrictMapSection({
  mapInfo,
  yearInfo,
  districtInfo,
  industriesInsideGraphInfo,
  'data-qa-id': dataQaId = 'district-map-section',
}: IDistrictMapSectionProps) {
  return (
    <div 
      className='lg:w-5/12 flex flex-col gap-4'
      data-qa-id={dataQaId}
    >
      {mapInfo?.map && (
        <div data-qa-id={`${dataQaId}-map-container`}>
          <h2 
            className={propertyDetailStyles.sectionTitleSmall}
            data-qa-id={`${dataQaId}-map-title`}
          >
            {mapInfo.title}
          </h2>
          <div 
            className={propertyDetailStyles.card.container}
            data-qa-id={`${dataQaId}-map-card`}
          >
            <img
              src={mapInfo.map}
              alt='District map'
              className='w-full h-auto'
              data-qa-id={`${dataQaId}-map-image`}
            />
          </div>
        </div>
      )}
      <div 
        className={propertyDetailStyles.grid.twoColumns}
        data-qa-id={`${dataQaId}-stats`}
      >
        <StatCard
          label={yearInfo?.title}
          value={yearInfo?.value}
          variant='large'
          data-qa-id={`${dataQaId}-year-stat`}
        />
        <StatCard
          label={districtInfo?.title}
          value={districtInfo?.value}
          variant='regular'
          data-qa-id={`${dataQaId}-district-stat`}
        />
      </div>
      <div 
        className={propertyDetailStyles.card.withPadding}
        data-qa-id={`${dataQaId}-industries-chart`}
      >
        <h3 
          className={propertyDetailStyles.text.cardSubtitle}
          data-qa-id={`${dataQaId}-industries-title`}
        >
          {industriesInsideGraphInfo?.title}
        </h3>
        <BarChart 
          data={industriesInsideGraphInfo?.value || []} 
          data-qa-id={`${dataQaId}-industries-chart-component`}
        />
      </div>
    </div>
  );
}
