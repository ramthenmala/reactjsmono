'use client';
import { Button, Icon } from '@compass/shared-ui';
import { Share01 } from '@untitledui/icons';
import { useLocaleTranslation } from '@/i18n';
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
        <Icon name='compare' className={exploreActionsStyles.icon.compare} />
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
