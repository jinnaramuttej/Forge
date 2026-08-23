import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Plus } from 'lucide-react';

export default function Dashboard() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Curated Marketing Intelligence</div>
          <h1>Craft your brand's <i>narrative</i></h1>
          <p className="hero-sub">
            Design, write, and schedule premium social media campaigns with an AI tailored to luxury and elegance.
          </p>
          <div className="hero-cta">
            <Link to="/campaigns" className="btn btn-primary">Start Campaign</Link>
            <a href="#connect" className="btn btn-ghost">View Accounts</a>
          </div>
        </div>
      </section>

      <section className="section" id="connect">
        <div className="section-inner">
          <div className="section-head">
            <span className="section-tag">Integration</span>
            <h2>Seamless Connection</h2>
            <p className="section-sub">Unify your brand presence across all high-end platforms.</p>
          </div>

          <div className="card">
            <div className="connect-grid">
              <div className="connect-intro">
                <h3>Omnichannel Elegance.</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.8 }}>
                  Manage your entire social portfolio from one refined dashboard. Analytics and publishing, streamlined.
                </p>
              </div>
              <div className="social-card">
                <Instagram style={{ color: 'var(--accent-primary)', width: 32, height: 32 }} />
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'Inter' }}>Instagram</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>@maison_atelier</p>
                </div>
                <button className="btn btn-ghost" style={{ padding: '0.8rem', width: '100%' }}>Configure</button>
              </div>
              <div className="social-card" style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <Plus style={{ color: 'var(--text-dim)', width: 32, height: 32 }} />
                <p style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Link Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        .hero {
          position: relative;
          min-height: 90vh;
          padding: 8rem 3rem 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 900px;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.2rem;
          background: rgba(172, 156, 141, 0.15);
          border: 1px solid var(--card-border);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--accent-primary);
          margin-bottom: 2.5rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .hero h1 {
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          margin-bottom: 2rem;
          color: var(--text);
        }
        .hero h1 i {
          font-style: italic;
          color: var(--accent-primary);
          font-weight: 400;
        }
        .hero-sub {
          font-size: 1.25rem;
          color: var(--text-dim);
          max-width: 640px;
          margin: 0 auto 3.5rem;
          line-height: 1.8;
          font-weight: 300;
        }
        .hero-cta {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }
        .connect-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 3rem;
        }
        .connect-intro {
          padding-right: 3rem;
          border-right: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .connect-intro h3 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        .social-card {
          padding: 2.5rem;
          background: var(--bg-base);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }
        .social-card:hover {
          background: white;
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
}
