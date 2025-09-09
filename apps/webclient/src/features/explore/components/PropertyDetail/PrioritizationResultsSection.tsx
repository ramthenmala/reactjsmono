import { WorkforceTalentSection } from './WorkforceTalentSection';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';
import { useState } from 'react';
import type { PropertyDetailComponentProps } from '../../types/industrialCity';

export function PrioritizationResultsSection({
  industrialCity,
}: PropertyDetailComponentProps) {
  const { t } = useLocaleTranslation();
  const [openSection, setOpenSection] = useState('workforce');

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? '' : sectionId);
  };

  const sections = [
    {
      id: 'workforce',
      title: t('property_detail.workforce_talent') || 'Workforce & Talent',
      content: <WorkforceTalentSection industrialCity={industrialCity} />,
    },
    {
      id: 'infrastructure',
      title:
        t('property_detail.infrastructure_utilities') ||
        'Infrastructure & Utilities',
      content: (
        <div className="text-gray-600">
          {t('property_detail.content_coming_soon') || 'Content coming soon'}
        </div>
      ),
    },
    {
      id: 'social',
      title: t('property_detail.social_community') || 'Social & Community',
      content: (
        <div className="text-gray-600">
          {t('property_detail.content_coming_soon') || 'Content coming soon'}
        </div>
      ),
    },
    {
      id: 'value-chain',
      title:
        t('property_detail.value_chain_clusters') || 'Value Chain & Clusters',
      content: (
        <div className="text-gray-600">
          {t('property_detail.content_coming_soon') || 'Content coming soon'}
        </div>
      ),
    },
    {
      id: 'environmental',
      title: t('property_detail.environmental') || 'Environmental',
      content: (
        <div className="text-gray-600">
          {t('property_detail.content_coming_soon') || 'Content coming soon'}
        </div>
      ),
    },
    {
      id: 'legal',
      title: t('property_detail.legal_regulatory') || 'Legal & Regulatory',
      content: (
        <div className="text-gray-600">
          {t('property_detail.content_coming_soon') || 'Content coming soon'}
        </div>
      ),
    },
    {
      id: 'market',
      title:
        t('property_detail.market_access_demand') || 'Market Access & Demand',
      content: (
        <div className="text-gray-600">
          {t('property_detail.content_coming_soon') || 'Content coming soon'}
        </div>
      ),
    },
  ];

  return (
    <section className="container mt-8 mb-20">
      <div className="rounded-3xl py-8 px-4 md:px-8 flex flex-col gap-7 md:gap-10 bg-white/40 shadow-[0px_2px_50px_-2px_rgba(16,24,40,0.1)] backdrop-blur-[100px]">
        <h2 className="text-2xl md:text-4xl font-semibold md:font-medium text-brand-900 mx-auto md:mx-0">
          {t('property_detail.prioritization_results') ||
            'Prioritization Results'}
        </h2>
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {section.title}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openSection === section.id && (
                <div className="px-4 py-3 bg-white">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
