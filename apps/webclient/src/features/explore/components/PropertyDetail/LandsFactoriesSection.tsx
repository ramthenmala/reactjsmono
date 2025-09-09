import { StatCard } from '../UI/StatCard';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';
import type { PropertyDetailComponentProps } from '../../types/industrialCity';
import { propertyDetailStyles } from '../../utils/propertyDetailUtils';
import { Zap, Drop, Settings01 } from '@untitledui/icons';

export function LandsFactoriesSection({
  industrialCity,
}: PropertyDetailComponentProps) {
  const { t } = useLocaleTranslation();
  return (
    <>
      <h2 className={propertyDetailStyles.sectionTitleSmall}>
        {t('property_detail.lands_factories')}
      </h2>
      <div className={propertyDetailStyles.grid.threeColumns}>
        {industrialCity.landsAndFactories?.totalLand && (
          <StatCard
            label={t('property_detail.total_land')}
            value={industrialCity.landsAndFactories.totalLand}
            icon={<Drop className='w-5 h-5' />}
          />
        )}
        {industrialCity.landsAndFactories?.developedLand && (
          <StatCard
            label={t('property_detail.developed_land')}
            value={industrialCity.landsAndFactories.developedLand}
            icon={<Drop className='w-5 h-5' />}
          />
        )}
        {industrialCity.landsAndFactories?.undevelopedLand && (
          <StatCard
            label={t('property_detail.undeveloped_land')}
            value={industrialCity.landsAndFactories.undevelopedLand}
            icon={<Drop className='w-5 h-5' />}
          />
        )}
        {industrialCity.landsAndFactories?.occupancyRate && (
          <StatCard
            label={t('property_detail.occupancy_rate')}
            value={industrialCity.landsAndFactories.occupancyRate}
            icon={<Zap className='w-5 h-5' />}
          />
        )}
        {industrialCity.landsAndFactories?.logisticLandPercentage && (
          <StatCard
            label={t('property_detail.logistic_land_percentage')}
            value={industrialCity.landsAndFactories.logisticLandPercentage}
            icon={<Zap className='w-5 h-5' />}
          />
        )}
        {industrialCity.landsAndFactories?.projectsUnderConstruction && (
          <StatCard
            label={t('property_detail.projects_under_construction')}
            value={industrialCity.landsAndFactories.projectsUnderConstruction}
            icon={<Settings01 className='w-5 h-5' />}
          />
        )}
      </div>
      <div className={propertyDetailStyles.grid.twoColumns}>
        {industrialCity.landsAndFactories?.numberOfFactories && (
          <StatCard
            label={t('property_detail.number_of_factories')}
            value={industrialCity.landsAndFactories.numberOfFactories}
            variant='large'
            icon={<Settings01 className='w-6 h-6' />}
          />
        )}
        {industrialCity.landsAndFactories?.currentWorkforce && (
          <StatCard
            label={t('property_detail.current_workforce')}
            value={industrialCity.landsAndFactories.currentWorkforce}
            variant='large'
            icon={<Settings01 className='w-6 h-6' />}
          />
        )}
      </div>
    </>
  );
}
