"use client";

import { StatCard } from "./StatCard";
import { BarChart } from "./BarChart";
import { useLocaleTranslation } from '../../../shared/lib/i18n';

interface DistrictMapSectionProps {
  industrialCity: any;
}

export function DistrictMapSection({ industrialCity }: DistrictMapSectionProps) {
  const { t } = useLocaleTranslation();
  
  return (
    <div className="lg:w-5/12 flex flex-col gap-4">
      <h2 className="text-md md:text-2xl font-semibold">
        {t('property_detail.district_map_and_details') || 'District Map and Details'}
      </h2>
      
      {/* District Map */}
      <div className="rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden">
        {industrialCity.districtMapAndDetails || industrialCity.image ? (
          <img
            src={industrialCity.districtMapAndDetails || industrialCity.image}
            alt="District map"
            width={1200}
            height={900}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              <p className="mt-2 text-sm">District map not available</p>
            </div>
          </div>
        )}
      </div>
      
      {/* District Details */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label={t('property_detail.establishment_year') || 'Establishment Year'}
          value={industrialCity.establishmentYear || industrialCity.established || '1973'}
          variant="large"
        />
        <StatCard
          label={t('property_detail.district_name') || 'District Name'}
          value={`${industrialCity.title || industrialCity.city || industrialCity.name || 'Industrial'} District`}
          variant="regular"
        />
      </div>
      
      <div className="rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden flex flex-col gap-8 p-6">
        <h3 className="text-sm font-medium text-gray-600">
{t('property_detail.industries_inside') || 'Sector Distribution'} - {industrialCity.title || industrialCity.name || industrialCity.city} 
        </h3>
        {(() => {
          // Mock industry data - replace with API data once available
          const industries = [
            { label: 'Chemicals', quantity: 32 },
            { label: 'Metals', quantity: 28 },
            { label: 'M&E', quantity: 22 },
            { label: 'Pharma', quantity: 18 },
            { label: 'Building Materials', quantity: 12 },
          ];
          return <BarChart data={industries} />;
        })()}
      </div>
    </div>
  );
}