import React, { memo, useMemo, useCallback } from 'react';
import { Button } from '@compass/shared-ui';
import { useLocaleTranslation } from '@/shared/lib/i18n';
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

// Fire icon component for better performance
const FireIcon = memo(() => (
  <div className={propertyCardStyles.icons.fire}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="text-[#5547B5]"
    >
      <path
        d="M10 2L8.5 4.5L6 6L8.5 7.5L10 10L11.5 7.5L14 6L11.5 4.5L10 2Z"
        fill="currentColor"
      />
      <path
        d="M6 8L5 9.5L3.5 10.5L5 11.5L6 13L7 11.5L8.5 10.5L7 9.5L6 8Z"
        fill="currentColor"
      />
      <path
        d="M14 8L13 9.5L11.5 10.5L13 11.5L14 13L15 11.5L16.5 10.5L15 9.5L14 8Z"
        fill="currentColor"
      />
      <path
        d="M10 12L9 13.5L7.5 14.5L9 15.5L10 17L11 15.5L12.5 14.5L11 13.5L10 12Z"
        fill="currentColor"
      />
    </svg>
  </div>
));
FireIcon.displayName = 'FireIcon';

// Featured badge component
const FeaturedBadge = memo(({ text }: { text: string }) => (
  <div className={propertyCardStyles.featuredBadge}>
    <Button
      size="sm"
      color="secondary"
      className={propertyCardStyles.featuredButton}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <span className="relative z-10 text-xs font-medium">{text}</span>
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
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    showSeparator?: boolean;
  }) => (
    <div>
      <div className={propertyCardStyles.metricRow}>
        <span className={propertyCardStyles.metricLabel}>
          {icon}
          {label}
        </span>
        <span className={propertyCardStyles.metricValue}>{value}</span>
      </div>
      {showSeparator && <hr className={propertyCardStyles.separator} />}
    </div>
  )
);
MetricRow.displayName = 'MetricRow';

// Distance card component
const DistanceCard = memo(
  ({ icon, distance }: { icon: React.ReactNode; distance: string }) => (
    <div className={propertyCardStyles.distanceCard}>
      {icon}
      <span className="whitespace-nowrap">{distance}</span>
    </div>
  )
);
DistanceCard.displayName = 'DistanceCard';

export const PropertyCard = memo(
  ({
    property,
    onCompare,
    onView,
    hideDistance = false,
  }: IPropertyCardProps) => {
    const { t } = useLocaleTranslation();

    // Memoize formatter function
    const formatNumber = useMemo(
      () => (num: number) => new Intl.NumberFormat('en-US').format(num),
      []
    );

    // Memoize computed values
    const formattedArea = useMemo(
      () => `${formatNumber(property.area)} km²`,
      [property.area, formatNumber]
    );

    // API already provides values with units, so use them directly
    const formattedElectricity = useMemo(
      () => property.electricity || null,
      [property.electricity]
    );
    const formattedGas = useMemo(() => property.gas || null, [property.gas]);
    const formattedWater = useMemo(
      () => property.water || null,
      [property.water]
    );

    // Memoize event handlers
    const handleCompare = useCallback(
      () => onCompare?.(property),
      [onCompare, property]
    );
    const handleView = useCallback(
      () => onView?.(property),
      [onView, property]
    );

    return (
      <article className={propertyCardStyles.container}>
        {/* Property Image & overlays */}
        <div className={propertyCardStyles.imageContainer}>
          <img
            src={property.image}
            alt={property.title}
            className={propertyCardStyles.image}
            loading="lazy"
          />
          <div className={propertyCardStyles.imageOverlay} />

          {/* Featured Badge */}
          {property.featured && (
            <FeaturedBadge text={t('common.featured') || 'Featured'} />
          )}
        </div>

        {/* Property Info */}
        <div
          className={propertyCardStyles.content}
          style={{
            background:
              'radial-gradient(73.04% 54.31% at 50% 0%, rgba(237, 230, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
          }}
        >
          {/* Title */}
          <div className={propertyCardStyles.titleContainer}>
            <h3 className={propertyCardStyles.title}>{property.title}</h3>
          </div>

          {/* Bottom Section: Area/Location + Metrics */}
          <div className={propertyCardStyles.bottomSection}>
            {/* Area and Location */}
            <div className={propertyCardStyles.areaLocationRow}>
              <span className={propertyCardStyles.areaText}>
                {formattedArea}
              </span>
              <span className={propertyCardStyles.locationText}>
                <MarkerPin02 className={propertyCardStyles.icons.small} />
                <span>{property.city}</span>
              </span>
            </div>

            {/* Metrics */}
            <div className={propertyCardStyles.metricsContainer}>
              {formattedElectricity && (
                <MetricRow
                  icon={<Zap className={propertyCardStyles.icons.primary} />}
                  label={t('property.electricity') || 'Electricity'}
                  value={formattedElectricity}
                />
              )}

              {formattedGas && (
                <MetricRow
                  icon={<FireIcon />}
                  label={t('property.gas') || 'Gas'}
                  value={formattedGas}
                />
              )}

              {formattedWater && (
                <MetricRow
                  icon={<Drop className={propertyCardStyles.icons.primary} />}
                  label={t('property.water') || 'Water'}
                  value={formattedWater}
                  showSeparator={false}
                />
              )}
            </div>
          </div>

          {/* Distance Information */}
          {!hideDistance && (
            <div className={propertyCardStyles.distanceGrid}>
              <DistanceCard
                icon={<Anchor className={propertyCardStyles.icons.shrink} />}
                distance="75 km"
              />
              <DistanceCard
                icon={<Train className={propertyCardStyles.icons.shrink} />}
                distance="102 km"
              />
              <DistanceCard
                icon={<Plane className={propertyCardStyles.icons.shrink} />}
                distance="62 km"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className={propertyCardStyles.buttonGrid}>
            <Button
              size="lg"
              color="secondary"
              onClick={handleCompare}
              className="w-full h-12 rounded-xl px-[18px] border border-gray-200 bg-white text-[#171B23] font-semibold text-base leading-6 tracking-normal shadow-sm hover:bg-gray-50 active:bg-gray-100"
              aria-label={`Compare ${property.title}`}
            >
              {t('common.compare') || 'Compare'}
            </Button>

            <Button
              size="lg"
              color="primary"
              onClick={handleView}
              className="w-full h-12 rounded-xl px-[18px] text-white font-semibold text-base leading-6 tracking-normal shadow-sm bg-[linear-gradient(90deg,#5547B5_0%,#695DC2_100%)] hover:brightness-105 active:brightness-95"
              aria-label={`View details for ${property.title}`}
            >
              {t('common.view') || 'View'}
            </Button>
          </div>
        </div>
      </article>
    );
  }
);

PropertyCard.displayName = 'PropertyCard';
