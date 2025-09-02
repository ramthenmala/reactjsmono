import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  Plane, 
  LayersThree01, 
  Bell04, 
  Anchor, 
  Scale01, 
  Waves, 
  Settings01, 
  Beaker02, 
  Database03, 
  MedicalCross, 
  Virus, 
  Menu01 
} from "@untitledui/icons";
import { useLocaleTranslation } from '../../lib/i18n';
import { useCurrentLocale, useLocaleNavigate } from '../../lib/router';

export function Header() {
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleNavigate();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navigationItems = [
    { label: t('navigation.home') || 'Home', href: `/${currentLocale}` },
    { label: t('navigation.explore') || 'Explore', href: `/${currentLocale}/explore/landing` },
    { 
      label: t('navigation.saudi_industrial_landscape') || 'Saudi Industrial Landscape', 
      href: "#", 
      hasDropdown: true,
      dropdownId: "saudi_industrial_landscape",
      submenu: {
        title: "Saudi Industrial Landscape",
        subtitle: "Discover all sectors and Regions",
        sections: [
          {
            title: "Sectors",
            columns: [
              [
                { name: "Aerospace", icon: Plane, href: "#" },
                { name: "Building Materials", icon: LayersThree01, href: "#" },
                { name: "Food Processing", icon: Bell04, href: "#" },
                { name: "Maritime", icon: Anchor, href: "#" },
                { name: "Metals", icon: Scale01, href: "#" },
                { name: "Renewables", icon: Waves, href: "#" }
              ],
              [
                { name: "Automotive", icon: Settings01, href: "#" },
                { name: "Chemicals", icon: Beaker02, href: "#" },
                { name: "Machinery & Equipment", icon: Database03, href: "#" },
                { name: "Medical Devices", icon: MedicalCross, href: "#" },
                { name: "Pharma", icon: Virus, href: "#" }
              ]
            ]
          },
          {
            title: "Regions",
            columns: [
              [
                { name: "Al-Baha", href: "#" },
                { name: "Al-Jouf", href: "#" },
                { name: "Ar-Riyadh", href: "#" },
                { name: "Aseer", href: "#" },
                { name: "E. Region", href: "#" },
                { name: "N. Borders", href: "#" }
              ],
              [
                { name: "Tabuk", href: "#" },
                { name: "Jazan", href: "#" },
                { name: "Makkah", href: "#" },
                { name: "Madinah", href: "#" },
                { name: "Najran", href: "#" },
                { name: "Qassim", href: "#" }
              ]
            ]
          }
        ]
      }
    },
    { label: t('navigation.contact_us') || 'Contact Us', href: `/${currentLocale}/contact` }
  ];

  const handleLanguageChange = (newLang: "en" | "ar") => {
    changeLocale(newLang);
    setIsLangDropdownOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(prev => (prev === dropdownId ? null : dropdownId));
    setIsLangDropdownOpen(false);
  };

  const getCurrentSubmenu = () => {
    return navigationItems.find(item => item.dropdownId === activeDropdown)?.submenu;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close submenu popup when clicking outside (but ignore clicks on toggle buttons)
  useEffect(() => {
    if (!activeDropdown) return;
    const onPointerDown = (event: PointerEvent) => {
      const path = (event.composedPath && event.composedPath()) as Node[];
      const clickedToggle = path.some(node => {
        return node instanceof HTMLElement && node.hasAttribute('data-dropdown-toggle');
      });
      if (clickedToggle) return; // let the toggle button click handle open/close

      const inMenu = menuRef.current ? path.includes(menuRef.current) : false;
      if (!inMenu) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeDropdown]);

  return (
    <header className={`header text-white ${isScrolled ? 'fixed top-0 left-0 right-0 scrolled' : 'relative'}`}>
      <div className="container flex items-end justify-between gap-4">
        {/* Left: Logo always */}
        <div className="header-section flex gap-12">
          <img src="/assets/images/logo.svg" alt="Compass" className="h-8 w-auto" />
          {/* Desktop nav (>= xl) */}
          <nav className="header-nav max-xl:hidden">
            <ul className="flex items-center gap-4">
              {navigationItems.map((item) => (
                <li key={item.label} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onClick={() => toggleDropdown(item.dropdownId || "")}
                      data-dropdown-toggle={item.dropdownId || ""}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`size-4 transition-transform ${activeDropdown === item.dropdownId ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link to={item.href}>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right containers */}
        {/* Desktop language selector (>= xl) */}
        <div className="header-section gap-3 shadow-2xl hidden xl:flex">
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex cursor-pointer items-center gap-2 rounded-lg py-2 outline-none transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <img 
                src={currentLocale === "ar" ? "/assets/images/SA.svg" : "/assets/images/US.svg"} 
                alt="flag" 
                width={20} 
                height={20} 
              />
              <span className="text-md font-medium">
                {currentLocale === "ar" ? "ع" : "En"}
              </span>
              <ChevronDown className="size-4 text-white/70" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                >
                  العربية
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile/tablet menu button (< xl), styled like language container */}
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

      {/* Desktop mega-menu */}
      {activeDropdown && getCurrentSubmenu() && (
        <div ref={menuRef} className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-auto max-w-[90vw] rounded-3xl border border-white/30 bg-gradient-to-r from-[rgba(12,17,29,0.40)] from-[-49.18%] to-[rgba(12,17,29,0.20)] to-[151.82%] shadow-[0_4px_8px_-2px_rgba(16,24,40,0.10),0_2px_4px_-2px_rgba(16,24,40,0.06)] backdrop-blur-[15px] z-50 max-xl:hidden">
          <div className="p-8 flex flex-col gap-8">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold">{getCurrentSubmenu()?.title}</h3>
              <p className="text-gray-300 text-sm">{getCurrentSubmenu()?.subtitle}</p>
            </div>

            {/* Content Layout */}
            <div className="flex gap-12">
              {getCurrentSubmenu()?.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex flex-col gap-3">
                  <h4 className="text-sm font-semibold text-gray-500">{section.title}</h4>
                  <div className="flex gap-12">
                    {section.columns.map((column, columnIndex) => (
                      <div key={columnIndex} className="space-y-1">
                        {column.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            to={item.href}
                            className="flex items-center gap-3 w-fit text-left hover:text-purple-300 transition-colors py-2"
                          >
                            {'icon' in item && item.icon && <item.icon className="w-4 h-4 text-purple-400" />}
                            <span className="text-lg font-semibold whitespace-nowrap">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile/tablet dropdown menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 mt-2 z-50">
          <div className="mx-4 rounded-2xl border border-white/30 bg-[rgba(12,17,29,0.85)] backdrop-blur-[12px] p-4">
            {/* Mobile language switcher */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img 
                  src={currentLocale === "ar" ? "/assets/images/SA.svg" : "/assets/images/US.svg"} 
                  alt="flag" 
                  width={20} 
                  height={20} 
                />
                <span className="text-sm font-medium">{currentLocale === 'ar' ? 'العربية' : 'English'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm" 
                  onClick={() => handleLanguageChange('en')}
                >
                  EN
                </button>
                <button 
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm" 
                  onClick={() => handleLanguageChange('ar')}
                >
                  AR
                </button>
              </div>
            </div>

            <ul className="flex flex-col divide-y divide-white/10">
              {navigationItems.map((item) => (
                <li key={item.label} className="py-3">
                  {item.hasDropdown ? (
                    <div>
                      <button 
                        type="button" 
                        className="w-full flex items-center justify-between" 
                        onClick={() => setMobileActiveDropdown(prev => prev === (item.dropdownId as string) ? null : (item.dropdownId as string))}
                      >
                        <span className="text-base font-semibold">{item.label}</span>
                        <ChevronDown className={`size-4 transition-transform ${mobileActiveDropdown === item.dropdownId ? 'rotate-180' : ''} pointer-events-none`} />
                      </button>
                      {mobileActiveDropdown === item.dropdownId && (
                        <div className="mt-3 pl-2 space-y-4">
                          {item.submenu?.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                              <div className="text-sm text-white/70 mb-2">{section.title}</div>
                              <div className="grid grid-cols-2 gap-2">
                                {section.columns.flat().map((link, idx) => (
                                  <Link 
                                    key={idx} 
                                    to={link.href} 
                                    className="flex items-center gap-2 text-sm hover:text-purple-300" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {'icon' in link && link.icon && <link.icon className="w-4 h-4 text-purple-400" />}
                                    <span>{link.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link 
                      to={item.href} 
                      className="block text-base font-semibold" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}