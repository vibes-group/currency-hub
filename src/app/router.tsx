import { Navigate, Route, Routes } from 'react-router';

import { DemoPage } from '@/screens/demo';
import { HomePage } from '@/screens/home';
import { ListPage } from '@/screens/list';
import { SettingsPage } from '@/screens/settings';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
