import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SidebarNavigationSimple } from '@compass/shared-ui';
import { getNavigationItems } from '../navigation/navigation';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';
import { AdminHeader } from './AdminHeader';
import type { AdminLayoutProps } from '../../types/components';

export const AdminLayout = ({ children, activeUrl }: AdminLayoutProps) => {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation();
  const navigationItems = getNavigationItems(locale || 'en', t);

  return (
    <div
      data-qa-id="admin-layout"
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <SidebarNavigationSimple
        activeUrl={activeUrl}
        items={navigationItems}
        showAccountCard={false}
      />

      {/* Main content area - positioned to account for fixed sidebar */}
      <div
        data-qa-id="admin-layout-content"
        className="lg:ps-72 flex flex-col min-h-screen"
      >
        <AdminHeader
          title={t('welcome.title')}
          subtitle={t('welcome.subtitle')}
          userName="Faisal"
          userRole="Govt. Admin"
          trailingContent={<LanguageSwitcher />}
          hideBorder={false}
        />
        <main
          data-qa-id="admin-layout-main"
          className="flex-1 px-4 py-8 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
