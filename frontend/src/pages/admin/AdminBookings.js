import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import api from '../../utils/api';

const STATUS_COLORS = { pending: 'badge-pending', processing: 'badge-processing', complete: 'badge-complete', cancelled: 'badge-cancelled' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', adminNotes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try { const r = await api.get('/bookings'); setBookings(r.data); }
    catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const openEdit = (b) => { setSelected(b); setForm({ status: b.status, adminNotes: b.adminNotes || '' }); };

  const saveStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/bookings/${selected._id}`, form);
      toast.success('Booking updated!');
      setSelected(null);
      fetchBookings();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const filterCounts = { all: bookings.length, pending: bookings.filter(b => b.status === 'pending').length, processing: bookings.filter(b => b.status === 'processing').length, complete: bookings.filter(b => b.status === 'complete').length };
  const [filter, setFilter] = useState('all');
  const displayed = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1rem' }}>Bookings</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {Object.entries(filterCounts).map(([key, val]) => (
          <div key={key} className="card" style={{ textAlign: 'center', cursor: 'pointer', border: filter === key ? '2px solid var(--primary)' : '1px solid var(--border)' }} onClick={() => setFilter(key)}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>{val}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'capitalize' }}>{key}</div>
          </div>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Customer</th><th>Event</th><th>Date</th><th>Guests</th><th>Budget</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {displayed.map(b => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customer?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customer?.phone}</div>
                    </td>
                    <td>{b.eventType}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(b.eventDate).toLocaleDateString()}</td>
                    <td>{b.guestCount}</td>
                    <td>₹{Number(b.budget).toLocaleString()}</td>
                    <td><span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>Update</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {displayed.length === 0 && <p className="text-center text-muted" style={{ padding: '2rem' }}>No bookings found.</p>}
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Update Booking</span>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.9rem' }}>
              <strong>{selected.customer?.name}</strong> — {selected.eventType} on {new Date(selected.eventDate).toLocaleDateString()}<br />
              <span style={{ color: 'var(--text-muted)' }}>{selected.venue}, {selected.address}</span><br />
              Guests: {selected.guestCount} | Budget: ₹{Number(selected.budget).toLocaleString()}
              {selected.decorDemands && <div style={{ marginTop: '0.4rem' }}>Décor: {selected.decorDemands}</div>}
            </div>
            <form onSubmit={saveStatus}>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="complete">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Admin Notes</label>
                <textarea className="form-control" rows={3} placeholder="Internal notes or message to client..." value={form.adminNotes} onChange={e => setForm({ ...form, adminNotes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
