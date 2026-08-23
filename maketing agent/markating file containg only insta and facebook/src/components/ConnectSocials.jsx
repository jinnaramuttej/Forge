import React from 'react';
import { Plus, Instagram, Facebook, PlusCircle } from 'lucide-react';

export default function ConnectSocials() {
  return (
    <section className="section" id="connect">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-head-left">
            <h2>Connected Social Accounts</h2>
            <p className="section-sub">Connect your social platforms to publish and schedule content.</p>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#f09433,#dc2743)', color: 'white' }}>
                    <Instagram size={20} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat'", fontWeight: 700, fontSize: '1rem' }}>Instagram</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@yourstartup</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--green)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}></span> Connected
                </span>
                <button style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
              </div>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: '#1877f2', color: 'white' }}>
                    <Facebook size={20} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat'", fontWeight: 700, fontSize: '1rem' }}>Facebook</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your Startup Page</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--green)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}></span> Connected
                </span>
                <button style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
              </div>
            </div>

            <button style={{ background: 'transparent', border: '1.5px dashed var(--card-border)', borderRadius: 12, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', minHeight: '140px' }}>
              <Plus size={24} /> Connect Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
