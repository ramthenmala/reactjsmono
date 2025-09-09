import { useLocaleTranslation } from '../../lib/i18n';
import type { FooterLogoProps } from '../../types/footerLogo';

export function FooterLogo({ navigationData }: FooterLogoProps) {
  const { t } = useLocaleTranslation();

  return (
    <div className="lg:col-span-1">
      <div className="flex items-center gap-2 mb-4">
        <img
          src="/assets/images/brand/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-auto"
        />
      </div>
      <p className="text-white font-medium text-base leading-6 leading-relaxed max-w-[320px]">
        {navigationData?.footer?.footerContent ||
          t('footer.description') ||
          'Your gateway to industrial investment in Saudi Arabia.'}
      </p>
    </div>
  );
}
