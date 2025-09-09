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
      {industrialCity.districtMapAndDetails ? (
        <>
          <h2 className={propertyDetailStyles.sectionTitleSmall}>
            {t('property_detail.district_map')}
          </h2>
          <div className={propertyDetailStyles.card.container}>
            <img
              src={industrialCity.districtMapAndDetails}
              alt="District map"
              className="w-full h-auto"
            />
          </div>
        </>
      ) : null}
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
