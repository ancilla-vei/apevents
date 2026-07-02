import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Mail, Instagram, MapPin, Calendar, Camera, Users, Music, Send, ChevronDown } from 'lucide-react';
import Navbar from '../../components/public/Navbar';

import { toast } from 'react-toastify';
import api from '../../utils/api';
const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://apevents.onrender.com';
// ✅ Smart image URL — works with Cloudinary URLs and local paths
function getImg(image) {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${BASE_URL}${image}`;
}

// ✅ Default wedding background — public URL works on ALL devices
const DEFAULT_BG = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={16} fill={i <= rating ? 'var(--accent)' : 'none'} color={i <= rating ? 'var(--accent)' : 'var(--border)'} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [enquiry, setEnquiry] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
    api.get('/services/public').then(r => setServices(r.data)).catch(() => {});
    api.get('/categories/public').then(r => setCategories(r.data)).catch(() => {});
    api.get('/gallery').then(r => setGallery(r.data)).catch(() => {});
    api.get('/testimonials/public').then(r => setTestimonials(r.data)).catch(() => {});
  }, []);

  const submitEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.phone || !enquiry.message) return toast.error('Please fill all fields');
    setSending(true);
    try {
      await api.post('/enquiries', enquiry);
      toast.success('Enquiry sent! We will get back to you soon.');
      setEnquiry({ name: '', phone: '', message: '' });
    } catch { toast.error('Failed to send enquiry'); }
    finally { setSending(false); }
  };

  const iconMap = {
    Photography: <Camera size={28}/>,
    Catering: <Users size={28}/>,
    Music: <Music size={28}/>,
    Decoration: <Star size={28}/>,
    default: <Calendar size={28}/>
  };

  // ✅ Use admin-uploaded bg (Cloudinary) or fallback to public Unsplash wedding photo
  const heroBg = settings?.backgroundImage
    ? getImg(settings.backgroundImage)
    : DEFAULT_BG;

  const eventPills = categories.length > 0
    ? categories.slice(0, 4).map(c => c.title)
    : ['Weddings', 'Birthdays', 'Corporate Events', 'Private Parties'];

  const instagramDisplay = (() => {
    const val = settings?.instagram || '';
    if (!val) return '@apevents';
    try {
      const url = new URL(val);
      const parts = url.pathname.replace(/\/$/, '').split('/');
      const handle = parts[parts.length - 1];
      return handle ? `@${handle}` : val;
    } catch { return val; }
  })();

  return (
    <div>
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          50%       { opacity: 1; transform: scale(1.4) rotate(180deg); }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0px); opacity: 0.6; }
          50%  { transform: translateY(-18px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.6; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-7px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-spark {
          position: absolute;
          border-radius: 50%;
          background: #ffd700;
          animation: sparkle ease-in-out infinite;
          pointer-events: none;
        }
        .bokeh-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(55px);
          animation: floatUp ease-in-out infinite;
          pointer-events: none;
        }
        .event-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 1rem;
          border: 1px solid rgba(255,215,0,0.35);
          border-radius: 50px;
          color: rgba(255,255,255,0.85);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(4px);
          transition: all 0.25s;
          white-space: nowrap;
        }
        .event-pill:hover {
          background: rgba(255,215,0,0.15);
          border-color: rgba(255,215,0,0.7);
          color: #ffd700;
        }
        .pill-divider { color: rgba(255,215,0,0.4); font-size: 0.9rem; user-select: none; }
        .btn-book {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 1rem 2.8rem; border-radius: 50px; font-size: 1.05rem;
          font-weight: 700; font-family: 'Inter', sans-serif; letter-spacing: 0.04em;
          background: linear-gradient(135deg, #ffd700 0%, #f0a500 100%);
          color: #1a0a00; border: none; cursor: pointer; text-decoration: none;
          box-shadow: 0 6px 28px rgba(255,215,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-book:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 36px rgba(255,215,0,0.6), 0 4px 12px rgba(0,0,0,0.3);
        }
        .btn-learn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.95rem 2.2rem; border-radius: 50px; font-size: 1rem;
          font-weight: 600; font-family: 'Inter', sans-serif;
          background: rgba(255,255,255,0.12); color: #fff;
          border: 1.5px solid rgba(255,255,255,0.35); cursor: pointer;
          text-decoration: none; backdrop-filter: blur(6px); transition: all 0.2s;
        }
        .btn-learn:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-2px);
        }
        .hero-content > * { animation: fadeInUp 0.8s ease both; }
        .hero-content > *:nth-child(1) { animation-delay: 0.1s; }
        .hero-content > *:nth-child(2) { animation-delay: 0.2s; }
        .hero-content > *:nth-child(3) { animation-delay: 0.35s; }
        .hero-content > *:nth-child(4) { animation-delay: 0.5s; }
        .hero-content > *:nth-child(5) { animation-delay: 0.65s; }
        .hero-content > *:nth-child(6) { animation-delay: 0.8s; }
        .service-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 16px 40px var(--shadow) !important;
        }
        .instagram-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }
        .instagram-link:hover {
          color: var(--primary);
          text-decoration: underline;
        }
        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
          display: block;
        }
        .gallery-img:hover { transform: scale(1.08); }
      `}</style>

      <Navbar settings={settings} />

      {/* ══ HERO ══ */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* ✅ Background — Cloudinary or Unsplash (works on all devices) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(3px) brightness(0.5)', transform: 'scale(1.06)'
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(20,0,0,0.55) 0%, rgba(10,0,0,0.3) 40%, rgba(20,0,0,0.65) 100%)' }} />

        {/* Bokeh orbs */}
        {[
          { w:260,h:260,left:'8%', top:'15%',bg:'rgba(255,140,0,0.12)', dur:'9s', del:'0s'  },
          { w:200,h:200,left:'75%',top:'8%', bg:'rgba(255,215,0,0.1)',  dur:'12s',del:'-3s' },
          { w:300,h:300,left:'60%',top:'55%',bg:'rgba(200,80,0,0.1)',   dur:'10s',del:'-6s' },
          { w:180,h:180,left:'20%',top:'65%',bg:'rgba(255,200,100,0.09)',dur:'14s',del:'-2s'},
          { w:150,h:150,left:'88%',top:'40%',bg:'rgba(255,215,0,0.08)', dur:'8s', del:'-4s' },
        ].map((o,i) => (
          <div key={i} className="bokeh-orb" style={{ width:o.w,height:o.h,left:o.left,top:o.top,background:o.bg,animationDuration:o.dur,animationDelay:o.del,zIndex:2 }} />
        ))}

        {/* Sparkles */}
        {Array.from({length:22}).map((_,i) => (
          <div key={i} className="hero-spark" style={{
            width:i%4===0?6:i%3===0?4:3, height:i%4===0?6:i%3===0?4:3,
            left:`${6+(i*4.2)%88}%`, top:`${10+(i*6.7)%78}%`,
            animationDuration:`${2.5+(i%5)*0.6}s`, animationDelay:`${(i%7)*0.45}s`,
            zIndex:3, boxShadow:'0 0 8px 3px rgba(255,215,0,0.55)'
          }} />
        ))}

        {/* Hero content */}
        <div className="hero-content" style={{ position:'relative',zIndex:10,textAlign:'center',padding:'6rem 1.5rem 2rem',maxWidth:780,margin:'0 auto',width:'100%' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem',marginBottom:'1.25rem' }}>
            <div style={{ height:1,width:55,background:'linear-gradient(to right, transparent, rgba(255,215,0,0.7))' }} />
            <span style={{ color:'var(--accent)',fontSize:'1rem' }}>✦</span>
            <div style={{ height:1,width:55,background:'linear-gradient(to left, transparent, rgba(255,215,0,0.7))' }} />
          </div>
          <p style={{ color:'rgba(255,215,0,0.9)',fontWeight:700,letterSpacing:'0.35em',textTransform:'uppercase',fontSize:'0.8rem',marginBottom:'0.6rem',textShadow:'0 1px 8px rgba(0,0,0,0.6)' }}>
            Welcome to
          </p>
          <h1 style={{ color:'white',textTransform:'uppercase',fontSize:'clamp(3.2rem, 10vw, 6.5rem)',fontFamily:'Playfair Display',fontWeight:700,lineHeight:1.05,marginBottom:'0.9rem',textShadow:'0 2px 20px rgba(0,0,0,0.6)',letterSpacing:'0.02em' }}>
            {settings?.companyName || 'AP EVENTS'}
          </h1>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',marginBottom:'1.1rem' }}>
            <div style={{ height:1,width:35,background:'rgba(255,215,0,0.5)' }} />
            <Star size={13} fill="#ffd700" color="#ffd700" />
            <Star size={17} fill="#ffd700" color="#ffd700" />
            <Star size={13} fill="#ffd700" color="#ffd700" />
            <div style={{ height:1,width:35,background:'rgba(255,215,0,0.5)' }} />
          </div>
          <p style={{ fontSize:'clamp(1rem, 2.8vw, 1.25rem)',color:'rgba(255,255,255,0.9)',marginBottom:'1.75rem',fontStyle:'italic',fontFamily:'Playfair Display',lineHeight:1.65,textShadow:'0 2px 10px rgba(0,0,0,0.55)' }}>
            {settings?.tagline || 'Creating celebrations that live in your memories forever.'}
          </p>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',flexWrap:'wrap',gap:'0.4rem',marginBottom:'2rem' }}>
            {eventPills.map((pill,i) => (
              <React.Fragment key={pill}>
                <span className="event-pill">{pill}</span>
                {i < eventPills.length-1 && <span className="pill-divider">|</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
            <Link to="/login" className="btn-book">Book Your Event</Link>
            <a href="#about" className="btn-learn">Learn More</a>
          </div>
        </div>

        <div style={{ position:'absolute',bottom:'1.75rem',left:'50%',animation:'scrollBounce 2.2s ease-in-out infinite',zIndex:10,textAlign:'center',transform:'translateX(-50%)' }}>
          <p style={{ color:'rgba(255,255,255,0.55)',fontSize:'0.68rem',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'0.3rem' }}>Scroll</p>
          <ChevronDown size={20} color="rgba(255,255,255,0.55)" />
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="section" style={{ background:'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'3rem',alignItems:'center' }}>
            <div>
              <p style={{ color:'var(--accent)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.75rem',fontSize:'0.82rem' }}>About Us</p>
              <h2 style={{ fontSize:'2.2rem',color:'var(--primary)',marginBottom:'1.25rem' }}>Mangaluru's Beloved Event Company</h2>
              <p style={{ color:'var(--text-secondary)',lineHeight:1.85,marginBottom:'1rem' }}>
                {settings?.missionStatement || "AP Events is a Mangaluru-based event management company dedicated to crafting unforgettable celebrations. In just one year, we've built a reputation for creativity, attention to detail, and heartfelt service."}
              </p>
              <p style={{ color:'var(--text-secondary)',lineHeight:1.85,marginBottom:'1.5rem' }}>
                From intimate weddings to grand corporate galas, we bring your vision to life with passion and precision. Every event is a unique story — let us help write yours.
              </p>
              {settings?.coreValues?.length > 0 && (
                <div style={{ display:'flex',gap:'0.6rem',flexWrap:'wrap' }}>
                  {settings.coreValues.map(v => (
                    <span key={v} style={{ padding:'0.35rem 1rem',background:'var(--primary)',color:'#fff',borderRadius:20,fontSize:'0.82rem',fontWeight:600 }}>{v}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
              {[
                { n: settings?.statsEventsHosted      || '100+', l:'Events Hosted'      },
                { n: settings?.statsHappyGuests       || '500+', l:'Happy Guests'       },
                { n: settings?.statsYearsOfExcellence || '1',    l:'Year of Excellence' },
                { n: settings?.statsClientSupport     || '24/7', l:'Client Support'     },
              ].map(s => (
                <div key={s.l} className="card" style={{ textAlign:'center',padding:'1.5rem 1rem' }}>
                  <div style={{ fontSize:'2rem',fontWeight:700,color:'var(--primary)',fontFamily:'Playfair Display' }}>{s.n}</div>
                  <div style={{ color:'var(--text-secondary)',fontSize:'0.82rem',marginTop:'0.25rem' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <div className="section-divider" />
            <p>We offer a comprehensive range of event services to make your special day truly magical.</p>
          </div>
          {services.length > 0 ? (
            <div className="grid-3">
              {services.map(s => (
                <div key={s._id} className="card service-card" style={{ textAlign:'center',transition:'transform 0.25s, box-shadow 0.25s' }}>
                  {s.image
                    ? <img src={getImg(s.image)} alt={s.name} style={{ width:'100%',height:180,objectFit:'cover',borderRadius:8,marginBottom:'1rem' }} />
                    : <div style={{ width:68,height:68,borderRadius:'50%',background:'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',color:'var(--primary)' }}>{iconMap[s.name]||iconMap.default}</div>
                  }
                  <h3 style={{ color:'var(--primary)',marginBottom:'0.5rem' }}>{s.name}</h3>
                  <p style={{ color:'var(--text-secondary)',fontSize:'0.9rem' }}>{s.description}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-muted">Services will be listed here soon.</p>}
        </div>
      </section>

      {/* ══ EVENT CATEGORIES ══ */}
      <section id="events" className="section" style={{ background:'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Event Categories</h2>
            <div className="section-divider" />
            <p>From elegant weddings to lively corporate events — we handle every occasion with excellence.</p>
          </div>
          {categories.length > 0 ? (
            <div className="grid-4">
              {categories.map(c => (
                <div key={c._id} style={{ position:'relative',borderRadius:12,overflow:'hidden',height:220,cursor:'pointer' }}
                  onMouseOver={e => e.currentTarget.querySelector('.cat-overlay').style.opacity='1'}
                  onMouseOut={e => e.currentTarget.querySelector('.cat-overlay').style.opacity='0'}
                >
                  {c.photo
                    ? <img src={getImg(c.photo)} alt={c.title} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                    : <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg, var(--primary), var(--primary-dark))' }} />
                  }
                  <div className="cat-overlay" style={{ position:'absolute',inset:0,background:'rgba(128,0,0,0.82)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.3s' }}>
                    <span style={{ color:'#fff',fontFamily:'Playfair Display',fontSize:'1.1rem',fontWeight:700 }}>{c.title}</span>
                  </div>
                  <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent, rgba(0,0,0,0.82))',padding:'1.5rem 1rem 0.75rem' }}>
                    <p style={{ color:'#fff',fontWeight:600,fontSize:'0.92rem' }}>{c.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-muted">Event categories coming soon.</p>}
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section id="gallery" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Gallery</h2>
            <div className="section-divider" />
            <p>Glimpses of the beautiful celebrations we've crafted for our clients.</p>
          </div>
          {gallery.length > 0 ? (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'1rem' }}>
              {gallery.map(g => (
                <div key={g._id} style={{ position:'relative',borderRadius:10,overflow:'hidden',height:200,background:'var(--bg-secondary)' }}>
                  {/* ✅ getImg handles Cloudinary full URLs */}
                  <img
                    src={getImg(g.image)}
                    alt={g.eventName || 'gallery'}
                    className="gallery-img"
                    onError={e => { e.target.style.display='none'; }}
                  />
                  {g.description && (
                    <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent, rgba(0,0,0,0.75))',padding:'1rem 0.75rem 0.5rem' }}>
                      <p style={{ color:'#fff',fontSize:'0.82rem' }}>{g.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <p className="text-center text-muted">Gallery photos coming soon.</p>}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonials" className="section" style={{ background:'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Client Testimonials</h2>
            <div className="section-divider" />
            <p>Hear what our happy clients say about us.</p>
          </div>
          {testimonials.length > 0 ? (
            <div className="grid-3">
              {testimonials.map(t => (
                <div key={t._id} className="card">
                  <Stars rating={t.rating} />
                  <p style={{ color:'var(--text-secondary)',margin:'1rem 0',fontStyle:'italic',lineHeight:1.7 }}>"{t.text}"</p>
                  <div className="flex-between">
                    <strong style={{ color:'var(--primary)' }}>{t.name}</strong>
                    <span style={{ fontSize:'0.78rem',color:'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-muted">Be the first to leave a review!</p>}
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <div className="section-divider" />
            <p>Have a question? We'd love to hear from you.</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'3rem' }}>
            <div>
              <h3 style={{ color:'var(--primary)',marginBottom:'1.5rem' }}>Contact Details</h3>
              <div style={{ display:'flex',gap:'1rem',marginBottom:'1.25rem',alignItems:'flex-start' }}>
                <span style={{ color:'var(--primary)',marginTop:2 }}><Phone size={20}/></span>
                <span style={{ color:'var(--text-secondary)' }}>{settings?.phone || '7411185509'}</span>
              </div>
              <div style={{ display:'flex',gap:'1rem',marginBottom:'1.25rem',alignItems:'flex-start' }}>
                <span style={{ color:'var(--primary)',marginTop:2 }}><Mail size={20}/></span>
                <span style={{ color:'var(--text-secondary)' }}>{settings?.email || 'info@apevents.in'}</span>
              </div>
              <div style={{ display:'flex',gap:'1rem',marginBottom:'1.25rem',alignItems:'flex-start' }}>
                <span style={{ color:'var(--primary)',marginTop:2 }}><Instagram size={20}/></span>
                {settings?.instagram ? (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="instagram-link">{instagramDisplay}</a>
                ) : (
                  <span style={{ color:'var(--text-secondary)' }}>@apevents</span>
                )}
              </div>
              <div style={{ display:'flex',gap:'1rem',marginBottom:'1.25rem',alignItems:'flex-start' }}>
                <span style={{ color:'var(--primary)',marginTop:2 }}><MapPin size={20}/></span>
                <span style={{ color:'var(--text-secondary)' }}>{settings?.address || 'Mangaluru, Karnataka'}</span>
              </div>
            </div>
            <form onSubmit={submitEnquiry}>
              <h3 style={{ color:'var(--primary)',marginBottom:'1.5rem' }}>Send an Enquiry</h3>
              <div className="form-group">
                <label>Your Name</label>
                <input className="form-control" placeholder="Enter your name" value={enquiry.name} onChange={e => setEnquiry({...enquiry,name:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-control" placeholder="Enter your phone" value={enquiry.phone} onChange={e => setEnquiry({...enquiry,phone:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" placeholder="How can we help?" rows={4} value={enquiry.message} onChange={e => setEnquiry({...enquiry,message:e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={sending}>
                <Send size={16}/> {sending ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:'var(--primary-dark)',color:'#fff',padding:'2.5rem 0',textAlign:'center' }}>
        <div className="container">
          <p style={{ fontFamily:'Playfair Display',fontSize:'1.6rem',marginBottom:'0.4rem',color:'#ffd700' }}>AP Events</p>
          <p style={{ color:'rgba(255,255,255,0.6)',fontSize:'0.85rem' }}>
            © {new Date().getFullYear()} AP Events, Mangaluru. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
