import { useTranslation } from 'react-i18next';
import type { PageHeaderProps } from '../../types/components';

export const PageHeader = ({
  titleKey,
  showBorder = true,
  className = '',
}: PageHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div
      data-qa-id="page-header"
      className={`${
        showBorder ? 'border-b border-gray-200 pb-5 dark:border-gray-700' : ''
      } ${className}`}
    >
      <h1
        data-qa-id="page-header-title"
        className="text-3xl font-bold leading-6 text-gray-900 dark:text-white"
      >
        {t(titleKey)}
      </h1>
    </div>
  );
};
