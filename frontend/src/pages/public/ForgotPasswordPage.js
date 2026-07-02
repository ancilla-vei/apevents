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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <img 
              src={logo} 
              alt="AP Events" 
              style={{ 
                width: '180px', 
                height: 'auto',
                maxWidth: '100%'
              }} 
            />
          </Link>
          <h1 style={{ marginTop: '1rem', fontSize: '1.6rem', color: 'var(--text)' }}>{title}</h1>
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

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: phone, 2: otp, 3: new password
  const [form, setForm] = useState({ phone: '', otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const { forgotPassword: forgotPasswordApi, verifyOTP: verifyOTPApi, resetPassword: resetPasswordApi } = useAuth();
  const nav = useNavigate();

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.phone) {
      toast.error('Please enter your phone number');
      return;
    }
    if (form.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    
    setLoading(true);
    try {
      const response = await forgotPasswordApi(form.phone);
      toast.success(response.message || 'OTP sent to your phone!');
      setStep(2);
      setOtpTimer(600); // 10 minutes in seconds
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.otp) {
      toast.error('Please enter OTP');
      return;
    }
    if (form.otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
    
    setLoading(true);
    try {
      const response = await verifyOTPApi(form.phone, form.otp);
      if (response.verified) {
        toast.success('OTP verified! Please set your new password.');
        setStep(3);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.newPassword || !form.confirmPassword) {
      return toast.error('Please fill all fields');
    }
    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await resetPasswordApi(form.phone, form.otp, form.newPassword);
      toast.success('Password reset successful! Please login with your new password.');
      nav('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Forgot Password 🔒" subtitle="Reset your password using OTP">
      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              className="form-control" 
              placeholder="Enter your registered phone number" 
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label>Enter OTP</label>
            <input 
              className="form-control" 
              placeholder="Enter 6-digit OTP" 
              maxLength="6"
              value={form.otp}
              onChange={e => setForm({ ...form, otp: e.target.value })}
            />
          </div>
          {otpTimer > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: '0.5rem 0' }}>OTP expires in: {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</p>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full" disabled={loading || otpTimer === 0}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary w-full mt-2"
            onClick={() => {
              setStep(1);
              setForm({ ...form, otp: '' });
            }}
          >
            Back
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>New Password</label>
            <input 
              className="form-control" 
              type="password"
              placeholder="Min. 6 characters" 
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              className="form-control" 
              type="password"
              placeholder="Repeat password" 
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary w-full mt-2"
            onClick={() => {
              setStep(2);
              setForm({ ...form, newPassword: '', confirmPassword: '' });
            }}
          >
            Back
          </button>
        </form>
      )}

      <p className="text-center mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Remember your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;