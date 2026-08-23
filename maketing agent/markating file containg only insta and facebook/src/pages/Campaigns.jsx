import React from 'react';

export default function Campaigns() {
  return (
    <>
      <section className="section" id="poster">
        <div className="section-inner">
          <div className="section-head">
            <span className="section-tag">Creative Studio</span>
            <h2>The Atelier</h2>
            <p className="section-sub">Generate bespoke visual assets tailored perfectly to your brand's aesthetic.</p>
          </div>

          <div className="poster-card">
            <div className="poster-form">
              <div className="form-group">
                <label className="form-label">Campaign Title</label>
                <input className="form-input" defaultValue="Autumn Collection Preview" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject & Essence</label>
                <textarea className="form-textarea" rows={3} defaultValue="Introducing the new silk scarves. Warm, inviting, and effortlessly chic." />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Generate Assets
              </button>
            </div>
            <div className="poster-preview">
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>
                Canvas · 1080x1080
              </div>
              <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                <h2 style={{ fontSize: '3.5rem', color: 'var(--card-bg)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  Autumn.
                </h2>
                <p style={{ fontSize: '1.2rem', fontWeight: 300, opacity: 0.9 }}>The Silk Collection</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.8rem' }}>MAISON ATELIER</span>
                <button className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .poster-card {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 5rem;
          padding: 0;
          background: transparent;
          box-shadow: none;
          border: none;
        }
        .poster-form {
          background: white;
          padding: 4rem;
          border-radius: 8px;
          box-shadow: var(--shadow-subtle);
          border: 1px solid var(--card-border);
        }
        .poster-preview {
          background: var(--text);
          padding: 4rem;
          border-radius: 8px;
          color: var(--bg-base);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-hover);
          position: relative;
          overflow: hidden;
        }
        .poster-preview::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 80% 20%, rgba(114,56,61,0.2), transparent 50%);
          pointer-events: none;
        }
        .form-group {
          margin-bottom: 2rem;
        }
        .form-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.8rem;
        }
        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 1.2rem;
          background: var(--bg-base);
          border: 1px solid var(--card-border);
          border-radius: 4px;
          color: var(--text);
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: var(--accent-primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(114, 56, 61, 0.1);
        }
      `}</style>
    </>
  );
}
