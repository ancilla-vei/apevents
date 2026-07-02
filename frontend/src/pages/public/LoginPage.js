import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

function AuthLayout({ children, title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '0 0.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <img 
              src={logo} 
              alt="AP Events" 
              style={{ 
                width: 'clamp(140px, 35vw, 180px)', 
                height: 'auto',
                maxWidth: '100%'
              }} 
            />
          </Link>
          <h1 style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', color: 'var(--text)' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>{subtitle}</p>
        </div>
        <div className="card" style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
          {children}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'clamp(0.75rem, 2vw, 1rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.phone) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!form.password) {
      toast.error('Please enter your password');
      return;
    }
    if (form.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    
    setLoading(true);
    try {
      const user = await login(form.phone, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedPhone', form.phone);
      } else {
        localStorage.removeItem('rememberedPhone');
      }
      
      nav(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  // Load remembered phone on component mount
  React.useEffect(() => {
    const rememberedPhone = localStorage.getItem('rememberedPhone');
    if (rememberedPhone) {
      setForm({ ...form, phone: rememberedPhone });
      setRememberMe(true);
    }
  }, []);

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Login to access your account">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number</label>
          <input className="form-control" placeholder="Enter phone number" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" placeholder="Enter password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', marginTop: 'clamp(0.4rem, 1vw, 0.5rem)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', minWidth: '18px', minHeight: '18px' }}
            />
            <label htmlFor="rememberMe" style={{ cursor: 'pointer', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', color: 'var(--text-muted)', margin: 0 }}>
              Remember me
            </label>
          </div>
          <Link 
            to="/forgot-password"
            style={{ 
              color: 'var(--primary)', 
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)'
            }}
          >
            Forgot Password?
          </Link>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name) {
      toast.error('Please enter your full name');
      return;
    }
    if (!form.phone) {
      toast.error('Please enter your phone number');
      return;
    }
    if (form.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    if (!form.password) {
      toast.error('Please enter a password');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!form.confirm) {
      toast.error('Please confirm your password');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const user = await register(form.name, form.phone, form.password, form.email);
      toast.success(`Welcome to AP Events, ${user.name}!`);
      nav('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create Account " subtitle="Join AP Events to book your dream event">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input className="form-control" placeholder="Your full name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input className="form-control" placeholder="10-digit phone number" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Email (optional)</label>
          <input className="form-control" type="email" placeholder="your@email.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password *</label>
          <input className="form-control" type="password" placeholder="Min. 6 characters" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Confirm Password *</label>
          <input className="form-control" type="password" placeholder="Repeat password" value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
