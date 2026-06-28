import React, { useEffect, useState } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/enquiries'); setEnquiries(r.data); }
    catch { toast.error('Failed to load enquiries'); }
    finally { setLoading(false); }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return toast.error('Enter a reply');
    setSending(true);
    try {
      await api.put(`/enquiries/${selected._id}/reply`, { adminReply: reply });
      toast.success('Reply sent!');
      setSelected(null);
      setReply('');
      fetchAll();
    } catch { toast.error('Failed to send reply'); }
    finally { setSending(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try { await api.delete(`/enquiries/${id}`); toast.success('Deleted'); fetchAll(); if (selected?._id === id) setSelected(null); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1rem' }}>Enquiries</h1>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* List */}
        <div>
          {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {enquiries.length === 0 && <p className="text-center text-muted" style={{ padding: '2rem' }}>No enquiries yet.</p>}
              {enquiries.map(e => (
                <div key={e._id} className="card" style={{ cursor: 'pointer', border: selected?._id === e._id ? '2px solid var(--primary)' : '1px solid var(--border)', transition: 'border 0.2s' }}
                  onClick={() => { setSelected(e); setReply(e.adminReply || ''); }}
                >
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ color: 'var(--primary)' }}>{e.name}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>{e.phone}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span className={`badge ${e.status === 'replied' ? 'badge-replied' : 'badge-new'}`}>{e.status}</span>
                      <button className="btn btn-danger btn-sm" onClick={(ev) => { ev.stopPropagation(); remove(e._id); }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{new Date(e.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail / Reply */}
        {selected && (
          <div className="card" style={{ position: 'sticky', top: '1rem', alignSelf: 'start' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--primary)' }}>Enquiry Detail</h3>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>From:</strong> {selected.name}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.message}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            {selected.adminReply && (
              <div style={{ background: 'var(--primary)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Your previous reply:</p>
                <p style={{ color: '#fff', fontSize: '0.9rem' }}>{selected.adminReply}</p>
              </div>
            )}
            <form onSubmit={sendReply}>
              <div className="form-group">
                <label>Reply to Customer</label>
                <textarea className="form-control" rows={4} placeholder="Write your reply..." value={reply} onChange={e => setReply(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={sending}>
                <Send size={15} /> {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
