import React, { memo, useMemo, useCallback } from 'react';
import { Button, Icon } from '@compass/shared-ui';
import { useLocaleTranslation } from '@/i18n';
import {
  Zap,
  Drop,
  Anchor,
  Train,
  Plane,
  MarkerPin02,
} from '@untitledui/icons';
import { IPropertyCardProps } from '@/features/explore/types/explore';
import { propertyCardStyles } from './styles';

// Featured badge component
const FeaturedBadge = memo(({ text, dataQaId }: { text: string; dataQaId?: string }) => (
  <div className={propertyCardStyles.featuredBadge} data-qa-id={dataQaId}>
    <Button
      size='sm'
      color='secondary'
      className={propertyCardStyles.featuredButton}
      data-qa-id={`${dataQaId}-button`}
    >
      <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none' />
      <span className='relative z-10 text-xs font-medium'>{text}</span>
    </Button>
  </div>
));
FeaturedBadge.displayName = 'FeaturedBadge';

// Metric row component
const MetricRow = memo(
  ({
    icon,
    label,
    value,
    showSeparator = true,
    dataQaId,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    showSeparator?: boolean;
    dataQaId?: string;
  }) => (
    <div data-qa-id={dataQaId}>
      <div className={propertyCardStyles.metricRow} data-qa-id={`${dataQaId}-row`}>
        <span className={propertyCardStyles.metricLabel} data-qa-id={`${dataQaId}-label`}>
          {icon}
          {label}
        </span>
        <span className={propertyCardStyles.metricValue} data-qa-id={`${dataQaId}-value`}>{value}</span>
      </div>
      {showSeparator && <hr className={propertyCardStyles.separator} data-qa-id={`${dataQaId}-separator`} />}
    </div>
  ),
);
MetricRow.displayName = 'MetricRow';

// Distance card component
const DistanceCard = memo(
  ({ icon, distance, dataQaId }: { icon: React.ReactNode; distance: string; dataQaId?: string }) => (
    <div className={propertyCardStyles.distanceCard} data-qa-id={dataQaId}>
      {icon}
      <span className='whitespace-nowrap' data-qa-id={`${dataQaId}-text`}>{distance}</span>
    </div>
  ),
);
DistanceCard.displayName = 'DistanceCard';

