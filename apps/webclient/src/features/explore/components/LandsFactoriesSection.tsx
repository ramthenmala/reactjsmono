"use client";

import { StatCard } from "./StatCard";
import { useLocaleTranslation } from '../../../shared/lib/i18n';

interface LandsFactoriesSectionProps {
  industrialCity: any;
}

export function LandsFactoriesSection({ industrialCity }: LandsFactoriesSectionProps) {
  const { t } = useLocaleTranslation();
  return (
    <>
      <h2 className="text-md md:text-2xl font-semibold">
        {t('property_detail.lands_factories')}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {industrialCity.landsAndFactories?.totalLand ? (
          <StatCard label={t('property_detail.total_land')} value={industrialCity.landsAndFactories.totalLand} />
        ) : industrialCity.totalArea ? (
          <StatCard label={t('property_detail.total_area') || 'Total Area'} value={industrialCity.totalArea} />
        ) : industrialCity.area ? (
          <StatCard label={t('property_detail.total_area') || 'Total Area'} value={`${industrialCity.area.toLocaleString()} m²`} />
        ) : null}
        
        {industrialCity.landsAndFactories?.developedLand && (
          <StatCard label={t('property_detail.developed_land')} value={industrialCity.landsAndFactories.developedLand} />
        )}
        {industrialCity.landsAndFactories?.undevelopedLand && (
          <StatCard label={t('property_detail.undeveloped_land')} value={industrialCity.landsAndFactories.undevelopedLand} />
        )}
        {industrialCity.landsAndFactories?.occupancyRate && (
          <StatCard label={t('property_detail.occupancy_rate')} value={industrialCity.landsAndFactories.occupancyRate} />
        )}
        {industrialCity.landsAndFactories?.logisticLandPercentage && (
          <StatCard label={t('property_detail.logistic_land_percentage')} value={industrialCity.landsAndFactories.logisticLandPercentage} />
        )}
        {industrialCity.landsAndFactories?.projectsUnderConstruction && (
          <StatCard label={t('property_detail.projects_under_construction')} value={industrialCity.landsAndFactories.projectsUnderConstruction} />
        )}
        
        {/* Fallback data from basic property info */}
        {!industrialCity.landsAndFactories && (
          <>
            {industrialCity.electricity && (
              <StatCard label="Electricity Capacity" value={industrialCity.electricity} />
            )}
            {industrialCity.water && (
              <StatCard label="Water Supply" value={industrialCity.water} />
            )}
            {industrialCity.gas && (
              <StatCard label="Gas Supply" value={industrialCity.gas} />
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {industrialCity.landsAndFactories?.numberOfFactories && (
          <StatCard
            label={t('property_detail.number_of_factories')}
            value={industrialCity.landsAndFactories.numberOfFactories}
            variant="large"
          />
        )}
        {industrialCity.landsAndFactories?.currentWorkforce && (
          <StatCard
            label={t('property_detail.current_workforce')}
            value={industrialCity.landsAndFactories.currentWorkforce}
            variant="large"
          />
        )}
      </div>
    </>
  );
}