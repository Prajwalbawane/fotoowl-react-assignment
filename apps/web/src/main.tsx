import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MediaProvider } from '@headless-media/react';
import { App } from './App.js';
import './styles/global.css';

const apiKey = (import.meta.env['VITE_PEXELS_API_KEY'] as string | undefined) || '';

function Root() {
  return (
    <StrictMode>
      <BrowserRouter>
        <MediaProvider apiKey={apiKey}>
          <App />
        </MediaProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

const root = document.getElementById('root');
if (root === null) throw new Error('Root element not found');

createRoot(root).render(<Root />);
