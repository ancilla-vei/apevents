import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const emptyForm = { customer: '', booking: '', title: '', items: [{ service: '', description: '', price: '' }], totalAmount: '', validUntil: '', notes: '' };

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
    api.get('/customers').then(r => setCustomers(r.data));
    api.get('/bookings').then(r => setBookings(r.data));
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/quotations'); setQuotations(r.data); }
    catch { toast.error('Failed to load quotations'); }
    finally { setLoading(false); }
  };

  const calcTotal = (items) => items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);

  const updateItem = (idx, field, val) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: val };
    const total = calcTotal(items);
    setForm({ ...form, items, totalAmount: total });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { service: '', description: '', price: '' }] });
  const removeItem = (idx) => {
    const items = form.items.filter((_, i) => i !== idx);
    setForm({ ...form, items, totalAmount: calcTotal(items) });
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (q) => {
    setEditing(q);
    setForm({ customer: q.customer?._id || '', booking: q.booking?._id || '', title: q.title, items: q.items.map(i => ({ ...i, price: i.price.toString() })), totalAmount: q.totalAmount, validUntil: q.validUntil ? q.validUntil.split('T')[0] : '', notes: q.notes || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer || !form.title || form.items.some(i => !i.service || !i.price)) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      if (editing) await api.put(`/quotations/${editing._id}`, form);
      else await api.post('/quotations', form);
      toast.success(editing ? 'Quotation updated!' : 'Quotation sent!');
      setShowForm(false);
      fetchAll();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const deleteQ = async (id) => {
    if (!window.confirm('Delete this quotation?')) return;
    try { await api.delete(`/quotations/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>Quotations</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Quotation</button>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quotations.length === 0 && <p className="text-center text-muted" style={{ padding: '3rem' }}>No quotations yet.</p>}
          {quotations.map(q => (
            <div key={q._id} className="card">
              <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ color: 'var(--primary)' }}>{q.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For: {q.customer?.name} ({q.customer?.phone})</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>₹{Number(q.totalAmount).toLocaleString()}</span>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(q)}><Edit size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteQ(q._id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Service</th><th>Description</th><th style={{ textAlign: 'right' }}>Price</th></tr></thead>
                  <tbody>
                    {q.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.service}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.description || '-'}</td>
                        <td style={{ textAlign: 'right' }}>₹{Number(item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {q.notes && <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>{q.notes}</p>}
              <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleDateString()}{q.validUntil && ` · Valid until ${new Date(q.validUntil).toLocaleDateString()}`}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 660 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Quotation' : 'New Quotation'}</span>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Customer *</label>
                  <select className="form-control" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })}>
                    <option value="">Select customer</option>
                    {customers.map(c => <option key={c._id} value={c._id}>{c.name} – {c.phone}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Linked Booking (optional)</label>
                  <select className="form-control" value={form.booking} onChange={e => setForm({ ...form, booking: e.target.value })}>
                    <option value="">None</option>
                    {bookings.filter(b => b.customer?._id === form.customer || !form.customer).map(b => (
                      <option key={b._id} value={b._id}>{b.eventType} – {new Date(b.eventDate).toLocaleDateString()}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input className="form-control" placeholder="Quotation title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Line Items *</label>
                  <button type="button" className="btn btn-outline btn-sm" onClick={addItem}><Plus size={14} /> Add Item</button>
                </div>
                {form.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 120px 36px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input className="form-control" placeholder="Service" value={item.service} onChange={e => updateItem(idx, 'service', e.target.value)} />
                    <input className="form-control" placeholder="Description" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                    <input className="form-control" type="number" placeholder="₹ Price" value={item.price} onChange={e => updateItem(idx, 'price', e.target.value)} min={0} />
                    {form.items.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}><X size={14} /></button>}
                  </div>
                ))}
                <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                  Total: ₹{Number(form.totalAmount || 0).toLocaleString()}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Valid Until</label>
                  <input type="date" className="form-control" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" rows={2} placeholder="Additional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Send Quotation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
