import { useState } from 'react';
import { ChevronDown } from '@untitledui/icons';
import { useCurrentLocale, useLocaleNavigate } from '../../../router';
import type { LanguageSelectorProps } from '../../types/languageSelector';

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleNavigate();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    changeLocale(newLang);
    setIsLangDropdownOpen(false);
    onLanguageChange?.();
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
        className='flex cursor-pointer items-center gap-2 rounded-lg py-2 outline-none transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2'
      >
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
        <span className='text-md font-medium'>
          {currentLocale === 'ar' ? 'ع' : 'En'}
        </span>
        <ChevronDown className='size-4 text-white/70' />
      </button>

      {isLangDropdownOpen && (
        <div className='absolute top-full right-0 mt-2 w-32 rounded-lg bg-white shadow-lg ring-1 ring-black/5'>
          <button
            onClick={() => handleLanguageChange('en')}
            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg'
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('ar')}
            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg'
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
