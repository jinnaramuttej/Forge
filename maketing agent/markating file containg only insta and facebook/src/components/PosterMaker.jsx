import React, { useState } from 'react';
import { Sparkles, Layers, Pencil, RefreshCw, Download, Check } from 'lucide-react';

export default function PosterMaker({ showToast }) {
  return (
    <section className="section" id="poster">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-head-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'grid', placeItems: 'center', color: 'white' }}>🎨</div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>AI Poster Maker</h2>
            </div>
            <p className="section-sub" style={{ fontSize: '0.9rem' }}>Create professional social media creatives in seconds.</p>
          </div>
        </div>

        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', minHeight: 480, gap: '2rem', padding: '2rem' }}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Tell AI what you want</h3>
            
            <div className="form-group">
              <label className="form-label">Campaign / Product Name</label>
              <input className="form-input" defaultValue="Enter product or campaign" />
            </div>
            <div className="form-group">
              <label className="form-label">Poster Topic</label>
              <input className="form-input" defaultValue="Describe what you want to promote..." />
            </div>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <input className="form-input" defaultValue="College students, founders, customers..." />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div className="form-group">
                <label className="form-label">Platform</label>
                <select className="form-select">
                  <option>Instagram Post</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Style</label>
                <select className="form-select">
                  <option>Modern</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto', paddingTop: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => showToast('Generated poster!', 'success')}>
                <Sparkles size={16} /> Generate Poster
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                Generate 3 Designs
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.8rem' }}>Poster Preview</div>
            <div style={{ flex: 1, borderRadius: 12, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem', background: 'linear-gradient(135deg,#1a0b2e 0%,#2d1b4e 40%,#0f1830 70%,#1e0e2e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontFamily: "'Montserrat'", fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.8rem', color: 'white' }}>LAUNCH<br/>YOUR NEXT<br/>BIG IDEA 🚀</h2>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: 280 }}>AI-powered tools for<br/>modern startups</p>
                <button style={{ display: 'inline-flex', padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: 'white', borderRadius: 100, fontWeight: 700, fontSize: '0.85rem', border: 'none' }}>TRY IT NOW</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}><Pencil size={14} /> Edit Text</button>
              <button className="btn btn-ghost" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}><RefreshCw size={14} /> Regenerate</button>
              <button className="btn btn-ghost" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}><Download size={14} /> Download</button>
              <button className="btn btn-ghost" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', color: 'var(--purple)', borderColor: 'var(--purple)' }}>Use for Campaign</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
