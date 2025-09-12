import { StatCard } from '../UI/StatCard';
import { BarChart } from '../Charts/BarChart';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';

import { IDistrictMapSectionProps } from '../../types/industrialCity';

export function DistrictMapSection({
  mapInfo,
  yearInfo,
  districtInfo,
  industriesInsideGraphInfo,
}: IDistrictMapSectionProps) {
  return (
    <div className='lg:w-5/12 flex flex-col gap-4'>
      {mapInfo?.map && (<>
        <h2 className={propertyDetailStyles.sectionTitleSmall}>
          {mapInfo.title}
        </h2>
        <div className={propertyDetailStyles.card.container}>

            <img
              src={mapInfo.map}
              alt='District map'
              className='w-full h-auto'
            />
        </div>
      </>)}
      <div className={propertyDetailStyles.grid.twoColumns}>
        <StatCard
          label={yearInfo?.title}
          value={yearInfo?.value}
          variant='large'
        />
        <StatCard
          label={districtInfo?.title}
          value={districtInfo?.value}
          variant='regular'
        />
      </div>
      <div className={propertyDetailStyles.card.withPadding}>
        <h3 className={propertyDetailStyles.text.cardSubtitle}>
          {industriesInsideGraphInfo?.title}
        </h3>
        <BarChart data={industriesInsideGraphInfo?.value || []} />
      </div>
    </div>
  );
}
