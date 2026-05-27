import { BrowserRouter } from 'react-router';
import { AppRouter } from './router';
import { ThemeProvider } from './theme-provider';
import { I18nProvider } from '@/i18n';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
    <I18nProvider>
        <AppRouter />
      </I18nProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
