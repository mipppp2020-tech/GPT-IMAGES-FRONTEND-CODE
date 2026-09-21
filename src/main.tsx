import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './styles/tokens.css';
import './styles/base.css';
import './components/primitives.css';
import { router } from './app/routes';
import { I18nProvider } from './i18n';
import { AppProvider } from './app/AppContext';
import { PipelineProvider } from './app/PipelineContext';
import { RiderProvider } from './app/RiderContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider initial="mr">
      <AppProvider role="rider" demo={new URLSearchParams(location.search).has('demo')}>
        <PipelineProvider>
          <RiderProvider>
            <RouterProvider router={router} />
          </RiderProvider>
        </PipelineProvider>
      </AppProvider>
    </I18nProvider>
  </StrictMode>,
);
