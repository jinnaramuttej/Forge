import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Bell, Check, Sparkles, MessageSquare, Send, X } from 'lucide-react'
import MarketingHub from './pages/MarketingHub'
import SchedulerAnalytics from './pages/SchedulerAnalytics'

import { chatWithAssistant } from './services/ai'

/* ─── AI ASSISTANT ─── */
function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role:'ai', text:'Hey Founder 👋\nWhat are we marketing today?' },
    { role:'ai', text:'Here are some suggestions:\n• Create a launch campaign\n• Make an Instagram poster\n• Write today\'s caption\n• Suggest the best posting time' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const send = async () => {
    if(!input.trim() || isLoading) return
    const userMsg = { role:'user', text:input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    
    // Call AI service
    const aiResponse = await chatWithAssistant(newMessages)
    setMessages([...newMessages, aiResponse])
    setIsLoading(false)
  }

  if(!isOpen) return null
  return (
    <div style={{ position:'fixed', bottom:'2rem', right:'2rem', width:380, height:520, background:'rgba(7,7,12,0.96)', border:'1px solid rgba(139,92,246,0.4)', borderRadius:24, boxShadow:'0 24px 60px rgba(0,0,0,0.6),0 0 40px rgba(139,92,246,0.15)', zIndex:1000, display:'flex', flexDirection:'column', overflow:'hidden', backdropFilter:'blur(20px)' }}>
      <div style={{ padding:'1.2rem', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'linear-gradient(90deg,rgba(139,92,246,0.1),transparent)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#8b5cf6,#3b82f6,#ec4899)', display:'grid', placeItems:'center', color:'white' }}><Sparkles size={14}/></div>
          <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#f5f5fa' }}>AI Assistant</div>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'#9292a8', cursor:'pointer' }}><X size={18}/></button>
      </div>
      <div style={{ flex:1, padding:'1.5rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1rem' }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ alignSelf:m.role==='user'?'flex-end':'flex-start', maxWidth:'85%' }}>
            <div style={{ background:m.role==='user'?'#8b5cf6':'rgba(255,255,255,0.03)', color:m.role==='user'?'white':'#f5f5fa', padding:'0.8rem 1rem', borderRadius:12, border:m.role==='ai'?'1px solid rgba(255,255,255,0.07)':'none', fontSize:'0.85rem', lineHeight:1.6, whiteSpace:'pre-line' }}>{m.text}</div>
          </div>
        ))}
        {isLoading && <div style={{ alignSelf:'flex-start', color:'#9292a8', fontSize:'0.8rem', fontStyle:'italic' }}>Typing...</div>}
      </div>
      <div style={{ padding:'1rem', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'0.4rem 0.4rem 0.4rem 1rem' }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything..." style={{ flex:1, background:'none', border:'none', color:'#f5f5fa', outline:'none', fontSize:'0.85rem' }} disabled={isLoading}/>
          <button onClick={send} style={{ width:32, height:32, borderRadius:8, background:'#8b5cf6', border:'none', color:'white', display:'grid', placeItems:'center', cursor:isLoading?'not-allowed':'pointer', opacity:isLoading?0.5:1 }} disabled={isLoading}><Send size={14}/></button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
export default function App() {
  const [toast, setToast] = useState({ show:false, msg:'', type:'success' })
  const [aiOpen, setAiOpen] = useState(false)

  const showToast = (msg, type='success') => {
    setToast({ show:true, msg, type })
    setTimeout(()=>setToast(p=>({...p, show:false})), 3000)
  }

  const navStyle = (isActive) => ({
    padding:'0.55rem 1.1rem', fontSize:'0.85rem', fontWeight:500,
    color: isActive ? '#f5f5fa' : '#9292a8',
    background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
    boxShadow: isActive ? 'inset 0 0 0 1px rgba(139,92,246,0.3)' : 'none',
    textDecoration:'none', borderRadius:10, transition:'all 0.2s'
  })

  return (
    <BrowserRouter>
      <div>
        {/* HEADER */}
        <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'0.8rem 2rem', background:'rgba(7,7,12,0.85)', backdropFilter:'blur(20px) saturate(140%)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ maxWidth:1500, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontFamily:"'Montserrat',sans-serif", fontWeight:800, color:'#f5f5fa' }}>
              <div style={{ width:32, height:32, display:'grid', placeItems:'center', background:'linear-gradient(135deg,#8b5cf6,#3b82f6,#ec4899)', borderRadius:9, boxShadow:'0 4px 20px rgba(139,92,246,0.4)', fontSize:'0.95rem' }}>🚀</div>
              <span style={{ fontSize:'1rem' }}>StartupAI</span>
            </div>

            <nav style={{ display:'flex', alignItems:'center', gap:'0.2rem', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'0.3rem' }}>
              <NavLink to="/" style={({isActive})=>navStyle(false)}>Dashboard</NavLink>
              <NavLink to="/" style={({isActive})=>navStyle(false)}>Ideas</NavLink>
              <NavLink to="/" end style={({isActive})=>navStyle(isActive)}>Marketing</NavLink>
              <NavLink to="/analytics" style={({isActive})=>navStyle(isActive)}>Analytics</NavLink>
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.35rem 0.7rem', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:100, fontSize:'0.72rem', color:'#10b981' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}></span> Online
              </div>
              <button style={{ width:36, height:36, display:'grid', placeItems:'center', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, color:'#9292a8', cursor:'pointer' }}><Bell size={16}/></button>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', display:'grid', placeItems:'center', fontFamily:"'Montserrat',sans-serif", fontWeight:800, fontSize:'0.8rem', color:'white' }}>F</div>
                <div>
                  <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#f5f5fa' }}>Founder</div>
                  <div style={{ fontSize:'0.65rem', color:'#5a5a70' }}>Pro Plan</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ROUTES */}
        <main style={{ paddingTop:'4rem' }}>
          <Routes>
            <Route path="/" element={<MarketingHub showToast={showToast} />} />
            <Route path="/analytics" element={<SchedulerAnalytics showToast={showToast} />} />
          </Routes>
        </main>

        {/* AI FAB */}
        {!aiOpen && (
          <button onClick={()=>setAiOpen(true)} style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:999, width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#3b82f6,#ec4899)', border:'none', color:'white', display:'grid', placeItems:'center', cursor:'pointer', boxShadow:'0 8px 32px rgba(139,92,246,0.4)', fontSize:'1.2rem' }}>
            <span>AI</span>
          </button>
        )}
        <AIAssistant isOpen={aiOpen} onClose={()=>setAiOpen(false)}/>

        {/* TOAST */}
        {toast.show && (
          <div style={{ position:'fixed', bottom:'2rem', left:'2rem', zIndex:1000, background:'rgba(15,15,25,0.95)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:12, padding:'0.85rem 1.1rem', display:'flex', alignItems:'center', gap:'0.6rem', color:'#f5f5fa', boxShadow:'0 12px 32px rgba(0,0,0,0.4)', animation:'fadeIn 0.3s' }}>
            <div style={{ width:24, height:24, borderRadius:6, display:'grid', placeItems:'center', background:'rgba(16,185,129,0.15)', color:'#34d399' }}><Check size={14}/></div>
            {toast.msg}
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}
