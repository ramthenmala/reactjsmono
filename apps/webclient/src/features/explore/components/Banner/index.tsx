'use client';

import { ExploreActions } from '@/features/explore/components/Navigation/ExploreActions';
import { ImageSection } from '@/shared/ui/components/ImageSection';
import type { BannerProps } from '../../types/banner';
import { bannerStyles } from './styles';

export function Banner({ imageSrc, 'data-qa-id': dataQaId = 'explore-banner' }: BannerProps) {
  return (
    <ImageSection
      backgroundImage={imageSrc}
      alt='District overview'
      className={bannerStyles.imageSection.container}
      imageClassName={bannerStyles.imageSection.image}
      data-qa-id={dataQaId}
    >
      <div className={bannerStyles.actionsContainer} data-qa-id={`${dataQaId}-actions`}>
        <ExploreActions size='sm' variant='dark' />
      </div>
    </ImageSection>
  );
}
