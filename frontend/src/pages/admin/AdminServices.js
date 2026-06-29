import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import getImg from '../../utils/imageHelper';

const empty = { name: '', description: '', icon: '', order: 0, active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/services'); setServices(r.data); }
    catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(empty); setImageFile(null); setShowForm(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, description: s.description || '', icon: s.icon || '', order: s.order || 0, active: s.active }); setImageFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Service name is required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing) await api.put(`/services/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editing ? 'Service updated!' : 'Service created!');
      setShowForm(false);
      fetchAll();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await api.delete(`/services/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>Services</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Service</button>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="grid-3">
          {services.length === 0 && <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No services yet. Add your first!</p>}
          {services.map(s => (
            <div key={s._id} className="card" style={{ position: 'relative', opacity: s.active ? 1 : 0.6 }}>
              {s.image && <img src={getImg(s.image)} alt={s.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: '0.75rem' }} />}
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>{s.name}</h3>
              {s.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>{s.description}</p>}
              {!s.active && <span className="badge badge-cancelled" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Inactive</span>}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}><Edit size={14} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(s._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Service' : 'New Service'}</span>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Photography" /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." /></div>
              <div className="grid-2">
                <div className="form-group"><label>Icon (emoji)</label><input className="form-control" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📸" /></div>
                <div className="form-group"><label>Order</label><input type="number" className="form-control" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} min={0} /></div>
              </div>
              <div className="form-group">
                <label>Image</label>
                {editing?.image && <img src={getImg(editing.image)} alt="" style={{ height: 80, borderRadius: 6, marginBottom: '0.5rem' }} />}
                <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                <label htmlFor="active" style={{ marginBottom: 0 }}>Active (show on website)</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
