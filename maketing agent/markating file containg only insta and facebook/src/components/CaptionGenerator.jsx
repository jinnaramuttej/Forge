import React from 'react';
import { Copy, RefreshCw, Instagram } from 'lucide-react';

export default function CaptionGenerator({ showToast }) {
  return (
    <section className="section" id="caption">
      <div className="section-inner">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'grid', placeItems: 'center', color: 'white' }}>✍️</div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>AI Caption & Hashtag Generator</h2>
          </div>
          <p className="section-sub" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Turn your campaign into engaging social media content.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* LEFT */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.7rem' }}>Platform</label>
                  <select className="form-select" style={{ fontSize: '0.8rem', padding: '0.6rem' }}>
                    <option>Instagram</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.7rem' }}>Tone</label>
                  <select className="form-select" style={{ fontSize: '0.8rem', padding: '0.6rem' }}>
                    <option>Professional</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.7rem' }}>Length</label>
                  <select className="form-select" style={{ fontSize: '0.8rem', padding: '0.6rem' }}>
                    <option>Medium</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => showToast('Generated caption!')}>
                ✨ Generate Caption
              </button>
            </div>

            {/* RIGHT */}
            <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                🚀 Your startup journey just got smarter.<br/><br/>
                Turn your ideas into action with AI-powered tools designed for modern founders.<br/><br/>
                Start building today.
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Hashtags</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['#Startup', '#AI', '#Entrepreneurship', '#Innovation', '#BuildInPublic'].map(t => (
                    <span key={t} style={{ padding: '0.2rem 0.6rem', background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', borderRadius: 6, fontSize: '0.75rem' }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }} onClick={() => showToast('Copied!')}><Copy size={14}/> Copy Caption</button>
                <button className="btn btn-ghost" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}><RefreshCw size={14}/> Regenerate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
