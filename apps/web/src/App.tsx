import { Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import { SearchPage } from './pages/SearchPage.js';
import { ReelsPage } from './pages/ReelsPage.js';

export function App() {
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
      </header>

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
