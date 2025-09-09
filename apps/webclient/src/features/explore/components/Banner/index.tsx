"use client";

import { ExploreActions } from "@/features/explore/components/ExploreActions";
import { ImageSection } from "@/shared/ui/components/ImageSection";
import type { BannerProps } from "../../types/banner";

export function Banner({ imageSrc }: BannerProps) {
  return (
    <ImageSection
      backgroundImage={imageSrc}
      alt="District overview"
      className="h-72 md:h-96 rounded-2xl"
      imageClassName="rounded-2xl"
    >
      <div className="absolute end-4 top-4 z-10 hidden md:flex items-center gap-3">
        <ExploreActions size="sm" variant="dark" />
      </div>
    </ImageSection>
  );
}