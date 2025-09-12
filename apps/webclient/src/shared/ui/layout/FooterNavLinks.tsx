import { Link } from 'react-router-dom';
import { useLocaleTranslation } from '../../../i18n';
import { useCurrentLocale } from '../../../router';
import { ILinkItem } from '@/shared/types';

export function FooterNavLinks({ quickLinks, legalPages } : { quickLinks?: ILinkItem[], legalPages: ILinkItem[] }) {
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();

  return (
    <>
      {/* Quick Links */}
      {quickLinks && <div>
        <h3
          className='font-semibold mb-4 text-sm leading-5'
          style={{
            color: '#D8C8FF',
            fontFamily: '"General Sans"',
          }}
        >
          {t('footer.quick_links')}
        </h3>
        <ul className="flex flex-col items-start gap-3 self-stretch">
          {quickLinks.map((item, index) => (
            <li key={index}>
              <Link
                to={`/${currentLocale}${item.link}`}
                className='flex justify-center items-center gap-2 text-white font-semibold text-base leading-6 hover:opacity-90 transition-opacity'
                style={{ fontFamily: '"General Sans"' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>}

      {/* Legal Links */}
      {legalPages && <div>
        <h3
          className='font-semibold mb-4 text-sm leading-5'
          style={{
            color: '#D8C8FF',
            fontFamily: '"General Sans"',
          }}
        >
          {t('footer.legal') || 'Legal'}
        </h3>
        <ul className="flex flex-col items-start gap-3 self-stretch">
          {legalPages.map((item, index) => (
            <li key={index}>
              <Link
                to={`/${currentLocale}${item.link}`}
                className='flex justify-center items-center gap-2 text-white font-semibold text-base leading-6 hover:opacity-90 transition-opacity'
                style={{ fontFamily: '"General Sans"' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>}
    </>
  );
}
