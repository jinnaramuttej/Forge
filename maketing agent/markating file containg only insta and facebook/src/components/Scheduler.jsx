import React from 'react';
import { Clock, Instagram, Facebook } from 'lucide-react';

export default function Scheduler({ showToast }) {
  return (
    <section className="section" id="scheduler">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-head-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'grid', placeItems: 'center', color: 'white' }}>📅</div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Smart Scheduler</h2>
            </div>
            <p className="section-sub" style={{ fontSize: '0.9rem' }}>Schedule your posts across all platforms in one click.</p>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* LEFT */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Schedule Options</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Date</label>
                <input type="date" className="form-input" defaultValue="2026-08-22" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Time</label>
                <input type="time" className="form-input" defaultValue="09:00" />
              </div>
              
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Platforms</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--purple)' }} /> 
                    <Instagram size={16} color="var(--purple)"/> Instagram
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#1877f2' }} /> 
                    <Facebook size={16} color="#1877f2"/> Facebook
                  </label>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => showToast('Post scheduled successfully!', 'success')}>
                <Clock size={16} /> Schedule Post
              </button>
            </div>

            {/* RIGHT (CALENDAR PREVIEW) */}
            <div style={{ background: 'var(--bg-deep)', borderRadius: 12, padding: '1.5rem', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ fontWeight: 700 }}>August 2026</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} style={{ 
                    aspectRatio: '1', display: 'grid', placeItems: 'center', fontSize: '0.8rem',
                    background: i === 21 ? 'var(--grad-primary)' : 'rgba(255,255,255,0.02)',
                    borderRadius: 8, cursor: 'pointer',
                    color: i === 21 ? 'white' : 'var(--text)'
                  }}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
