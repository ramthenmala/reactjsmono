import { StatCard } from '../UI/StatCard';
import { BarChart } from '../Charts/BarChart';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';
import type { PropertyDetailComponentProps } from '../../types/industrialCity';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';

export function DistrictMapSection({
  industrialCity,
}: PropertyDetailComponentProps) {
  const { t } = useLocaleTranslation();
  return (
    <div className="lg:w-5/12 flex flex-col gap-4">
      <h2 className={propertyDetailStyles.sectionTitleSmall}>
        {t('property_detail.district_map') || 'District Map'}
      </h2>
      <div className={propertyDetailStyles.card.container}>
        {industrialCity.districtMapAndDetails ? (
          <img
            src={industrialCity.districtMapAndDetails}
            alt="District map"
            className="w-full h-auto"
          />
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6m-6 4h.01M21 16.5h.01M5 5.5h18m-9-2V2m9-2v2m9 4v18a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h18m-9 2V2" />
              </svg>
              <p className="text-sm">District map not available</p>
            </div>
          </div>
        )}
      </div>
      <div className={propertyDetailStyles.grid.twoColumns}>
        <StatCard
          label={t('property_detail.establishment_year')}
          value={industrialCity.estYear}
          variant="large"
        />
        <StatCard
          label={t('property_detail.district')}
          value={industrialCity.district}
          variant="regular"
        />
      </div>
      <div className={propertyDetailStyles.card.withPadding}>
        <h3 className={propertyDetailStyles.text.cardSubtitle}>
          {t('property_detail.industries_inside')} {industrialCity.name}
        </h3>
        {(() => {
          // Todo: Replace with API data once api available
          const industries = [
            { label: 'Chemicals', quantity: 15 },
            { label: 'Metals', quantity: 16 },
            { label: 'Machinery & Equipment', quantity: 9 },
            { label: 'Pharma', quantity: 19 },
            { label: 'Building Materials', quantity: 7 },
          ];
          return <BarChart data={industries} />;
        })()}
      </div>
    </div>
  );
}
