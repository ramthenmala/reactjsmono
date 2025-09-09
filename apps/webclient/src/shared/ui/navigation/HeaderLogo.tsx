import type { HeaderLogoProps } from '../../types/headerLogo';

export function HeaderLogo({ className = '' }: HeaderLogoProps) {
  return (
    <img
      src="/assets/images/brand/logo.svg"
      alt="Compass"
      className={`h-8 w-auto ${className}`}
    />
  );
}
