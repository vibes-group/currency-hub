import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/globals.css';
import App from './app';
import { registerServiceWorker } from './app/register-service-worker';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element was not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerServiceWorker();
