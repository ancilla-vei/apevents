import React, { useEffect, useState } from 'react';
import { Plus, X, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const STATUS_COLORS = { pending: 'badge-pending', processing: 'badge-processing', complete: 'badge-complete', cancelled: 'badge-cancelled' };

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eventType: '', eventDate: '', startTime: '', guestCount: '', venue: '', address: '', budget: '', decorDemands: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
    api.get('/categories/public').then(r => setCategories(r.data));
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try { const r = await api.get('/bookings/my'); setBookings(r.data); }
    catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { eventType, eventDate, startTime, guestCount, venue, address, budget } = form;
    if (!eventType || !eventDate || !startTime || !guestCount || !venue || !address || !budget)
      return toast.error('Please fill all required fields');
    setSubmitting(true);
    try {
      await api.post('/bookings', form);
      toast.success('Booking request submitted!');
      setShowForm(false);
      setForm({ eventType: '', eventDate: '', startTime: '', guestCount: '', venue: '', address: '', budget: '', decorDemands: '' });
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit booking'); }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your event bookings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        bookings.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
            <h3 style={{ color: 'var(--text-muted)' }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Book your first event to get started!</p>
            <button className="btn btn-primary mt-2" onClick={() => setShowForm(true)}>Book Now</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(b => (
              <div key={b._id} className="card">
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{b.eventType}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Date: </span><strong>{new Date(b.eventDate).toLocaleDateString()}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Time: </span><strong>{b.startTime}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Guests: </span><strong>{b.guestCount}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Budget: </span><strong>₹{Number(b.budget).toLocaleString()}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Venue: </span><strong>{b.venue}</strong></div>
                </div>
                {b.decorDemands && <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}><strong>Décor:</strong> {b.decorDemands}</p>}
                {b.adminNotes && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 6, borderLeft: '3px solid var(--primary)' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Admin Note: </strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{b.adminNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Booking Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <span className="modal-title">Book an Event</span>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Event Type *</label>
                  <select className="form-control" value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
                    <option value="">Select type</option>
                    {categories.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Event Date *</label>
                  <input type="date" className="form-control" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label>Start Time *</label>
                  <input type="time" className="form-control" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Guest Count *</label>
                  <input type="number" className="form-control" placeholder="e.g. 150" value={form.guestCount} onChange={e => setForm({ ...form, guestCount: e.target.value })} min={1} />
                </div>
                <div className="form-group">
                  <label>Venue Name *</label>
                  <input className="form-control" placeholder="Hall/venue name" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Budget (₹) *</label>
                  <input type="number" className="form-control" placeholder="Your budget" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} min={0} />
                </div>
              </div>
              <div className="form-group">
                <label>Full Address *</label>
                <input className="form-control" placeholder="Complete address of venue" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Décor Demands (optional)</label>
                <textarea className="form-control" placeholder="Any specific décor or theme requirements..." value={form.decorDemands} onChange={e => setForm({ ...form, decorDemands: e.target.value })} rows={3} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Booking'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
