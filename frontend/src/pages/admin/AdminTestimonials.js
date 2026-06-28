import React, { useEffect, useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} fill={i <= rating ? 'var(--accent)' : 'none'} color={i <= rating ? 'var(--accent)' : 'var(--border)'} />
      ))}
    </div>
  );
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/testimonials'); setTestimonials(r.data); }
    catch { toast.error('Failed to load testimonials'); }
    finally { setLoading(false); }
  };

  const approve = async (id) => {
    try { await api.put(`/testimonials/${id}/approve`); toast.success('Approved!'); fetchAll(); }
    catch { toast.error('Failed to approve'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await api.delete(`/testimonials/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Failed to delete'); }
  };

  const displayed = filter === 'all' ? testimonials : filter === 'approved' ? testimonials.filter(t => t.approved) : testimonials.filter(t => !t.approved);

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1rem' }}>Testimonials</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
            {f} ({f === 'all' ? testimonials.length : f === 'approved' ? testimonials.filter(t => t.approved).length : testimonials.filter(t => !t.approved).length})
          </button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="grid-3">
          {displayed.length === 0 && <p className="text-muted" style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center' }}>No testimonials found.</p>}
          {displayed.map(t => (
            <div key={t._id} className="card" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                <span className={`badge ${t.approved ? 'badge-approved' : 'badge-pending-review'}`}>{t.approved ? 'Approved' : 'Pending'}</span>
              </div>
              <Stars rating={t.rating} />
              <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.6 }}>"{t.text}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{t.name}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!t.approved && <button className="btn btn-success btn-sm" onClick={() => approve(t._id)}><Check size={14} /> Approve</button>}
                <button className="btn btn-danger btn-sm" onClick={() => remove(t._id)}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
