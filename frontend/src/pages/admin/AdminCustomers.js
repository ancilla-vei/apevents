import React, { useEffect, useState } from 'react';
import { Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try { const r = await api.get('/customers'); setCustomers(r.data); }
    catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this customer? This cannot be undone.')) return;
    try { await api.delete(`/customers/${id}`); toast.success('Customer deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>Customer Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{customers.length} registered customers</p>
        </div>
      </div>

      <div className="form-group" style={{ maxWidth: 360, marginBottom: '1.25rem' }}>
        <input className="form-control" placeholder="Search by name, phone or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        filtered.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
            <p className="text-muted">{search ? 'No customers match your search.' : 'No registered customers yet.'}</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Joined</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c._id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.phone}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.email || '—'}</td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || '—'}</td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
