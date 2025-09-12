'use client';

import { ExploreActions } from '@/features/explore/components/Navigation/ExploreActions';
import { ImageSection } from '@/shared/ui/components/ImageSection';
import type { BannerProps } from '../../types/banner';
import { bannerStyles } from './styles';

export function Banner({ imageSrc }: BannerProps) {
  return (
    <ImageSection
      backgroundImage={imageSrc}
      alt='District overview'
      className={bannerStyles.imageSection.container}
      imageClassName={bannerStyles.imageSection.image}
    >
      <div className={bannerStyles.actionsContainer}>
        <ExploreActions size='sm' variant='dark' />
      </div>
    </ImageSection>
  );
}
