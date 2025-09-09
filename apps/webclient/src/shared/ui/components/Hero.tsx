import { Breadcrumb } from "@compass/shared-ui";
import { ImageSection } from "./ImageSection";
import type { HeroProps } from "../../types/hero";

export function Hero({
  backgroundImage,
  title,
  subtitle,
  className = "",
  breadcrumbItems,
}: HeroProps) {
  return (
    <ImageSection
      backgroundImage={backgroundImage}
      alt="Hero background"
      className={`py-40 ${className}`}
      hasOverlay={true}
    >
      <div className="container mx-auto px-4">
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="mb-10">
            <Breadcrumb 
              items={breadcrumbItems}
              showHome={true}
            />
          </div>
        )}
        {(title || subtitle) && (
          <div className="mx-auto text-center w-full md:w-1/2 mt-10">
            {title && (
              <h1 className="font-sans font-semibold text-center
                text-[40px] leading-[43px] tracking-[-0.02em]
                md:text-[48px] md:leading-[60px] text-[#F5F5F6]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-8 text-center font-sans
                text-[14px] leading-[20px] font-normal
                md:text-[18px] md:leading-[28px] md:font-medium
                tracking-normal text-[#F5F5F6]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </ImageSection>
  );
}