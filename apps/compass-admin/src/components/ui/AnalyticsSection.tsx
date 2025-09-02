import { useTranslation } from 'react-i18next';
import type { AnalyticsSectionProps } from '../../../types/features';

export const AnalyticsSection = ({ section, isActive }: AnalyticsSectionProps) => {
  const { t } = useTranslation();

  return (
    <section 
      id={section.id} 
      data-qa-id={`analytics-section-${section.id}`}
      className="scroll-mt-8 min-h-96"
    >
      <h2 
        data-qa-id={`analytics-section-title-${section.id}`}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {t(section.title)}
      </h2>
      {section.description && (
        <p 
          data-qa-id={`analytics-section-description-${section.id}`}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          {t(section.description)}
        </p>
      )}
      {/* Content will be added here based on section type */}
    </section>
  );
};