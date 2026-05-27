import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { AppRouter } from '@/config/app-router';
import { ConfigProvider } from '@/config/config-provider';
import '@/config/styles/globals.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element was not found');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <AppRouter />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
