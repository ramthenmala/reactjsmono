import { Suspense } from 'react';
import { AppRouter } from '../shared/lib/router';
import { LanguageProvider } from '../shared/lib/i18n';

// Import i18n configuration
import '../shared/lib/i18n/i18n';

export function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LanguageProvider>
        <AppRouter />
      </LanguageProvider>
    </Suspense>
  );
}

export default App;
