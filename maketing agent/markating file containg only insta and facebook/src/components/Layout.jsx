import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="logo" style={{ justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Playfair Display' }}>
          Atelier Hub
        </div>
        <p>Elevated AI Marketing · 2026</p>
      </footer>
      <style>{`
        .footer {
          padding: 6rem 3rem;
          text-align: center;
          border-top: 1px solid var(--card-border);
          background: white;
        }
        .footer p {
          color: var(--text-dim);
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}
