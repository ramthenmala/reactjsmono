import { Suspense } from 'react';
import { AppRouter } from '../shared/lib/router';
import { LoadingIndicator } from '@compass/shared-ui';

// Import i18n configuration
import '../shared/lib/i18n/i18n';

export function App() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size="lg" label="Loading application..." />
      </div>
    }>
      <AppRouter />
    </Suspense>
  );
}

export default App;
