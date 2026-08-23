import React, { useState } from 'react'
import { Sparkles, PlusCircle, Pencil, RefreshCw, Download, Copy, Send, X } from 'lucide-react'
import { generateCaptionText, generatePosterContent } from '../services/ai'
import { publishViaAyrshare } from '../services/social'

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

export default function MarketingHub({ showToast }) {
  // Caption State
  const [captionPlatform, setCaptionPlatform] = useState('Instagram')
  const [captionTone, setCaptionTone] = useState('Professional')
  const [captionLength, setCaptionLength] = useState('Medium')
  const [captionResult, setCaptionResult] = useState('🚀 Your startup journey just got smarter.\n\nTurn your ideas into action with AI-powered tools designed for modern founders.\n\nStart building today. 💡')
  const [captionHashtags, setCaptionHashtags] = useState(['#Startup','#AI','#Entrepreneurship','#Innovation','#BuildInPublic'])
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)

  // Poster State
  const [posterCampaign, setPosterCampaign] = useState('Enter product or campaign')
  const [posterTopic, setPosterTopic] = useState('Describe what you want to promote...')
  const [posterAudience, setPosterAudience] = useState('College students, founders, customers...')
  const [posterData, setPosterData] = useState({
    title: "LAUNCH\nYOUR NEXT\nBIG IDEA 🚀",
    subtitle: "AI-powered tools for modern startups",
    keyword: "startup"
  })
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false)

  // Social Post State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [postToInstagram, setPostToInstagram] = useState(true)
  const [postToFacebook, setPostToFacebook] = useState(true)

  const handlePublish = async () => {
    setIsPublishing(true)
    
    try {
      const platforms = [];
      if (postToFacebook) platforms.push('facebook');
      if (postToInstagram) platforms.push('instagram');

      if (platforms.length === 0) {
        showToast('Please select at least one platform', 'error');
        return;
      }

      await publishViaAyrshare(
        captionResult, 
        `https://picsum.photos/seed/${posterData.keyword}/800/800`, 
        platforms
      );

      showToast('Successfully posted to selected platforms!')
      setIsPostModalOpen(false)
    } catch (err) {
      showToast('Failed to post. Check console.', 'error')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true)
    const result = await generateCaptionText(posterCampaign, captionPlatform, captionTone, captionLength)
    
    // Simple parser to separate caption and hashtags
    const parts = result.split('#')
    const captionText = parts[0].trim()
    
    const tags = []
    for(let i=1; i<parts.length; i++) {
      tags.push('#' + parts[i].split(' ')[0].split('\n')[0].trim())
    }

    setCaptionResult(captionText || result)
    if(tags.length > 0) setCaptionHashtags(tags.slice(0, 8))
    
    setIsGeneratingCaption(false)
    showToast('Caption generated successfully!')
  }

  const handleGeneratePoster = async () => {
    setIsGeneratingPoster(true)
    try {
      const result = await generatePosterContent(posterCampaign, posterTopic, posterAudience)
      console.log('[Poster] AI returned:', result)
      
      // add line breaks to title if it's too long
      let formattedTitle = result.title;
      if(formattedTitle.length > 15 && !formattedTitle.includes('\n')) {
         formattedTitle = formattedTitle.replace(/ /g, '\n')
      }

      setPosterData({
        title: formattedTitle.toUpperCase(),
        subtitle: result.subtitle,
        keyword: result.keyword
      })
      
      showToast('Poster generated successfully!')
    } catch (err) {
      console.error('[Poster] Generation failed:', err)
      showToast('Poster generation failed — check console')
    } finally {
      setIsGeneratingPoster(false)
    }
  }

  return (
    <div>
      {/* ─── HERO ─── */}
      <section style={{ position:'relative', padding:'4rem 2rem 3rem', display:'flex', alignItems:'center' }}>
        <div style={{ position:'relative', zIndex:2, maxWidth:1500, margin:'0 auto', width:'100%' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 1rem', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:100, fontSize:'0.78rem', fontWeight:500, color:'#10b981', marginBottom:'1.5rem' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981' }}></span>
            AI Marketing Assistant Online
          </div>
          <h1 style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'1rem', background:'linear-gradient(180deg,#fff 0%,#a8a8c0 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            AI Marketing Hub
          </h1>
          <p style={{ fontSize:'1.05rem', color:'#9292a8', maxWidth:580, lineHeight:1.6, marginBottom:'2rem' }}>
            Create, publish and schedule your startup's social media content with AI.
          </p>
        </div>
      </section>

      {/* ─── CONNECT SOCIALS ─── */}
      <section className="section" id="connect" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-head">
            <div className="section-head-left">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connected Social Accounts</h2>
              <p className="section-sub" style={{ fontSize: '0.9rem' }}>Connect your social platforms to publish and schedule content.</p>
            </div>
          </div>
          <div className="card" style={{ padding:'1.5rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.2rem' }}>
              <div style={{ padding:'1.2rem', display:'flex', flexDirection:'column', gap:'1rem', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, display:'grid', placeItems:'center', background:'linear-gradient(135deg,#f09433,#dc2743)', color:'white' }}><InstagramIcon size={18}/></div>
                  <div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, color:'#f5f5fa', fontSize: '0.95rem' }}>Instagram</div>
                    <div style={{ fontSize:'0.75rem', color:'#9292a8' }}>@yourstartup</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color:'#10b981' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}></span> Connected
                  </span>
                  <button className="btn btn-ghost" style={{ padding:'0.3rem 0.7rem', fontSize:'0.75rem' }}>Manage</button>
                </div>
              </div>
              <div style={{ padding:'1.2rem', display:'flex', flexDirection:'column', gap:'1rem', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, display:'grid', placeItems:'center', background:'#1877f2', color:'white' }}><FacebookIcon size={18}/></div>
                  <div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:700, color:'#f5f5fa', fontSize: '0.95rem' }}>Facebook</div>
                    <div style={{ fontSize:'0.75rem', color:'#9292a8' }}>Your Startup Page</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color:'#10b981' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}></span> Connected
                  </span>
                  <button className="btn btn-ghost" style={{ padding:'0.3rem 0.7rem', fontSize:'0.75rem' }}>Manage</button>
                </div>
              </div>
              <button style={{ background:'transparent', border:'1.5px dashed rgba(255,255,255,0.12)', borderRadius:12, color:'#9292a8', cursor:'pointer', fontSize:'0.85rem', fontWeight:600, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', minHeight:120 }}>
                <PlusCircle size={20}/> Connect Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POSTER MAKER ─── */}
      <section className="section" id="poster" style={{ paddingTop: '1rem' }}>
        <div className="section-inner">
          <div className="section-head">
            <div className="section-head-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'grid', placeItems: 'center', color: 'white', fontSize: '0.8rem' }}>🎨</div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>AI Poster Maker</h2>
              </div>
              <p className="section-sub" style={{ fontSize: '0.9rem' }}>Create professional social media creatives in seconds.</p>
            </div>
          </div>
          <div className="card" style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', minHeight:420 }}>
            {/* Form */}
            <div style={{ padding:'1.5rem', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#f5f5fa', marginBottom: '0.5rem' }}>Tell AI what you want</h3>
              <div className="form-group">
                <label className="form-label" style={{fontSize: '0.7rem'}}>Campaign / Product Name</label>
                <input className="form-input" style={{padding: '0.6rem 0.8rem', fontSize: '0.85rem'}} value={posterCampaign} onChange={e=>setPosterCampaign(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{fontSize: '0.7rem'}}>Poster Topic</label>
                <input className="form-input" style={{padding: '0.6rem 0.8rem', fontSize: '0.85rem'}} value={posterTopic} onChange={e=>setPosterTopic(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{fontSize: '0.7rem'}}>Target Audience</label>
                <input className="form-input" style={{padding: '0.6rem 0.8rem', fontSize: '0.85rem'}} value={posterAudience} onChange={e=>setPosterAudience(e.target.value)} />
              </div>
              
              <div style={{ display:'flex', gap:'0.6rem', marginTop:'auto', paddingTop:'1rem' }}>
                <button className="btn btn-primary" style={{ flex:1, justifyContent:'center', padding: '0.7rem' }} onClick={handleGeneratePoster} disabled={isGeneratingPoster}>
                  <Sparkles size={14}/> {isGeneratingPoster ? 'Generating...' : 'Generate Poster'}
                </button>
              </div>
            </div>
            
            {/* Preview */}
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', background:'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize:'0.7rem', color:'#5a5a70', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'0.8rem', fontFamily:"'Inter',sans-serif", fontWeight: 600 }}>Poster Preview</div>
              
              {isGeneratingPoster ? (
                <div style={{ flex:1, borderRadius:12, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'2rem', background:'linear-gradient(135deg,#1a0b2e 0%,#2d1b4e 40%,#0f1830 70%,#1e0e2e 100%)', border:'1px solid rgba(139,92,246,0.3)', minHeight:'300px', gap:'1rem' }}>
                  <div style={{ width:40, height:40, border:'3px solid rgba(139,92,246,0.3)', borderTop:'3px solid #8b5cf6', borderRadius:'50%', animation:'spin 1s linear infinite' }}></div>
                  <div style={{ color:'#c4b5fd', fontSize:'0.85rem', fontWeight:600 }}>AI is designing your poster...</div>
                </div>
              ) : (
                <div key={posterData.title + posterData.keyword} style={{ 
                  flex:1, borderRadius:12, display:'flex', flexDirection:'column', justifyContent:'center', padding:'2rem', 
                  background: `linear-gradient(135deg, rgba(26,11,46,0.85) 0%, rgba(45,27,78,0.85) 100%), url(https://picsum.photos/seed/${posterData.keyword}/800/800) center/cover`, 
                  border:'1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', minHeight: '300px',
                  transition: 'all 0.5s ease'
                }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:'2.2rem', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', marginBottom:'0.8rem', color:'white', whiteSpace: 'pre-line' }}>
                      {posterData.title}
                    </h2>
                    <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.9)', lineHeight:1.5, marginBottom:'1.5rem', maxWidth:280, fontWeight: 500 }}>
                      {posterData.subtitle}
                    </p>
                    <button style={{ display:'inline-flex', padding:'0.6rem 1.2rem', background:'linear-gradient(135deg,#8b5cf6,#ec4899)', color:'white', borderRadius:100, fontWeight:700, fontSize:'0.8rem', border:'none', cursor:'pointer' }}>TRY IT NOW</button>
                  </div>
                </div>
              )}
              <div style={{ display:'flex', gap:'0.4rem', marginTop:'1rem' }}>
                <button className="btn btn-ghost" style={{ flex:1, padding:'0.5rem', fontSize:'0.75rem' }} onClick={handleGeneratePoster} disabled={isGeneratingPoster}>
                  <RefreshCw size={12}/> Regenerate
                </button>
                <button className="btn btn-ghost" style={{ flex:1, padding:'0.5rem', fontSize:'0.75rem' }} onClick={()=>showToast('Downloaded')}><Download size={12}/> Download</button>
                <button className="btn btn-primary" style={{ flex:1, padding:'0.5rem', fontSize:'0.75rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} onClick={()=>setIsPostModalOpen(true)}>
                  <Send size={12}/> Post to Socials
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPTION GENERATOR ─── */}
      <section className="section" id="caption" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
        <div className="section-inner">
          <div className="section-head">
            <div className="section-head-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'grid', placeItems: 'center', color: 'white', fontSize: '0.8rem' }}>✍️</div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>AI Caption & Hashtag Generator</h2>
              </div>
              <p className="section-sub" style={{ fontSize: '0.9rem' }}>Turn your campaign into engaging social media content.</p>
            </div>
          </div>
          <div className="card" style={{ padding:'1.5rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.8rem', marginBottom:'1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{fontSize: '0.7rem'}}>Platform</label>
                    <select className="form-select" style={{padding: '0.6rem 0.8rem', fontSize: '0.85rem'}} value={captionPlatform} onChange={e=>setCaptionPlatform(e.target.value)}>
                      <option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>Twitter</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{fontSize: '0.7rem'}}>Tone</label>
                    <select className="form-select" style={{padding: '0.6rem 0.8rem', fontSize: '0.85rem'}} value={captionTone} onChange={e=>setCaptionTone(e.target.value)}>
                      <option>Professional</option><option>Casual</option><option>Funny</option><option>Hype</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{fontSize: '0.7rem'}}>Length</label>
                    <select className="form-select" style={{padding: '0.6rem 0.8rem', fontSize: '0.85rem'}} value={captionLength} onChange={e=>setCaptionLength(e.target.value)}>
                      <option>Short</option><option>Medium</option><option>Long</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', background: 'linear-gradient(135deg, #8b5cf6, #c084fc)' }} onClick={handleGenerateCaption} disabled={isGeneratingCaption}>
                  <Sparkles size={14}/> {isGeneratingCaption ? 'Generating...' : 'Generate Caption'}
                </button>
              </div>
              <div style={{ paddingLeft:'2rem', borderLeft:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:'0.85rem', color:'#f5f5fa', lineHeight:1.7, marginBottom:'1.2rem', whiteSpace: 'pre-line' }}>
                  {captionResult}
                </div>
                <div style={{ marginBottom:'1.2rem' }}>
                  <div style={{ fontSize:'0.7rem', fontWeight:600, color:'#9292a8', marginBottom:'0.5rem', textTransform: 'uppercase' }}>Hashtags</div>
                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                    {captionHashtags.map(t=>(<span key={t} style={{ padding:'0.25rem 0.5rem', background:'rgba(139,92,246,0.1)', color:'#c4b5fd', borderRadius:6, fontSize:'0.7rem' }}>{t}</span>))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button className="btn btn-ghost" style={{ flex:1, padding:'0.5rem', fontSize:'0.75rem' }} onClick={()=>{navigator.clipboard.writeText(captionResult); showToast('Copied!')}}><Copy size={12}/> Copy Caption</button>
                  <button className="btn btn-ghost" style={{ flex:1, padding:'0.5rem', fontSize:'0.75rem' }} onClick={handleGenerateCaption} disabled={isGeneratingCaption}><RefreshCw size={12}/> Regenerate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIRECT POST MODAL ─── */}
      {isPostModalOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:9999, display:'grid', placeItems:'center', backdropFilter:'blur(5px)' }}>
          <div className="card" style={{ width:420, background:'#0a0a0f', padding:'2rem', position:'relative', border:'1px solid rgba(139,92,246,0.2)', boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}>
            <button onClick={()=>setIsPostModalOpen(false)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'none', color:'#9292a8', cursor:'pointer' }}><X size={20}/></button>
            <h3 style={{ fontSize:'1.2rem', marginBottom:'1.5rem', color:'#f5f5fa', display:'flex', alignItems:'center', gap:'0.6rem' }}>
              <Send size={18} color="#8b5cf6"/> Post Directly to Socials
            </h3>
            
            <div style={{ marginBottom:'1.5rem' }}>
              <div style={{ fontSize:'0.85rem', color:'#9292a8', marginBottom:'1rem' }}>Where do you want to publish?</div>
              
              <label style={{ display:'flex', alignItems:'center', gap:'0.8rem', padding:'1rem', background: postToInstagram ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)', borderRadius:12, marginBottom:'0.8rem', cursor:'pointer', border: postToInstagram ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.07)', transition:'all 0.2s' }}>
                <input type="checkbox" checked={postToInstagram} onChange={e=>setPostToInstagram(e.target.checked)} style={{ accentColor:'#ec4899', width:18, height:18 }} />
                <InstagramIcon size={22} color="#ec4899"/>
                <div style={{ flex:1 }}>
                  <div style={{ color:'#f5f5fa', fontSize:'0.95rem', fontWeight:700 }}>Instagram Feed</div>
                  <div style={{ color:'#9292a8', fontSize:'0.8rem' }}>@yourstartup</div>
                </div>
              </label>

              <label style={{ display:'flex', alignItems:'center', gap:'0.8rem', padding:'1rem', background: postToFacebook ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)', borderRadius:12, cursor:'pointer', border: postToFacebook ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.07)', transition:'all 0.2s' }}>
                <input type="checkbox" checked={postToFacebook} onChange={e=>setPostToFacebook(e.target.checked)} style={{ accentColor:'#3b82f6', width:18, height:18 }} />
                <FacebookIcon size={22} color="#3b82f6"/>
                <div style={{ flex:1 }}>
                  <div style={{ color:'#f5f5fa', fontSize:'0.95rem', fontWeight:700 }}>Facebook Page</div>
                  <div style={{ color:'#9292a8', fontSize:'0.8rem' }}>Your Startup Page</div>
                </div>
              </label>
            </div>
            
            <div style={{ background:'linear-gradient(90deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', padding:'1rem', borderRadius:10, border:'1px solid rgba(139,92,246,0.2)', marginBottom:'1.5rem', fontSize:'0.8rem', color:'#c4b5fd', lineHeight:1.5 }}>
              <strong>Ayrshare Integration:</strong> This securely posts to your linked accounts using the Ayrshare API.
            </div>

            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'1rem', background:'linear-gradient(135deg, #8b5cf6, #ec4899)', fontSize:'1rem' }} onClick={handlePublish} disabled={isPublishing || (!postToInstagram && !postToFacebook)}>
              {isPublishing ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18}/>}
              {isPublishing ? 'Publishing to Meta...' : 'Publish Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
