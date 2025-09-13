import { StatCard } from '../UI/StatCard';
import { formatValueWithUnit, propertyDetailStyles } from '../../utils/propertyDetailUtils';
import type { ILandsFactoriesSectionProps } from '../../types/industrialCity';
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
  'data-qa-id': dataQaId = 'lands-factories-section',
}: ILandsFactoriesSectionProps) {
  return (
    <div data-qa-id={dataQaId}>
      <h2 
        className={propertyDetailStyles.sectionTitleSmall}
        data-qa-id={`${dataQaId}-title`}
      >
        {title}
      </h2>
      <div 
        className={propertyDetailStyles.grid.threeColumns}
        data-qa-id={`${dataQaId}-primary-stats`}
      >
        {totalLand && (
          <StatCard
            label={totalLand.title}
            value={formatValueWithUnit(totalLand.value, totalLand.unit)}
            icon={<Icon name='substract' className='size-8.5' />}
            data-qa-id={`${dataQaId}-total-land`}
          />
        )}

        {developedLand && (
          <StatCard
            label={developedLand.title}
            value={formatValueWithUnit(developedLand.value, developedLand.unit)}
            icon={<Icon name='union' className='size-8.5' />}
            data-qa-id={`${dataQaId}-developed-land`}
          />
        )}

        {undevelopedLand && (
          <StatCard
            label={undevelopedLand.title}
            value={formatValueWithUnit(undevelopedLand.value, undevelopedLand.unit)}
            icon={<Icon name='intersect' className='size-8.5' />}
            data-qa-id={`${dataQaId}-undeveloped-land`}
          />
        )}

        {occupancyRate && (
          <StatCard
            label={occupancyRate.title}
            value={formatValueWithUnit(occupancyRate.value, occupancyRate.unit)}
            icon={<Icon name='stats-up-square' className='size-8.5' />}
            data-qa-id={`${dataQaId}-occupancy-rate`}
          />
        )}

        {percentageOfLogisticLand && (
          <StatCard
            label={percentageOfLogisticLand.title}
            value={formatValueWithUnit(percentageOfLogisticLand.value, percentageOfLogisticLand.unit)}
            icon={<Icon name='delivery-truck' className='size-8.5' />}
            data-qa-id={`${dataQaId}-logistic-land`}
          />
        )}

        {projectsUnderConstruction && (
          <StatCard
            label={projectsUnderConstruction.title}
            value={formatValueWithUnit(projectsUnderConstruction.value)}
            icon={<Icon name='city' className='size-8.5' />}
            data-qa-id={`${dataQaId}-projects-construction`}
          />
        )}
      </div>

      <div 
        className={propertyDetailStyles.grid.twoColumns}
        data-qa-id={`${dataQaId}-secondary-stats`}
      >
        {noOfFactories && (
          <StatCard
            label={noOfFactories.title}
            value={formatValueWithUnit(noOfFactories.value)}
            variant='large'
            icon={<Icon name='industry' className='size-8.5' />}
            data-qa-id={`${dataQaId}-factories-count`}
          />
        )}

        {currentWorkforce && (
          <StatCard
            label={currentWorkforce.title}
            value={formatValueWithUnit(currentWorkforce.value)}
            variant='large'
            icon={<Icon name='community' className='size-8.5' />}
            data-qa-id={`${dataQaId}-current-workforce`}
          />
        )}
      </div>
    </div>
  );
}
