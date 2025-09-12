import { StatCard } from '../UI/StatCard';
import { formatValueWithUnit, propertyDetailStyles } from '../../utils/propertyDetailUtils';
import { ILandAndFactoriesInfo } from '../../types/industrialCity';
import { Icon } from '@compass/shared-ui';

export function LandsFactoriesSection({
  title,
  totalLand,
  developedLand,
  undevelopedLand,
  occupancyRate,
  percentageOfLogisticLand,
  projectsUnderConstruction,
  noOfFactories,
  currentWorkforce,
}: ILandAndFactoriesInfo) {
  return (
    <>
      <h2 className={propertyDetailStyles.sectionTitleSmall}>
        {title}
      </h2>
      <div className={propertyDetailStyles.grid.threeColumns}>
        {totalLand && (
          <StatCard
            label={totalLand.title}
            value={formatValueWithUnit(totalLand.value, totalLand.unit)}
            icon={<Icon name='substract' className='size-8.5' />}
          />
        )}

        {developedLand && (
          <StatCard
            label={developedLand.title}
            value={formatValueWithUnit(developedLand.value, developedLand.unit)}
            icon={<Icon name='union' className='size-8.5' />}
          />
        )}

        {undevelopedLand && (
          <StatCard
            label={undevelopedLand.title}
            value={formatValueWithUnit(undevelopedLand.value, undevelopedLand.unit)}
            icon={<Icon name='intersect' className='size-8.5' />}
          />
        )}

        {occupancyRate && (
          <StatCard
            label={occupancyRate.title}
            value={formatValueWithUnit(occupancyRate.value, occupancyRate.unit)}
            icon={<Icon name='stats-up-square' className='size-8.5' />}
          />
        )}

        {percentageOfLogisticLand && (
          <StatCard
            label={percentageOfLogisticLand.title}
            value={formatValueWithUnit(percentageOfLogisticLand.value, percentageOfLogisticLand.unit)}
            icon={<Icon name='delivery-truck' className='size-8.5' />}
          />
        )}

        {projectsUnderConstruction && (
          <StatCard
            label={projectsUnderConstruction.title}
            value={formatValueWithUnit(projectsUnderConstruction.value)}
            icon={<Icon name='city' className='size-8.5' />}
          />
        )}
      </div>

      <div className={propertyDetailStyles.grid.twoColumns}>
        {noOfFactories && (
          <StatCard
            label={noOfFactories.title}
            value={formatValueWithUnit(noOfFactories.value)}
            variant='large'
            icon={<Icon name='industry' className='size-8.5' />}
          />
        )}

        {currentWorkforce && (
          <StatCard
            label={currentWorkforce.title}
            value={formatValueWithUnit(currentWorkforce.value)}
            variant='large'
            icon={<Icon name='community' className='size-8.5' />}
          />
        )}
      </div>
    </>
  );
}
