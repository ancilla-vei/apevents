import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, FileText, MessageSquare, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/dashboard/bookings', icon: <Calendar size={18} />, label: 'My Bookings' },
  { to: '/dashboard/quotations', icon: <FileText size={18} />, label: 'Quotations' },
  { to: '/dashboard/messages', icon: <MessageSquare size={18} />, label: 'Messages' },
  { to: '/dashboard/profile', icon: <User size={18} />, label: 'Profile' },
];

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); nav('/'); };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>AP Events</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Customer Portal</div>
      </div>
      <div style={{ padding: '1rem', flex: 1 }}>
        <div style={{ marginBottom: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{user?.phone}</div>
        </div>
        <nav style={{ marginTop: '1rem' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '0.25rem',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                textDecoration: 'none', fontSize: '0.95rem', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s'
              })}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
        <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar desktop */}
      <aside style={{ width: 260, background: 'var(--primary)', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }} className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 'min(260px, 85vw)', background: 'var(--primary)', zIndex: 1, overflowY: 'auto' }}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile header */}
        <header style={{ background: 'var(--primary)', padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Menu size={24} />
          </button>
          <span style={{ color: '#fff', fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>AP Events</span>
          <div style={{ minWidth: '44px' }} />
        </header>
        <div style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)', overflow: 'auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) { .sidebar-desktop { display: flex !important; flex-direction: column; } .mobile-header { display: none !important; } }
        @media (max-width: 767px) { .sidebar-desktop { display: none !important; } }
      `}</style>
    </div>
  );
}
