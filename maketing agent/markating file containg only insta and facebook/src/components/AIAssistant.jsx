import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';

export default function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I can help you generate ideas, write captions, or create marketing strategies. What should we work on today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'ai', text: 'Got it. Let me generate some ideas based on that...' }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', width: 380, height: 500,
      background: 'rgba(7,7,12,0.95)', border: '1px solid var(--purple)', borderRadius: 24,
      boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)',
      zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', background: 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: 'white' }}>
            <Sparkles size={14} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>AI Co-Founder</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{ 
              background: m.role === 'user' ? 'var(--purple)' : 'var(--card-bg)', 
              color: m.role === 'user' ? 'white' : 'var(--text)',
              padding: '0.8rem 1rem', borderRadius: 12, border: m.role === 'ai' ? '1px solid var(--card-border)' : 'none',
              fontSize: '0.85rem', lineHeight: 1.5
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '0.4rem 0.4rem 0.4rem 1rem' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI for ideas..."
            style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text)', outline: 'none', fontSize: '0.85rem' }}
          />
          <button onClick={handleSend} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--purple)', border: 'none', color: 'white', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
