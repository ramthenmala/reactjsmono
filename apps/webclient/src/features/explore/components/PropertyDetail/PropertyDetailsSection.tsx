'use client';

import { PropertyHeader } from './PropertyHeader';
import { DistrictMapSection } from './DistrictMapSection';
import { LandsFactoriesSection } from './LandsFactoriesSection';
import { InfrastructureSection } from './InfrastructureSection';
import { LogisticsServicesSection } from './LogisticsServicesSection';
import type { IPropertyDetailsSectionProps } from '../../types/industrialCity';

export function PropertyDetailsSection({
  banner,
  name,
  description,
  mapInfo,
  yearInfo,
  districtInfo,
  landAndFactoriesInfo,
  infrastructureInfo,
  logisticsServicesInfo,
  nearByLogisticCentersInfo,
  industriesInsideGraphInfo,
  'data-qa-id': dataQaId = 'property-details-section',
  ...rest
}: IPropertyDetailsSectionProps) {
  return (
    <section 
      className='container relative z-10 md:-mt-32'
      data-qa-id={dataQaId}
    >
      <div 
        className="rounded-3xl py-8 px-4 md:px-8 flex flex-col gap-8 bg-white/40 shadow-[0px_2px_50px_-2px_rgba(16,24,40,0.1)] backdrop-blur-[100px]"
        data-qa-id={`${dataQaId}-container`}
      >
        <PropertyHeader
          banner={banner}
          name={name}
          description={description}
          data-qa-id={`${dataQaId}-header`}
        />

        <div 
          className="flex flex-col lg:flex-row gap-7 lg:gap-10"
          data-qa-id={`${dataQaId}-content`}
        >
          <DistrictMapSection
            mapInfo={mapInfo}
            yearInfo={yearInfo}
            districtInfo={districtInfo}
            industriesInsideGraphInfo={industriesInsideGraphInfo}
            data-qa-id={`${dataQaId}-district-map`}
          />
          <div 
            className="lg:w-7/12 flex flex-col gap-4"
            data-qa-id={`${dataQaId}-details`}
          >
            <LandsFactoriesSection 
              {...landAndFactoriesInfo} 
              data-qa-id={`${dataQaId}-lands-factories`}
            />
            <InfrastructureSection 
              {...infrastructureInfo}
              data-qa-id={`${dataQaId}-infrastructure`}
            />
            <LogisticsServicesSection
              logisticsServicesInfo={logisticsServicesInfo}
              nearByLogisticCentersInfo={nearByLogisticCentersInfo}
              data-qa-id={`${dataQaId}-logistics`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
