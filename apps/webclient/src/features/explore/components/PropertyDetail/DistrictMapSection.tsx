import { StatCard } from '../UI/StatCard';
import { BarChart } from '../Charts/BarChart';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';

interface DistrictMapSectionProps {
  industrialCity: any;
}

export function DistrictMapSection({
  industrialCity,
}: DistrictMapSectionProps) {
  const { t } = useLocaleTranslation();
  return (
    <div className="lg:w-5/12 flex flex-col gap-4">
      {industrialCity.districtMapAndDetails ? (
        <>
          <h2 className="text-md md:text-2xl font-semibold">
            {t('property_detail.district_map')}
          </h2>
          <div className="rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden">
            <img
              src={industrialCity.districtMapAndDetails}
              alt="District map"
              className="w-full h-auto"
            />
          </div>
        </>
      ) : null}
      <div className="grid grid-cols-2 gap-4">
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
      <div className="rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden flex flex-col gap-8 p-6">
        <h3 className="text-sm font-medium text-gray-600">
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
