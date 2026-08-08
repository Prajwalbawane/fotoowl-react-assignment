import { useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MediaProvider } from '@headless-media/react';
import { App } from './App.js';
import './styles/global.css';

function Root() {
  const [apiKey, setApiKey] = useState(() => {
    return (
      localStorage.getItem('pexels_api_key') ||
      (import.meta.env['VITE_PEXELS_API_KEY'] as string | undefined) ||
      ''
    );
  });

  const handleApiKeyChange = (newKey: string) => {
    localStorage.setItem('pexels_api_key', newKey);
    setApiKey(newKey);
  };

  return (
    <StrictMode>
      <BrowserRouter>
        <MediaProvider apiKey={apiKey || 'missing_key'}>
          <App apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        </MediaProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

const root = document.getElementById('root');
if (root === null) throw new Error('Root element not found');

createRoot(root).render(<Root />);
