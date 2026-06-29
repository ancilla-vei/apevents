import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import getImg from '../../utils/imageHelper';

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eventName: '', description: '', featured: false });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/gallery'); setGallery(r.data); }
    catch { toast.error('Failed to load gallery'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error('Please select an image');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', imageFile);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      setShowForm(false);
      setForm({ eventName: '', description: '', featured: false });
      setImageFile(null);
      fetchAll();
    } catch { toast.error('Upload failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try { await api.delete(`/gallery/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>Gallery</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{gallery.length} image{gallery.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Upload Image</button>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        gallery.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p className="text-muted">No images yet. Upload your first event photo!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.map(g => (
              <div key={g._id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                <img src={getImg(g.image)} alt={g.eventName || 'gallery'} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '0.6rem 0.75rem' }}>
                  {g.eventName && <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary)' }}>{g.eventName}</p>}
                  {g.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{g.description}</p>}
                  {g.featured && <span className="badge badge-approved" style={{ fontSize: '0.72rem', marginTop: '0.25rem', display: 'inline-block' }}>Featured</span>}
                </div>
                <button className="btn btn-danger btn-sm"
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.3rem', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => remove(g._id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Upload Gallery Image</span>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Image *</label>
                <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ marginTop: '0.5rem', height: 120, borderRadius: 6, objectFit: 'cover' }} />
                )}
              </div>
              <div className="form-group"><label>Event Name</label><input className="form-control" placeholder="e.g. Johnson Wedding" value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" rows={2} placeholder="Optional caption..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured" style={{ marginBottom: 0 }}>Mark as featured</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
