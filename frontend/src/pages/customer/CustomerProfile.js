import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: user?.address || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) return toast.error('Passwords do not match');
    if (pwd.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setChangingPwd(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success('Password changed!');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setChangingPwd(false); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error('Please write a review');
    setSubmittingReview(true);
    try {
      await api.post('/testimonials', { rating, text: reviewText });
      toast.success('Review submitted! Awaiting admin approval.');
      setReviewText('');
      setRating(5);
    } catch { toast.error('Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>My Profile</h1>

      {/* Profile */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>Personal Details</h2>
        <form onSubmit={saveProfile}>
          <div className="form-group"><label>Full Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input className="form-control" value={user?.phone} disabled style={{ opacity: 0.6 }} /></div>
          <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label>Address</label><textarea className="form-control" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      {/* Password */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>Change Password</h2>
        <form onSubmit={changePassword}>
          <div className="form-group"><label>Current Password</label><input className="form-control" type="password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} /></div>
          <div className="form-group"><label>New Password</label><input className="form-control" type="password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} /></div>
          <div className="form-group"><label>Confirm New Password</label><input className="form-control" type="password" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary" disabled={changingPwd}>{changingPwd ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>

      {/* Review */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>Leave a Review</h2>
        <form onSubmit={submitReview}>
          <div className="form-group">
            <label>Rating</label>
            <div className="stars" style={{ gap: '0.35rem', marginTop: '0.25rem' }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button" onClick={() => setRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Star size={28} fill={i <= rating ? 'var(--accent)' : 'none'} color={i <= rating ? 'var(--accent)' : 'var(--border)'} />
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Your Review</label>
            <textarea className="form-control" rows={4} placeholder="Share your experience with AP Events..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submittingReview}>{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
        </form>
      </div>
    </div>
  );
}
