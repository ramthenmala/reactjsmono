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
      {quickLinks && <div data-qa-id="footer-quick-links-section">
        <h3
          className='font-semibold mb-4 text-sm leading-5'
          style={{
            color: '#D8C8FF',
            fontFamily: '"General Sans"',
          }}
          data-qa-id="footer-quick-links-title"
        >
          {t('footer.quick_links')}
        </h3>
        <ul className="flex flex-col items-start gap-3 self-stretch" data-qa-id="footer-quick-links-list">
          {quickLinks.map((item, index) => (
            <li key={index} data-qa-id={`footer-quick-link-item-${index}`}>
              <Link
                to={`/${currentLocale}${item.link}`}
                className='flex justify-center items-center gap-2 text-white font-semibold text-base leading-6 hover:opacity-90 transition-opacity'
                style={{ fontFamily: '"General Sans"' }}
                data-qa-id={`footer-quick-link-${item.label?.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>}

      {/* Legal Links */}
      {legalPages && <div data-qa-id="footer-legal-section">
        <h3
          className='font-semibold mb-4 text-sm leading-5'
          style={{
            color: '#D8C8FF',
            fontFamily: '"General Sans"',
          }}
          data-qa-id="footer-legal-title"
        >
          {t('footer.legal') || 'Legal'}
        </h3>
        <ul className="flex flex-col items-start gap-3 self-stretch" data-qa-id="footer-legal-list">
          {legalPages.map((item, index) => (
            <li key={index} data-qa-id={`footer-legal-item-${index}`}>
              <Link
                to={`/${currentLocale}${item.link}`}
                className='flex justify-center items-center gap-2 text-white font-semibold text-base leading-6 hover:opacity-90 transition-opacity'
                style={{ fontFamily: '"General Sans"' }}
                data-qa-id={`footer-legal-link-${item.label?.toLowerCase().replace(/\s+/g, '-')}`}
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
