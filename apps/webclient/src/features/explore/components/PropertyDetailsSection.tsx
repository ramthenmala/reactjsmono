"use client";

import { PropertyHeader } from "./PropertyHeader";
import { DistrictMapSection } from "./DistrictMapSection";
import { LandsFactoriesSection } from "./LandsFactoriesSection";
import { InfrastructureSection } from "./InfrastructureSection";
import { LogisticsServicesSection } from "./LogisticsServicesSection";

interface PropertyDetailsSectionProps {
  industrialCity: any;
}

export function PropertyDetailsSection({ industrialCity }: PropertyDetailsSectionProps) {
  return (
    <section className="container relative z-10 md:-mt-32">
      <div className="rounded-3xl py-8 px-4 md:px-8 flex flex-col gap-8 bg-white/40 shadow-[0px_2px_50px_-2px_rgba(16,24,40,0.1)] backdrop-blur-[100px]">
        <PropertyHeader industrialCity={industrialCity} />
        
        {/* Content grid */}
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-10">
          <DistrictMapSection industrialCity={industrialCity} />
          <div className="lg:w-7/12 flex flex-col gap-4">
            <LandsFactoriesSection industrialCity={industrialCity} />
            <InfrastructureSection industrialCity={industrialCity} />
            <LogisticsServicesSection industrialCity={industrialCity} />
          </div>
        </div>
      </div>
    </section>
  );
}