import { Route, Routes } from 'react-router';

import { DemoPage } from '@/screens/demo';
import { HomePage } from '@/screens/home';
import { ListPage } from '@/screens/list';

export function AppRouter() {
  return (
    <I18nProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </I18nProvider>
  );
}
