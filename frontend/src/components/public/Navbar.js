import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';

export default function Navbar({ settings }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); nav('/'); };

  const navLinks = ['About', 'Services', 'Events', 'Gallery', 'Testimonials', 'Contact'];

  return (
    <>
      <style>{`
        .ap-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: background 0.4s, box-shadow 0.4s, padding 0.3s;
          padding: ${scrolled ? '0.6rem 0' : '1rem 0'};
          background: ${scrolled ? 'rgba(80,0,0,0.97)' : 'transparent'};
          box-shadow: ${scrolled ? '0 2px 20px rgba(0,0,0,0.4)' : 'none'};
          backdrop-filter: ${scrolled ? 'blur(10px)' : 'none'};
        }
        .nav-link {
          color: rgba(255,255,255,0.88);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.2s;
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1.5px;
          background: var(--accent);
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .nav-link:hover { color: var(--accent); }
        .nav-link:hover::after { transform: scaleX(1); }

        .logo-img {
          height: ${scrolled ? '44px' : '54px'};
          width: auto;
          object-fit: contain;
          transition: height 0.3s;
          /* Remove white background — logo has white bg so mix-blend-mode helps */
          mix-blend-mode: screen;
          filter: drop-shadow(0 2px 8px rgba(255,215,0,0.4));
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-mobile-btn {
          display: none;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0.25rem;
        }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }

        .mobile-menu {
          background: rgba(60,0,0,0.98);
          backdrop-filter: blur(12px);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid rgba(255,215,0,0.15);
        }
        .mobile-link {
          color: rgba(255,255,255,0.88);
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          display: block;
          transition: color 0.2s, padding-left 0.2s;
        }
        .mobile-link:hover { color: var(--accent); padding-left: 0.5rem; }
      `}</style>

      <nav className="ap-navbar">
        <div className="container flex-between">

          {/* ── LOGO ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <img
              src={logo}
              alt="AP Events Logo"
              className="logo-img"
            />
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="nav-desktop">
            {navLinks.map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,215,0,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn btn-accent btn-sm"
                  style={{ borderRadius: 50, fontSize: '0.85rem', padding: '0.45rem 1.2rem' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 50, color: '#fff', padding: '0.45rem 1rem', fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-accent"
                style={{ borderRadius: 50, fontSize: '0.88rem', padding: '0.55rem 1.5rem', boxShadow: '0 2px 12px rgba(255,215,0,0.3)' }}
              >
                Book Event
              </Link>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button className="nav-mobile-btn" onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {open && (
          <div className="mobile-menu">
            {navLinks.map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="mobile-link" onClick={() => setOpen(false)}>{s}</a>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { toggleTheme(); }}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                {theme === 'dark' ? <><Sun size={15} /> Light</> : <><Moon size={15} /> Dark</>}
              </button>
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-accent btn-sm" style={{ borderRadius: 50 }} onClick={() => setOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, color: '#fff', padding: '0.4rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn btn-accent btn-sm" style={{ borderRadius: 50 }} onClick={() => setOpen(false)}>Book Event</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}