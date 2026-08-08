import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import { SearchPage } from './pages/SearchPage.js';
import { ReelsPage } from './pages/ReelsPage.js';

interface AppProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function App({ apiKey, onApiKeyChange }: AppProps) {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [showKeyInput, setShowKeyInput] = useState(
    !apiKey || apiKey.includes('563492ad6f9170000100000155b9e07584104c868fa0630b95764d26'),
  );

  return (
    <div className="app">
      <header className="app-header">
        <NavLink to="/" className="app-logo">
          MediaSDK <span className="app-logo-badge">Demo</span>
        </NavLink>
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Photos
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Search
          </NavLink>
          <NavLink
            to="/reels"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Reels
          </NavLink>
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="retry-btn"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            onClick={() => setShowKeyInput(!showKeyInput)}
            type="button"
          >
            🔑 Pexels API Key
          </button>
        </div>
      </header>

      {showKeyInput && (
        <div
          style={{
            background: '#1f1f24',
            borderBottom: '1px solid #2e2e36',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#ffb86b', fontWeight: 600 }}>
            Pexels API Key:
          </span>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Paste your free Pexels API key here (pexels.com/api)"
            style={{
              flex: 1,
              minWidth: 260,
              padding: '0.375rem 0.75rem',
              background: '#0f0f11',
              border: '1px solid #3e3e48',
              borderRadius: 4,
              color: '#fff',
              fontSize: '0.85rem',
            }}
          />
          <button
            className="search-btn"
            style={{ padding: '0.375rem 0.875rem', fontSize: '0.85rem' }}
            onClick={() => {
              onApiKeyChange(keyInput.trim());
              setShowKeyInput(false);
            }}
            type="button"
          >
            Save Key
          </button>
        </div>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reels" element={<ReelsPage />} />
        </Routes>
      </main>
    </div>
  );
}
