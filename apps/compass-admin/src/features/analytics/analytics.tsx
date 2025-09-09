import { useScrollSpy } from '../../hooks/use-scroll-spy';
import {
  ANALYTICS_SECTIONS,
  SCROLL_SPY_CONFIG,
} from '../../constants/analytics';
import { PageHeader } from '../../components/ui/PageHeader';
import { AnalyticsSection } from '../../components/ui/AnalyticsSection';

export const AnalyticsPage = () => {
  const { activeSection } = useScrollSpy(SCROLL_SPY_CONFIG);

  return (
    <div data-qa-id="analytics-page" className="space-y-8">
      <PageHeader titleKey="analytics.title" />

      <div data-qa-id="analytics-sections">
        {ANALYTICS_SECTIONS.map((section) => (
          <AnalyticsSection
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
          />
        ))}
      </div>
    </div>
  );
};
