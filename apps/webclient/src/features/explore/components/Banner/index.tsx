"use client";

import { ExploreActions } from "@/features/explore/components/ExploreActions";

export function Banner({ imageSrc }: { imageSrc?: string }) {
  return (
    <div className="relative">
      {imageSrc && (
        <img
          src={imageSrc}
          alt="District overview"
          width={1600}
          height={900}
          className="h-72 w-full rounded-2xl object-cover md:h-96"
        />
      )}

      <div className="absolute end-4 top-4 z-10 hidden md:flex items-center gap-3">
        <ExploreActions size="sm" variant="dark" />
      </div>
    </div>
  );
}