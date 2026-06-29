import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import getImg from '../../utils/imageHelper';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', active: true });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/categories'); setCategories(r.data); }
    catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', active: true }); setPhotoFile(null); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ title: c.title, description: c.description || '', active: c.active }); setPhotoFile(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);
      if (editing) await api.put(`/categories/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editing ? 'Category updated!' : 'Category created!');
      setShowForm(false);
      fetchAll();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>Event Categories</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Category</button>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="grid-4">
          {categories.length === 0 && <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No categories yet.</p>}
          {categories.map(c => (
            <div key={c._id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: c.active ? 1 : 0.6 }}>
              <div style={{ height: 160, background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                {c.photo
                  ? <img src={getImg(c.photo)} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontFamily: 'Playfair Display', fontSize: '1.1rem' }}>{c.title}</span>
                    </div>
                }
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>{c.title}</h3>
                {c.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{c.description}</p>}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}><Edit size={13} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Category' : 'New Category'}</span>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title *</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Wedding" /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group">
                <label>Photo</label>
                {editing?.photo && <img src={getImg(editing.photo)} alt="" style={{ height: 80, borderRadius: 6, marginBottom: '0.5rem' }} />}
                <input type="file" className="form-control" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="catActive" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                <label htmlFor="catActive" style={{ marginBottom: 0 }}>Active</label>
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
