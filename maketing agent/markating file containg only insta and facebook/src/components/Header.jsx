import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-mark">A</div>
          <span>Atelier Hub</span>
        </div>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/campaigns" className={location.pathname === '/campaigns' ? 'active' : ''}>
            Campaigns
          </Link>
          <Link to="#" className={location.pathname === '/analytics' ? 'active' : ''}>
            Analytics
          </Link>
        </nav>
        <div className="header-right">
          <div className="avatar">L</div>
        </div>
      </div>
      
      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          background: rgba(239, 233, 225, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--card-border);
          transition: padding 0.3s var(--ease-quiet);
        }
        .header-inner {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: 1.2rem;
          letter-spacing: 0.02em;
        }
        .logo-mark {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          background: var(--text);
          color: var(--bg-base);
          border-radius: 50%;
          font-size: 1rem;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav a {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-dim);
          text-decoration: none;
          transition: all 0.25s var(--ease-quiet);
          position: relative;
        }
        .nav a:hover {
          color: var(--accent-primary);
        }
        .nav a.active {
          color: var(--text);
          font-weight: 600;
        }
        .nav a.active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--accent-primary);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--accent-primary);
          display: grid;
          place-items: center;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          color: white;
          box-shadow: 0 4px 15px rgba(114, 56, 61, 0.2);
        }
      `}</style>
    </header>
  );
}
