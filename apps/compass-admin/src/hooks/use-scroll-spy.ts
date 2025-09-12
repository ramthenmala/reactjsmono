import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { AnalyticsSectionId, ScrollSpyConfig } from '../types/features';
import {
  findActiveSection,
  createUrlForSection,
  extractHashFromUrl,
} from '../utils/scroll-spy';

export const useScrollSpy = (config: ScrollSpyConfig) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const [activeSection, setActiveSection] = useState<AnalyticsSectionId | ''>(
    '',
  );
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle initial hash navigation
  useEffect(() => {
    if (location.hash) {
      const sectionId = extractHashFromUrl(location.hash);
      const element = document.getElementById(sectionId);
      if (element) {
        isUserScrollingRef.current = true;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId as AnalyticsSectionId);

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
        }, config.userScrollTimeout);
      }
    }
  }, [location, config.userScrollTimeout]);

  // Handle navigation clicks to prevent scroll spy interference
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href*="#"]');

      if (anchor && anchor.getAttribute('href')?.includes('analytics#')) {
        isUserScrollingRef.current = true;

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
        }, config.userScrollTimeout);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [config.userScrollTimeout]);

  // Set up scroll spy to track active section
  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isUserScrollingRef.current) return;

      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const newActiveSection = findActiveSection(
          config.sections,
          config.scrollOffset,
        );

        if (newActiveSection && newActiveSection !== activeSection) {
          setActiveSection(newActiveSection);
          const newUrl = createUrlForSection(locale || 'en', newActiveSection);
          if (location.pathname + location.hash !== newUrl) {
            navigate(newUrl, { replace: true });
          }
        }
      }, config.debounceDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(debounceTimeout);
    };
  }, [
    activeSection,
    location.pathname,
    location.hash,
    navigate,
    locale,
    config,
  ]);

  return { activeSection };
};
