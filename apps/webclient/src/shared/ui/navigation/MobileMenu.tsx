import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from '@untitledui/icons';
import { useCurrentLocale, useLocaleNavigate } from '../../../router';
import type { MobileMenuProps } from '../../types/mobileMenu';

export function MobileMenu({ isOpen, items, onClose }: MobileMenuProps) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleNavigate();
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<
    string | null
  >(null);

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    changeLocale(newLang);
  };

  if (!isOpen) return null;

  return (
    <div className='xl:hidden absolute top-full left-0 right-0 mt-2 z-50' data-qa-id="mobile-menu">
      <div className='mx-4 rounded-2xl border border-white/30 bg-[rgba(12,17,29,0.85)] backdrop-blur-[12px] p-4' data-qa-id="mobile-menu-content">
        {/* Mobile language switcher */}
        <div className='flex items-center justify-between mb-3' data-qa-id="mobile-language-switcher">
          <div className='flex items-center gap-2' data-qa-id="mobile-current-language">
            <img
              data-qa-id="mobile-language-flag"
              src={
                currentLocale === 'ar'
                  ? '/assets/images/flags/SA.svg'
                  : '/assets/images/flags/US.svg'
              }
              alt='flag'
              width={20}
              height={20}
            />
            <span className='text-sm font-medium' data-qa-id="mobile-language-text">
              {currentLocale === 'ar' ? 'العربية' : 'English'}
            </span>
          </div>
          <div className='flex items-center gap-2' data-qa-id="mobile-language-buttons">
            <button
              data-qa-id="mobile-language-en-button"
              className='px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm'
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </button>
            <button
              data-qa-id="mobile-language-ar-button"
              className='px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm'
              onClick={() => handleLanguageChange('ar')}
            >
              AR
            </button>
          </div>
        </div>

        <ul className='flex flex-col divide-y divide-white/10' data-qa-id="mobile-navigation-list">
          {items.map(item => (
            <li key={item.label} className='py-3' data-qa-id={`mobile-nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              {item.hasDropdown ? (
                <div data-qa-id={`mobile-dropdown-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <button
                    type='button'
                    data-qa-id={`mobile-dropdown-toggle-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className='w-full flex items-center justify-between'
                    onClick={() =>
                      setMobileActiveDropdown(prev =>
                        prev === item.dropdownId
                          ? null
                          : item.dropdownId || null,
                      )
                    }
                  >
                    <span className='text-base font-semibold' data-qa-id={`mobile-dropdown-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.label}
                    </span>
                    <ChevronDown
                      data-qa-id={`mobile-dropdown-chevron-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`size-4 transition-transform ${
                        mobileActiveDropdown === item.dropdownId
                          ? 'rotate-180'
                          : ''
                      } pointer-events-none`}
                    />
                  </button>
                  {mobileActiveDropdown === item.dropdownId && item.submenu && (
                    <div className='mt-3 pl-2 space-y-4' data-qa-id={`mobile-dropdown-content-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.submenu.sections.map(
                        (section: any, sectionIndex: number) => (
                          <div key={sectionIndex} data-qa-id={`mobile-dropdown-section-${sectionIndex}`}>
                            <div className='text-sm text-white/70 mb-2' data-qa-id={`mobile-dropdown-section-title-${sectionIndex}`}>
                              {section.title}
                            </div>
                            <div className='grid grid-cols-2 gap-2' data-qa-id={`mobile-dropdown-section-links-${sectionIndex}`}>
                              {section.columns
                                .flat()
                                .map((link: any, idx: number) => (
                                  <Link
                                    key={idx}
                                    to={link.href}
                                    data-qa-id={`mobile-dropdown-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className='flex items-center gap-2 text-sm hover:text-purple-300'
                                    onClick={onClose}
                                  >
                                    {'icon' in link && link.icon && (
                                      <link.icon className='w-4 h-4 text-purple-400' data-qa-id={`mobile-dropdown-link-icon-${link.name.toLowerCase().replace(/\s+/g, '-')}`} />
                                    )}
                                    <span data-qa-id={`mobile-dropdown-link-text-${link.name.toLowerCase().replace(/\s+/g, '-')}`}>{link.name}</span>
                                  </Link>
                                ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  data-qa-id={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className='block text-base font-semibold'
                  onClick={onClose}
                >
                  <span data-qa-id={`mobile-nav-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
