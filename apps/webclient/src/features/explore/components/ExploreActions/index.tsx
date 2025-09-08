"use client";
import { Button } from "@compass/shared-ui";
import { Share01 } from "@untitledui/icons";
import { useLocaleTranslation } from '@/shared/lib/i18n';

interface ExploreActionsProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

export function ExploreActions({ size = "sm", variant = "light", className = "" }: ExploreActionsProps) {
  const { t } = useLocaleTranslation();
  
  const commonClasses = "relative overflow-hidden rounded-xl backdrop-blur-xl px-3 py-2 text-white shadow-md before:absolute before:inset-0 before:rounded-xl before:border before:border-white/80 before:opacity-50 before:content-[''] before:pointer-events-none before:z-0";
  const bgClass = variant === "dark" ? "bg-black/50" : "bg-white/50";
  const buttonClasses = `${commonClasses} ${bgClass}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button size={size} color="tertiary" className={buttonClasses}>
        <svg className="me-2 inline-block size-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
        </svg>
        <span className="relative z-10">{t('common.compare')}</span>
      </Button>
      <Button size={size} color="tertiary" className={buttonClasses}>
        <Share01 data-icon className="me-2 inline-block size-5 relative z-10" />
        <span className="relative z-10">{t('common.share')}</span>
      </Button>
    </div>
  );
}

export default ExploreActions;