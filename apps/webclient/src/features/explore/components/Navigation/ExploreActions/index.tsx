'use client';
import { Button } from '@compass/shared-ui';
import { Share01 } from '@untitledui/icons';
import { useLocaleTranslation } from '@/shared/lib/i18n';
import type { ExploreActionsProps } from '../../types/exploreActions';
import { exploreActionsStyles } from './styles';

export function ExploreActions({
  size = 'sm',
  variant = 'light',
  className = '',
}: ExploreActionsProps) {
  const { t } = useLocaleTranslation();
  const buttonClasses = exploreActionsStyles.button.getClasses(variant);

  return (
    <div className={exploreActionsStyles.container(className)}>
      <Button size={size} color='tertiary' className={buttonClasses}>
        <svg
          className={exploreActionsStyles.icon.compare}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z'
          />
        </svg>
        <span className={exploreActionsStyles.text}>{t('common.compare')}</span>
      </Button>
      <Button size={size} color='tertiary' className={buttonClasses}>
        <Share01 data-icon className={exploreActionsStyles.icon.share} />
        <span className={exploreActionsStyles.text}>{t('common.share')}</span>
      </Button>
    </div>
  );
}

export default ExploreActions;
