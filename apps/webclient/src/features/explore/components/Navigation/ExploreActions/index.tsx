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
  'data-qa-id': dataQaId = 'explore-actions',
}: ExploreActionsProps) {
  const { t } = useLocaleTranslation();
  const buttonClasses = exploreActionsStyles.button.getClasses(variant);

  return (
    <div className={exploreActionsStyles.container(className)} data-qa-id={dataQaId}>
      <Button size={size} color='tertiary' className={buttonClasses} data-qa-id={`${dataQaId}-compare-button`}>
        <Icon name='compare' className={exploreActionsStyles.icon.compare} data-qa-id={`${dataQaId}-compare-icon`} />
        <span className={exploreActionsStyles.text} data-qa-id={`${dataQaId}-compare-text`}>{t('common.compare')}</span>
      </Button>
      <Button size={size} color='tertiary' className={buttonClasses} data-qa-id={`${dataQaId}-share-button`}>
        <Share01 data-icon className={exploreActionsStyles.icon.share} data-qa-id={`${dataQaId}-share-icon`} />
        <span className={exploreActionsStyles.text} data-qa-id={`${dataQaId}-share-text`}>{t('common.share')}</span>
      </Button>
    </div>
  );
}

export default ExploreActions;
