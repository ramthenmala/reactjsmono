import { useTranslation } from 'react-i18next';

export const ConnectRequestsPage = () => {
  const { t } = useTranslation();

  return (
    <div data-qa-id="connect-requests-page" className="space-y-6">
      <h1
        data-qa-id="connect-requests-title"
        className="text-3xl font-bold text-gray-900 dark:text-white"
      >
        {t('navigation.connectRequests')}
      </h1>
    </div>
  );
};