export const PropertyCard = memo(
  ({
    property,
    onCompare,
    onView,
    hideDistance = false,
    'data-qa-id': dataQaId = 'property-card',
  }: IPropertyCardProps) => {
    const { t } = useLocaleTranslation();

    // Memoize formatter function
    const formatNumber = useMemo(
      () => (num: number) => new Intl.NumberFormat('en-US').format(num),
      [],
    );

    // Memoize computed values
    const formattedArea = useMemo(
      () => `${formatNumber(property.area)} km²`,
      [property.area, formatNumber],
    );

    // API already provides values with units, so use them directly
    const formattedElectricity = useMemo(
      () => property.electricity || null,
      [property.electricity],
    );
    const formattedGas = useMemo(() => property.gas || null, [property.gas]);
    const formattedWater = useMemo(
      () => property.water || null,
      [property.water],
    );

    // Memoize event handlers
    const handleCompare = useCallback(
      () => onCompare?.(property),
      [onCompare, property],
    );
    const handleView = useCallback(
      () => onView?.(property),
      [onView, property],
    );

    return (
      <article className={propertyCardStyles.container} data-qa-id={dataQaId}>
        {/* Property Image & overlays */}
        <div className={propertyCardStyles.imageContainer} data-qa-id={`${dataQaId}-image-container`}>
          <img
            src={property.image || '/assets/images/properties/placeholder.png'}
            alt={property.title}
            className={propertyCardStyles.image}
            loading='lazy'
            data-qa-id={`${dataQaId}-image`}
          />
          <div className={propertyCardStyles.imageOverlay} data-qa-id={`${dataQaId}-image-overlay`} />

          {/* Featured Badge */}
          {property.featured && (
            <FeaturedBadge text={t('common.featured') || 'Featured'} dataQaId={`${dataQaId}-featured-badge`} />
          )}
        </div>

        {/* Property Info */}
        <div
          className={propertyCardStyles.content}
          style={{
            background:
              'radial-gradient(73.04% 54.31% at 50% 0%, rgba(237, 230, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
          }}
          data-qa-id={`${dataQaId}-content`}
        >
          {/* Title */}
          <div className={propertyCardStyles.titleContainer} data-qa-id={`${dataQaId}-title-container`}>
            <h3 className={propertyCardStyles.title} data-qa-id={`${dataQaId}-title`}>{property.title}</h3>
          </div>

          {/* Bottom Section: Area/Location + Metrics */}
          <div className={propertyCardStyles.bottomSection} data-qa-id={`${dataQaId}-bottom-section`}>
            {/* Area and Location */}
            <div className={propertyCardStyles.areaLocationRow} data-qa-id={`${dataQaId}-area-location`}>
              <span className={propertyCardStyles.areaText} data-qa-id={`${dataQaId}-area`}>
                {formattedArea}
              </span>
              <span className={propertyCardStyles.locationText} data-qa-id={`${dataQaId}-location`}>
                <MarkerPin02 className={propertyCardStyles.icons.small} data-qa-id={`${dataQaId}-location-icon`} />
                <span data-qa-id={`${dataQaId}-city`}>{property.city}</span>
              </span>
            </div>

            {/* Metrics */}
            <div className={propertyCardStyles.metricsContainer} data-qa-id={`${dataQaId}-metrics`}>
              {formattedElectricity && (
                <MetricRow
                  icon={<Zap className={propertyCardStyles.icons.primary} data-qa-id={`${dataQaId}-electricity-icon`} />}
                  label={t('property.electricity') || 'Electricity'}
                  value={formattedElectricity}
                  dataQaId={`${dataQaId}-electricity`}
                />
              )}

              {formattedGas && (
                <MetricRow
                  icon={<Icon name="fire" size={20} color="#5547B5" data-qa-id={`${dataQaId}-gas-icon`} />}
                  label={t('property.gas') || 'Gas'}
                  value={formattedGas}
                  dataQaId={`${dataQaId}-gas`}
                />
              )}

              {formattedWater && (
                <MetricRow
                  icon={<Drop className={propertyCardStyles.icons.primary} data-qa-id={`${dataQaId}-water-icon`} />}
                  label={t('property.water') || 'Water'}
                  value={formattedWater}
                  showSeparator={false}
                  dataQaId={`${dataQaId}-water`}
                />
              )}
            </div>
          </div>

          {/* Distance Information */}
          {!hideDistance && (
            <div className={propertyCardStyles.distanceGrid} data-qa-id={`${dataQaId}-distance-grid`}>
              <DistanceCard
                icon={<Anchor className={propertyCardStyles.icons.shrink} data-qa-id={`${dataQaId}-seaport-icon`} />}
                distance='75 km'
                dataQaId={`${dataQaId}-seaport-distance`}
              />
              <DistanceCard
                icon={<Train className={propertyCardStyles.icons.shrink} data-qa-id={`${dataQaId}-railway-icon`} />}
                distance='102 km'
                dataQaId={`${dataQaId}-railway-distance`}
              />
              <DistanceCard
                icon={<Plane className={propertyCardStyles.icons.shrink} data-qa-id={`${dataQaId}-airport-icon`} />}
                distance='62 km'
                dataQaId={`${dataQaId}-airport-distance`}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className={propertyCardStyles.buttonGrid} data-qa-id={`${dataQaId}-buttons`}>
            <Button
              size='lg'
              color='secondary'
              onClick={handleCompare}
              className='w-full h-12 rounded-xl px-[18px] border border-gray-200 bg-white text-[#171B23] font-semibold text-base leading-6 tracking-normal shadow-sm hover:bg-gray-50 active:bg-gray-100'
              aria-label={`Compare ${property.title}`}
              data-qa-id={`${dataQaId}-compare-button`}
            >
              {t('common.compare') || 'Compare'}
            </Button>

            <Button
              size='lg'
              color='primary'
              onClick={handleView}
              className='w-full h-12 rounded-xl px-[18px] text-white font-semibold text-base leading-6 tracking-normal shadow-sm bg-[linear-gradient(90deg,#5547B5_0%,#695DC2_100%)] hover:brightness-105 active:brightness-95'
              aria-label={`View details for ${property.title}`}
              data-qa-id={`${dataQaId}-view-button`}
            >
              {t('common.view') || 'View'}
            </Button>
          </div>
        </div>
      </article>
    );
  },
);

PropertyCard.displayName = 'PropertyCard';
