import type { AnalyticsSectionId } from '../types/features';

export const createScrollToSection = (_locale: string) => {
  return (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
    return false;
  };
};

export const createUrlForSection = (
  locale: string,
  sectionId: AnalyticsSectionId,
): string => {
  return `/${locale}/analytics#${sectionId}`;
};

export const extractHashFromUrl = (url: string): string => {
  return url.substring(1); // Remove the '#' character
};

export const findActiveSection = (
  sections: AnalyticsSectionId[],
  scrollOffset = 100,
): AnalyticsSectionId | null => {
  const scrollPosition = window.scrollY + scrollOffset;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i]);
    if (section && section.offsetTop <= scrollPosition) {
      return sections[i];
    }
  }
  return null;
};

export const isAnalyticsAnchor = (href: string): boolean => {
  return href.includes('analytics#');
};
