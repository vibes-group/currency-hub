import { BrowserRouter } from 'react-router';
import { AppRouter } from './router';
import { ThemeProvider } from './theme-provider';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
