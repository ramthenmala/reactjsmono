import { WorkforceTalentSection } from './WorkforceTalentSection';
import { useState } from 'react';
import { IPrioritizationResultInfo } from '../../types/industrialCity';
import SocialAndCommunity from './SocialAndCommunity';
import MarketAccessAndDemand from './MarketAccessAndDemand';
import LeagalAndRegulatory from './LeagalAndRegulatory';
import { Environmental } from './Environmental';
import ValueChainAndIndustryClusters from './ValueChainAndIndustryClusters';

export function PrioritizationResultsSection({
  title,
  workforceAndTalent,
  socialAndCommunity,
  marketAccessAndDemand,
  leagalAndRegulatory,
  environmental,
  valueChainAndIndustryClusters,
  'data-qa-id': dataQaId = 'prioritization-results',
}: IPrioritizationResultInfo) {
  const [openSection, setOpenSection] = useState('workforce');

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? '' : sectionId);
  };

  const sections = [
    {
      id: 'workforce',
      title: workforceAndTalent.title,
      content: <WorkforceTalentSection {...workforceAndTalent} data-qa-id={`${dataQaId}-workforce-content`} />,
    },
    {
      id: 'social',
      title: socialAndCommunity.title,
      content: <SocialAndCommunity {...socialAndCommunity} data-qa-id={`${dataQaId}-social-content`} />,
    },
    {
      id: 'market',
      title: marketAccessAndDemand.title,
      content: <MarketAccessAndDemand {...marketAccessAndDemand} data-qa-id={`${dataQaId}-market-content`} />,
    },
    {
      id: 'legal',
      title: leagalAndRegulatory.title,
      content: <LeagalAndRegulatory {...leagalAndRegulatory} data-qa-id={`${dataQaId}-legal-content`} />,
    },
    {
      id: 'environmental',
      title: environmental.title,
      content: <Environmental {...environmental} data-qa-id={`${dataQaId}-environmental-content`} />,
    },
    {
      id: 'value-chain',
      title: valueChainAndIndustryClusters.title,
      content: <ValueChainAndIndustryClusters {...valueChainAndIndustryClusters} data-qa-id={`${dataQaId}-value-chain-content`} />,
    },
  ];

  return (
    <section 
      className='container mt-8 mb-20'
      data-qa-id={dataQaId}
    >
      <div 
        className='rounded-3xl py-8 px-4 md:px-8 flex flex-col gap-7 md:gap-10 bg-white/40 shadow-[0px_2px_50px_-2px_rgba(16,24,40,0.1)] backdrop-blur-[100px]'
        data-qa-id={`${dataQaId}-container`}
      >
        <h2 
          className='text-2xl md:text-4xl font-semibold md:font-medium text-brand-900 mx-auto md:mx-0'
          data-qa-id={`${dataQaId}-title`}
        >
          {title}
        </h2>
        <div 
          className='space-y-4'
          data-qa-id={`${dataQaId}-sections`}
        >
          {sections.map(section => (
            <div
              key={section.id}
              className='overflow-hidden'
              data-qa-id={`${dataQaId}-section-${section.id}`}
              style={{
                borderRadius: 'var(--radius-xl, 12px)',
                border:
                  '1px solid var(--Colors-Border-border-secondary, #EBEDEF)',
                background:
                  'var(--Component-colors-Alpha-alpha-white-30, rgba(255, 255, 255, 0.30))',
                padding: 'var(--spacing-4xl, 32px)',
              }}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className='w-full text-left flex justify-between items-center cursor-pointer'
                data-qa-id={`${dataQaId}-toggle-${section.id}`}
              >
                <h3
                  className='text-gray-900'
                  style={{
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                  }}
                  data-qa-id={`${dataQaId}-title-${section.id}`}
                >
                  {section.title}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  data-qa-id={`${dataQaId}-chevron-${section.id}`}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              {openSection === section.id && (
                <div
                  className='mt-8'
                  data-qa-id={`${dataQaId}-content-${section.id}`}
                >
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
