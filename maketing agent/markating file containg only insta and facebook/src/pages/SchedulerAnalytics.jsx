import React, { useState } from 'react'
import { Calendar, Plus, Sparkles, Pencil, Clock, Lightbulb, ChevronLeft, ChevronRight, X, ArrowRight, Send, Trash2 } from 'lucide-react'
import { generateWithGroq } from '../services/ai'

const InstagramIcon = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const FacebookIcon = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

export default function SchedulerAnalytics({ showToast }) {
  // Dynamic schedule data
  const [scheduleData, setScheduleData] = useState([
    { day: 'MON', date: '18', posts: [{ platform: 'instagram', title: 'Product Launch', time: '10:00 AM', status: 'Scheduled' }] },
    { day: 'TUE', date: '19', posts: [{ platform: 'facebook', title: 'Startup Announcement', time: '6:00 PM', status: 'Scheduled' }] },
    { day: 'WED', date: '20', posts: [{ platform: 'instagram', title: 'Feature Post', time: '11:00 AM', status: 'Published' }] },
    { day: 'THU', date: '21', posts: [{ platform: 'facebook', title: 'Educational Post', time: '7:00 PM', status: 'Scheduled' }] },
    { day: 'FRI', date: '22', posts: [{ platform: 'instagram', title: 'Promotional Post', time: '5:00 PM', status: 'Scheduled' }] }
  ])

  // Schedule form state
  const [schedulePlatform, setSchedulePlatform] = useState('instagram')
  const [scheduleContent, setScheduleContent] = useState('Both')
  const [scheduleDate, setScheduleDate] = useState('2026-08-24')
  const [scheduleTime, setScheduleTime] = useState('10:00')
  const [scheduleCaption, setScheduleCaption] = useState('')

  // Stats - computed dynamically
  const totalScheduled = scheduleData.reduce((sum, d) => sum + d.posts.filter(p => p.status === 'Scheduled').length, 0)
  const totalPublished = scheduleData.reduce((sum, d) => sum + d.posts.filter(p => p.status === 'Published').length, 0)
  const totalDrafts = scheduleData.reduce((sum, d) => sum + d.posts.filter(p => p.status === 'Draft').length, 0)
  const connectedAccounts = 2
  const totalPosts = totalScheduled + totalPublished + totalDrafts
  const progressPercent = totalPosts > 0 ? Math.round((totalPublished / totalPosts) * 100) : 0

  // AI content ideas
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)

  const handleSchedulePost = () => {
    if (!scheduleCaption.trim()) {
      showToast('Please enter a caption or generate one with AI')
      return
    }
    const dateObj = new Date(scheduleDate)
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
    const dayName = days[dateObj.getDay()]
    const dateNum = String(dateObj.getDate())
    
    // Format time
    const [h, m] = scheduleTime.split(':')
    const hour = parseInt(h)
    const timeStr = `${hour > 12 ? hour-12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`

    const newPost = {
      platform: schedulePlatform,
      title: scheduleCaption.substring(0, 30) + (scheduleCaption.length > 30 ? '...' : ''),
      time: timeStr,
      status: 'Scheduled'
    }

    // Find if day exists already
    const existingIdx = scheduleData.findIndex(d => d.date === dateNum)
    if (existingIdx >= 0) {
      const updated = [...scheduleData]
      updated[existingIdx].posts.push(newPost)
      setScheduleData(updated)
    } else {
      setScheduleData([...scheduleData, { day: dayName, date: dateNum, posts: [newPost] }])
    }

    showToast('Post scheduled successfully!')
    setScheduleCaption('')
  }

  const handleDeletePost = (dayIdx, postIdx) => {
    const updated = [...scheduleData]
    updated[dayIdx].posts.splice(postIdx, 1)
    if (updated[dayIdx].posts.length === 0) {
      updated.splice(dayIdx, 1)
    }
    setScheduleData(updated)
    showToast('Post removed')
  }

  const handlePublishNow = (dayIdx, postIdx) => {
    const updated = [...scheduleData]
    updated[dayIdx].posts[postIdx].status = 'Published'
    setScheduleData(updated)
    showToast('Post published to ' + updated[dayIdx].posts[postIdx].platform + '!')
  }

  const handleGenerateIdea = async () => {
    setIsGeneratingIdea(true)
    const result = await generateWithGroq(
      'Give me one short creative social media post idea for a startup. Just the idea in one sentence, no hashtags.',
      'You are a creative social media manager. Be concise.'
    )
    setScheduleCaption(result)
    setIsGeneratingIdea(false)
    showToast('Content idea generated!')
  }

  const handleQuickAction = async (action) => {
    if (action === 'Create Poster') {
      window.location.href = '/'
      showToast('Redirecting to Poster Maker...')
    } else if (action === 'Generate Caption') {
      window.location.href = '/'
      showToast('Redirecting to Caption Generator...')
    } else if (action === 'Schedule Campaign') {
      document.querySelector('#schedule-panel')?.scrollIntoView({ behavior: 'smooth' })
    } else if (action === 'Generate Content Ideas') {
      handleGenerateIdea()
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'grid', placeItems: 'center', color: 'white', fontSize: '0.9rem' }}>📅</div>
            <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>AI Social Media Scheduler</h1>
          </div>
          <p style={{ color: '#9292a8', fontSize: '0.95rem', margin: 0 }}>Plan and schedule your campaign across connected platforms.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.3rem' }}>
            <button style={{ background: 'transparent', border: 'none', color: '#f5f5fa', cursor: 'pointer', padding: '0.3rem' }}><ChevronLeft size={16}/></button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>August 2026</span>
            <button style={{ background: 'transparent', border: 'none', color: '#f5f5fa', cursor: 'pointer', padding: '0.3rem' }}><ChevronRight size={16}/></button>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, color: '#f5f5fa', padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}>Today</button>
          <button className="btn btn-primary" onClick={() => document.querySelector('#schedule-panel')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            <Plus size={16}/> Schedule Post
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* WEEKLY CALENDAR */}
          <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(scheduleData.length, 5)}, 1fr)`, gap: '1rem', minWidth: '800px' }}>
              {scheduleData.map((day, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9292a8', marginBottom: '0.3rem' }}>{day.day}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f5f5fa' }}>{day.date}</div>
                  </div>
                  
                  {day.posts.map((post, j) => (
                    <div key={j} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {post.platform === 'instagram' 
                          ? <div style={{ color: '#ec4899' }}><InstagramIcon size={16}/></div> 
                          : <div style={{ color: '#3b82f6' }}><FacebookIcon size={16}/></div>
                        }
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5fa', textTransform: 'capitalize' }}>{post.platform}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#f5f5fa', marginBottom: '0.3rem', lineHeight: 1.4 }}>{post.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9292a8' }}>{post.time}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: post.status === 'Published' ? '#10b981' : post.status === 'Draft' ? '#f59e0b' : '#3b82f6' }}>
                          <span style={{ width:6, height:6, borderRadius:'50%', background: post.status === 'Published' ? '#10b981' : post.status === 'Draft' ? '#f59e0b' : '#3b82f6' }}></span> {post.status}
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          {post.status === 'Scheduled' && (
                            <button onClick={() => handlePublishNow(i, j)} title="Publish Now" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, color: '#10b981', cursor: 'pointer', padding: '0.2rem 0.4rem', fontSize: '0.65rem' }}>
                              <Send size={10}/> Post
                            </button>
                          )}
                          <button onClick={() => handleDeletePost(i, j)} title="Delete" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', padding: '0.2rem 0.4rem', fontSize: '0.65rem' }}>
                            <Trash2 size={10}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* QUICK AI ACTIONS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={16} color="#8b5cf6" />
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Quick AI Actions</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { icon: <Sparkles size={20} color="#ec4899"/>, title: 'Create Poster', desc: 'Generate stunning posters with AI' },
                { icon: <Pencil size={20} color="#f59e0b"/>, title: 'Generate Caption', desc: 'Create engaging captions and hashtags' },
                { icon: <Clock size={20} color="#3b82f6"/>, title: 'Schedule Campaign', desc: 'Plan and schedule your content' },
                { icon: <Lightbulb size={20} color="#8b5cf6"/>, title: 'Generate Content Ideas', desc: 'Get AI-powered content ideas instantly' }
              ].map((action, i) => (
                <div key={i} className="card" onClick={() => handleQuickAction(action.title)} style={{ padding: '1.2rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.3)' }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', marginBottom: '1rem' }}>
                    {action.icon}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f5fa', marginBottom: '0.4rem' }}>{action.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9292a8', lineHeight: 1.4 }}>{action.desc}</div>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', color: '#5a5a70' }}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAMPAIGN OVERVIEW - DYNAMIC */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 1.5rem 0' }}>Campaign Overview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', flex: 1 }}>
                {[
                  { value: totalScheduled, label: 'Posts Scheduled', change: 'Active', color: '#8b5cf6' },
                  { value: totalPublished, label: 'Posts Published', change: 'Completed', color: '#10b981' },
                  { value: totalDrafts, label: 'Drafts', change: 'Pending', color: '#f59e0b' },
                  { value: connectedAccounts, label: 'Connected Accounts', change: 'IG + FB', color: '#3b82f6' }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: stat.color }}></div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5fa' }}>{stat.value}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#f5f5fa', marginBottom: '0.3rem', fontWeight: 500 }}>{stat.label}</div>
                    <div style={{ fontSize: '0.7rem', color: stat.color }}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Circular Progress - Dynamic */}
              <div style={{ width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '2rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: `conic-gradient(#8b5cf6 ${progressPercent}%, rgba(255,255,255,0.1) 0)`, display: 'grid', placeItems: 'center', position: 'relative' }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--card-bg)', display: 'grid', placeItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f5f5fa' }}>{progressPercent}%</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9292a8', textAlign: 'center', marginTop: '0.8rem' }}>Campaign Progress</div>
              </div>

            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div id="schedule-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SCHEDULE NEW POST PANEL */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(15,15,25,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Schedule New Post</h3>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9292a8', marginBottom: '0.8rem' }}>Select Platform</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setSchedulePlatform('instagram')} style={{ flex: 1, padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: schedulePlatform === 'instagram' ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.03)', border: schedulePlatform === 'instagram' ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: schedulePlatform === 'instagram' ? '#f5f5fa' : '#9292a8', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <InstagramIcon size={14}/> Instagram
                </button>
                <button onClick={() => setSchedulePlatform('facebook')} style={{ flex: 1, padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: schedulePlatform === 'facebook' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)', border: schedulePlatform === 'facebook' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: schedulePlatform === 'facebook' ? '#f5f5fa' : '#9292a8', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <FacebookIcon size={14}/> Facebook
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9292a8', marginBottom: '0.8rem' }}>Select Content</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Poster', 'Caption', 'Both'].map(opt => (
                  <button key={opt} onClick={() => setScheduleContent(opt)} style={{ flex: 1, padding: '0.5rem', background: scheduleContent === opt ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)', border: scheduleContent === opt ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: scheduleContent === opt ? '#f5f5fa' : '#9292a8', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {opt}
                </button>
                ))}
              </div>
            </div>

            {/* Caption input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9292a8', marginBottom: '0.5rem' }}>Caption</div>
              <textarea value={scheduleCaption} onChange={e => setScheduleCaption(e.target.value)} placeholder="Write your post caption..." style={{ width: '100%', minHeight: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '0.6rem', fontSize: '0.8rem', color: '#f5f5fa', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}/>
              <button onClick={handleGenerateIdea} disabled={isGeneratingIdea} style={{ marginTop: '0.5rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, color: '#c4b5fd', padding: '0.4rem 0.8rem', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={12}/> {isGeneratingIdea ? 'Generating...' : 'AI Generate Caption'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9292a8', marginBottom: '0.5rem' }}>Date</div>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '0.6rem', fontSize: '0.8rem', color: '#f5f5fa', colorScheme: 'dark', outline: 'none' }}/>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9292a8', marginBottom: '0.5rem' }}>Time</div>
                <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '0.6rem', fontSize: '0.8rem', color: '#f5f5fa', colorScheme: 'dark', outline: 'none' }}/>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#c4b5fd', marginBottom: '0.5rem' }}>AI Suggested Best Time</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Sparkles size={14} color="#8b5cf6"/>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f5f5fa' }}>10:00 AM</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9292a8' }}>High engagement expected</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 24, marginTop: '1rem' }}>
                {[30, 40, 60, 100, 70, 50, 40].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i === 3 ? '#8b5cf6' : 'rgba(255,255,255,0.1)', height: `${h}%`, borderRadius: '2px 2px 0 0' }}></div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#5a5a70', marginTop: '0.3rem' }}>
                <span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setScheduleCaption('')} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f5f5fa', padding: '0.8rem', fontSize: '0.85rem', cursor: 'pointer' }}>Clear</button>
              <button className="btn btn-primary" style={{ flex: 1.5, justifyContent: 'center', padding: '0.8rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }} onClick={handleSchedulePost}>
                <Sparkles size={14}/> Schedule Post
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
