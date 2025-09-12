import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe01 } from '@untitledui/icons';
import { languages } from '../../shared/constants';

export const LanguageSwitcher = () => {
  const { locale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const currentLanguage =
    languages.find(lang => lang.code === locale) || languages[0];

  const switchLanguage = (newLocale: string) => {
    const currentPath = location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    i18n.changeLanguage(newLocale);
    navigate(newPath + location.search + location.hash);
  };

  return (
    <div data-qa-id='language-switcher' className='relative'>
      <div className='flex items-center gap-2'>
        <Globe01
          data-qa-id='language-switcher-icon'
          className='h-4 w-4 text-gray-500'
        />
        <select
          data-qa-id='language-switcher-select'
          value={currentLanguage.code}
          onChange={e => switchLanguage(e.target.value)}
          className='bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer'
        >
          {languages.map(language => (
            <option
              key={language.code}
              value={language.code}
              data-qa-id={`language-option-${language.code}`}
            >
              {language.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
