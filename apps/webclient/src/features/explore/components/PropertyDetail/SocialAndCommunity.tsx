import React from 'react';
import { ISocialAndCommunity } from '../../types/industrialCity';
import StatCard from '../UI/StatCard';
import { Bank, BookClosed, Building03, Bus, Check, Home02, Map02, Tool01, X } from '@untitledui/icons';
import { BadgeWithDot, BadgeWithIcon } from '@compass/shared-ui';

const SocialAndCommunity: React.FC<ISocialAndCommunity> = ({
  residentialAreas,
  hospitalsAndMedicalCenters,
  publicTransportationAvailability,
  educationalInstitutions,
  noOfBanksAndCreditInstitutions,
  amenitiesForWorkforce,
  scenicLocationAndSurroundings,
  'data-qa-id': dataQaId = 'social-community',
}) => {
  return (
    <div 
      className='flex flex-col gap-4'
      data-qa-id={dataQaId}
    >
      <div 
        className='grid grid-cols-1 md:grid-cols-3 gap-4'
        data-qa-id={`${dataQaId}-main-grid`}
      >
        {residentialAreas && (
          <StatCard
            label={residentialAreas.title}
            value={
              (residentialAreas.status) ?
                <BadgeWithIcon type="pill-color" color="success" size="lg" iconTrailing={Check}>
                  {residentialAreas.value}
                </BadgeWithIcon> :
                <BadgeWithIcon type="pill-color" color="error" size="lg" iconTrailing={X}>
                  {residentialAreas.value}
                </BadgeWithIcon>
            }
            icon={<Home02 className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-residential`}
          />
        )}
        {hospitalsAndMedicalCenters && (
          <StatCard
            label={hospitalsAndMedicalCenters.title}
            value={
              (hospitalsAndMedicalCenters.status) ?
                <BadgeWithIcon type="pill-color" color="success" size="lg" iconTrailing={Check}>
                  {hospitalsAndMedicalCenters.value}
                </BadgeWithIcon> :
                <BadgeWithIcon type="pill-color" color="error" size="lg" iconTrailing={X}>
                  {hospitalsAndMedicalCenters.value}
                </BadgeWithIcon>
            }
            icon={<Building03 className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-medical`}
          />
        )}
        {publicTransportationAvailability && (
          <StatCard
            label={publicTransportationAvailability.title}
            value={
              (publicTransportationAvailability.status) ?
                <BadgeWithIcon type="pill-color" color="success" size="lg" iconTrailing={Check}>
                  {publicTransportationAvailability.value}
                </BadgeWithIcon> :
                <BadgeWithIcon type="pill-color" color="error" size="lg" iconTrailing={X}>
                  {publicTransportationAvailability.value}
                </BadgeWithIcon>
            }
            icon={<Bus className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-transport`}
          />
        )}
      </div>
      <div 
        className='grid grid-cols-1 md:grid-cols-4 gap-4'
        data-qa-id={`${dataQaId}-secondary-grid`}
      >
        {educationalInstitutions && (
          <StatCard
            label={educationalInstitutions.title}
            value={
              (educationalInstitutions.status) ?
                <BadgeWithIcon type="pill-color" color="success" size="lg" iconTrailing={Check}>
                  {educationalInstitutions.value}
                </BadgeWithIcon> :
                <BadgeWithIcon type="pill-color" color="error" size="lg" iconTrailing={X}>
                  {educationalInstitutions.value}
                </BadgeWithIcon>
            }
            icon={<BookClosed className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-education`}
          />
        )}
        {noOfBanksAndCreditInstitutions && (
          <StatCard
            label={noOfBanksAndCreditInstitutions.title}
            value={
              <BadgeWithDot type="pill-color" color="blue-light" size="lg">
                {noOfBanksAndCreditInstitutions.value}
              </BadgeWithDot>
            }
            icon={<Bank className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-banks`}
          />
        )}
        {amenitiesForWorkforce && (
          <StatCard
            label={amenitiesForWorkforce.title}
            value={
              (amenitiesForWorkforce.status) ?
                <BadgeWithIcon type="pill-color" color="success" size="lg" iconTrailing={Check}>
                  {amenitiesForWorkforce.value}
                </BadgeWithIcon> :
                <BadgeWithIcon type="pill-color" color="error" size="lg" iconTrailing={X}>
                  {amenitiesForWorkforce.value}
                </BadgeWithIcon>
            }
            icon={<Tool01 className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-amenities`}
          />
        )}
        {scenicLocationAndSurroundings && (
          <StatCard
            label={scenicLocationAndSurroundings.title}
            value={
              (scenicLocationAndSurroundings.status) ?
                <BadgeWithIcon type="pill-color" color="success" size="lg" iconTrailing={Check}>
                  {scenicLocationAndSurroundings.value}
                </BadgeWithIcon> :
                <BadgeWithIcon type="pill-color" color="error" size="lg" iconTrailing={X}>
                  {scenicLocationAndSurroundings.value}
                </BadgeWithIcon>
            }
            icon={<Map02 className='size-11' strokeWidth={1} />}
            data-qa-id={`${dataQaId}-scenic`}
          />
        )}
      </div>
    </div>
  );
};

export default SocialAndCommunity;
