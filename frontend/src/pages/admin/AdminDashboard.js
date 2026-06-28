import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, FileText, Star, MessageCircle, Settings, Camera, Tag, Users, MessageSquare, LayoutDashboard, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/admin/bookings', icon: <Calendar size={17} />, label: 'Bookings' },
  { to: '/admin/quotations', icon: <FileText size={17} />, label: 'Quotations' },
  { to: '/admin/testimonials', icon: <Star size={17} />, label: 'Testimonials' },
  { to: '/admin/enquiries', icon: <MessageCircle size={17} />, label: 'Enquiries' },
  { to: '/admin/messages', icon: <MessageSquare size={17} />, label: 'Messages' },
  { to: '/admin/services', icon: <LayoutDashboard size={17} />, label: 'Services' },
  { to: '/admin/categories', icon: <Tag size={17} />, label: 'Categories' },
  { to: '/admin/gallery', icon: <Camera size={17} />, label: 'Gallery' },
  { to: '/admin/customers', icon: <Users size={17} />, label: 'Customers' },
  { to: '/admin/settings', icon: <Settings size={17} />, label: 'Settings' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); nav('/'); };

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>AP Events</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: '0.2rem', background: 'rgba(255,215,0,0.2)', display: 'inline-block', padding: '0.15rem 0.6rem', borderRadius: 20, color: 'var(--accent)' }}>Admin Panel</div>
      </div>
      <div style={{ padding: '0.75rem', flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '0.6rem 0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>{user?.phone}</div>
        </div>
        <nav>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 0.75rem', borderRadius: 7, marginBottom: '0.15rem',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                textDecoration: 'none', fontSize: '0.88rem', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent'
              })}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
        <button onClick={toggleTheme} className="btn btn-ghost btn-sm" title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: '0.82rem' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{ width: 220, background: 'var(--primary)', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }} className="admin-sidebar">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 220, background: 'var(--primary)', zIndex: 1 }}>
            <Sidebar />
          </aside>
        </div>
      )}

      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ background: 'var(--primary)', padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }} className="admin-mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <Menu size={22} />
          </button>
          <span style={{ color: '#fff', fontFamily: 'Playfair Display', fontWeight: 700 }}>Admin Panel</span>
          <div />
        </header>
        <div style={{ padding: '1.75rem' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) { .admin-sidebar { display: flex !important; flex-direction: column; } .admin-mobile-header { display: none !important; } }
        @media (max-width: 767px) { .admin-sidebar { display: none !important; } }
      `}</style>
    </div>
  );
}
