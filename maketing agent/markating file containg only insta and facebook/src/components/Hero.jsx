import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

export default function Hero({ scrollToSection }) {
  return (
    <section style={{ position: 'relative', minHeight: '90vh', padding: '9rem 2rem 4rem', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1500, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, fontSize: '0.78rem', fontWeight: 500, color: '#10b981', marginBottom: '2rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
          AI Marketing Assistant Online
        </div>
        <h1 style={{ fontSize: 'clamp(3rem,8vw,6.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1.5rem', background: 'linear-gradient(180deg,#ffffff 0%,#a8a8c0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Marketing<br/>
          <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hub</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 580, lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Create, publish and schedule your startup's social media content with AI. From idea to published post — one unified workspace.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => scrollToSection('poster')}>
            <Sparkles size={16} /> Create Campaign
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToSection('connect')}>
            <Plus size={16} /> Connect Socials
          </button>
        </div>
      </div>
    </section>
  );
}
