import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

function AuthLayout({ children, title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--primary)', fontFamily: 'Playfair Display', fontSize: '2rem', fontWeight: 700 }}>AP Events</Link>
          <h1 style={{ marginTop: '1.5rem', fontSize: '1.6rem', color: 'var(--text)' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>{subtitle}</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          {children}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
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
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.phone, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      nav(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

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
        <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
      </p>
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
    if (!form.name || !form.phone || !form.password) return toast.error('Please fill required fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.name, form.phone, form.password, form.email);
      toast.success(`Welcome to AP Events, ${user.name}!`);
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create Account ✨" subtitle="Join AP Events to book your dream event">
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
