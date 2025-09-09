import { useState, useEffect, useRef } from 'react';
import { Menu01 } from '@untitledui/icons';
import { useCurrentLocale } from '../../lib/router';
import { navigationService } from '../../services/navigationService';
import type { NavigationData } from '../../types/navigation';
import { HeaderLogo } from './HeaderLogo';
import { NavigationMenu } from './NavigationMenu';
import { LanguageSelector } from './LanguageSelector';
import { MobileMenu } from './MobileMenu';
import { MegaMenu } from './MegaMenu';
import { megaMenuConfig } from './megaMenuConfig';

export function Header() {
  const currentLocale = useCurrentLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationData, setNavigationData] = useState<NavigationData | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Transform API navigation data to include locale prefix and mega menu
  const getNavigationItems = () => {
    if (!navigationData?.header) {
      return [];
    }

    return navigationData.header.map((item) => {
      // Add locale prefix to links
      const href =
        item.link === '/'
          ? `/${currentLocale}`
          : `/${currentLocale}${item.link}`;

      // Special handling for Saudi Industrial Landscape to add mega menu
      if (item.label === 'Saudi Industrial Landscape') {
        return {
          label: item.label,
          href: href,
          hasDropdown: true,
          dropdownId: 'saudi_industrial_landscape',
          submenu: megaMenuConfig,
        };
      }

      return {
        label: item.label,
        href: href,
        hasDropdown: item.hasSubMenu,
        dropdownId: item.hasSubMenu
          ? item.label.toLowerCase().replace(/\s+/g, '_')
          : undefined,
        submenu: item.subMenu || undefined,
      };
    });
  };

  const navigationItems = getNavigationItems();

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const getCurrentSubmenu = () => {
    return navigationItems.find((item) => item.dropdownId === activeDropdown)
      ?.submenu;
  };

  const handleLanguageChange = () => {
    setActiveDropdown(null);
  };

  // Fetch navigation data on component mount
  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        const data = await navigationService.getNavigationData();
        setNavigationData(data);
      } catch (error) {
        console.error('Failed to load navigation data:', error);
        // Set empty navigation data on failure
        setNavigationData({
          header: [],
          footer: {
            footerContent: '',
            copyrightText: '',
            quickLinks: [],
            legalPages: [],
            socialLinks: [],
          },
        });
      }
    };

    loadNavigationData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close submenu popup when clicking outside
  useEffect(() => {
    if (!activeDropdown) return;
    const onPointerDown = (event: PointerEvent) => {
      const path = (event.composedPath && event.composedPath()) as Node[];
      const clickedToggle = path.some((node) => {
        return (
          node instanceof HTMLElement &&
          node.hasAttribute('data-dropdown-toggle')
        );
      });
      if (clickedToggle) return;

      const inMenu = menuRef.current ? path.includes(menuRef.current) : false;
      if (!inMenu) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeDropdown]);

  return (
    <header
      className={`header text-white ${
        isScrolled ? 'fixed top-0 left-0 right-0 scrolled' : 'relative'
      }`}
    >
      <div className="container flex items-end justify-between gap-4">
        {/* Left: Logo and Navigation */}
        <div className="header-section flex gap-12">
          <HeaderLogo />
          <NavigationMenu
            items={navigationItems}
            activeDropdown={activeDropdown}
            onToggleDropdown={toggleDropdown}
          />
        </div>

        {/* Right: Language Selector and Mobile Menu Button */}
        {/* Desktop language selector */}
        <div className="header-section gap-3 shadow-2xl hidden xl:flex">
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </div>

        {/* Mobile menu button */}
        <div className="header-section gap-3 shadow-2xl xl:hidden flex">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg py-2 outline-none transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 relative z-50"
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu01 className="size-6 pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <MegaMenu
        ref={menuRef}
        submenu={getCurrentSubmenu()}
        isVisible={!!activeDropdown && !!getCurrentSubmenu()}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        items={navigationItems}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
