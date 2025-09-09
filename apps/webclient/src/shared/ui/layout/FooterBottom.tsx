import { useLocaleTranslation } from '../../lib/i18n';
import type { FooterBottomProps } from '../../types/footerBottom';

export function FooterBottom({ navigationData }: FooterBottomProps) {
  const { t } = useLocaleTranslation();

  return (
    <div className="pt-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Official Logos */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Ministry Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/brand/ministry-of-industry-and-mineral-resources-seek-logo.svg"
              alt="Ministry of Industry and Mineral Resources"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </div>

          {/* Vision 2030 Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/brand/vision-2030-kingdom-of-saudi-arabia-logo.svg"
              alt="Vision 2030 Kingdom of Saudi Arabia"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </div>

          {/* Digital Government Authority */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/brand/registered-on-digital-government-authority-logo.svg"
              alt="Digital Government Authority"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-sm text-white font-medium text-base leading-6 text-center lg:text-right">
          {navigationData?.footer?.copyrightText || t('footer.copyright') || '© 2024 Compass. All rights reserved.'}
        </div>
      </div>
    </div>
  );
}