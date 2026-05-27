import { Navigate, Outlet, Route, Routes, useParams } from 'react-router';

import { I18nProvider } from '@/i18n/provider';
import { isLocale, routing, type Locale } from '@/i18n/routing';
import { DemoPage } from '@/screens/demo';
import { HomePage } from '@/screens/home';
import { ListPage } from '@/screens/list';

function LocaleRoute() {
  const params = useParams();

  if (!isLocale(params.locale)) {
    return <Navigate to={`/${routing.defaultLocale}`} replace />;
  }

  return (
    <I18nProvider locale={params.locale as Locale}>
      <Outlet />
    </I18nProvider>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${routing.defaultLocale}`} replace />}
      />
      <Route path="/:locale" element={<LocaleRoute />}>
        <Route index element={<HomePage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="list" element={<ListPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={`/${routing.defaultLocale}`} replace />}
      />
    </Routes>
  );
}
