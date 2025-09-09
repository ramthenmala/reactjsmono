import React from 'react';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import clsx from 'clsx';

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * RTLWrapper component that automatically handles RTL/LTR layout
 * This component wraps content and applies appropriate classes for RTL support
 */
export const RTLWrapper: React.FC<RTLWrapperProps> = ({
  children,
  className,
}) => {
  const { isRTL, direction } = useLanguage();

  return (
    <div
      className={clsx(
        // Base classes
        'rtl-wrapper',
        // Direction-specific classes
        {
          rtl: isRTL,
          ltr: !isRTL,
        },
        className,
      )}
      dir={direction}
    >
      {children}
    </div>
  );
};
