import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DashboardPage } from '../../features/dashboard';
import { AnalyticsPage } from '../../features/analytics';
import { UsersPage, ConnectRequestsPage } from '../../features/users';
import { 
  FilterCriteriaPage, 
  IsicRelevancePage, 
  FeaturedLandsPage, 
  ConfigurationHistoryPage 
} from '../../features/configuration';
import { LocaleWrapper } from '../i18n/LocaleWrapper';

export const AdminRoutes = () => {
  const location = useLocation();

  return (
    <LocaleWrapper>
      <AdminLayout activeUrl={location.pathname + location.hash}>
        <Routes>
          <Route path="/" element={<Navigate to="analytics" replace />} />
          <Route path="overview" element={<DashboardPage />} />
          <Route path="investors" element={<UsersPage />} />
          <Route path="connect-requests" element={<ConnectRequestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="configuration/filter-criteria" element={<FilterCriteriaPage />} />
          <Route path="configuration/isic-relevance" element={<IsicRelevancePage />} />
          <Route path="configuration/featured-lands" element={<FeaturedLandsPage />} />
          <Route path="configuration/history" element={<ConfigurationHistoryPage />} />
        </Routes>
      </AdminLayout>
    </LocaleWrapper>
  );
};
