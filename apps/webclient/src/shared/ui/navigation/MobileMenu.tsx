import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from '@untitledui/icons';
import { useCurrentLocale, useLocaleNavigate } from '../../lib/router';
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
    <div className='xl:hidden absolute top-full left-0 right-0 mt-2 z-50'>
      <div className='mx-4 rounded-2xl border border-white/30 bg-[rgba(12,17,29,0.85)] backdrop-blur-[12px] p-4'>
        {/* Mobile language switcher */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <img
              src={
                currentLocale === 'ar'
                  ? '/assets/images/flags/SA.svg'
                  : '/assets/images/flags/US.svg'
              }
              alt='flag'
              width={20}
              height={20}
            />
            <span className='text-sm font-medium'>
              {currentLocale === 'ar' ? 'العربية' : 'English'}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm'
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </button>
            <button
              className='px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm'
              onClick={() => handleLanguageChange('ar')}
            >
              AR
            </button>
          </div>
        </div>

        <ul className='flex flex-col divide-y divide-white/10'>
          {items.map(item => (
            <li key={item.label} className='py-3'>
              {item.hasDropdown ? (
                <div>
                  <button
                    type='button'
                    className='w-full flex items-center justify-between'
                    onClick={() =>
                      setMobileActiveDropdown(prev =>
                        prev === item.dropdownId
                          ? null
                          : item.dropdownId || null
                      )
                    }
                  >
                    <span className='text-base font-semibold'>
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform ${
                        mobileActiveDropdown === item.dropdownId
                          ? 'rotate-180'
                          : ''
                      } pointer-events-none`}
                    />
                  </button>
                  {mobileActiveDropdown === item.dropdownId && item.submenu && (
                    <div className='mt-3 pl-2 space-y-4'>
                      {item.submenu.sections.map(
                        (section: any, sectionIndex: number) => (
                          <div key={sectionIndex}>
                            <div className='text-sm text-white/70 mb-2'>
                              {section.title}
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                              {section.columns
                                .flat()
                                .map((link: any, idx: number) => (
                                  <Link
                                    key={idx}
                                    to={link.href}
                                    className='flex items-center gap-2 text-sm hover:text-purple-300'
                                    onClick={onClose}
                                  >
                                    {'icon' in link && link.icon && (
                                      <link.icon className='w-4 h-4 text-purple-400' />
                                    )}
                                    <span>{link.name}</span>
                                  </Link>
                                ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className='block text-base font-semibold'
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
