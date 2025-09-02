import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoutes } from '../lib/router';
import '../lib/i18n';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:locale/*" element={<AdminRoutes />} />
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
