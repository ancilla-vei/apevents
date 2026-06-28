import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function CustomerQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quotations/my').then(r => setQuotations(r.data)).catch(() => toast.error('Failed to load quotations')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>My Quotations</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Pricing estimates sent by admin</p>

      {quotations.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
          <h3 style={{ color: 'var(--text-muted)' }}>No quotations yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Admin will send your event quotation after reviewing your booking.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quotations.map(q => (
            <div key={q._id} className="card">
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--primary)' }}>{q.title}</h3>
                  {q.booking && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For: {q.booking.eventType}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>₹{Number(q.totalAmount).toLocaleString()}</div>
                  {q.validUntil && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Valid until {new Date(q.validUntil).toLocaleDateString()}</div>}
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
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{Number(item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 700 }}>
                      <td colSpan={2} style={{ textAlign: 'right', color: 'var(--primary)' }}>Total</td>
                      <td style={{ textAlign: 'right', color: 'var(--primary)', fontSize: '1.05rem' }}>₹{Number(q.totalAmount).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {q.notes && <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.88rem', fontStyle: 'italic' }}>{q.notes}</p>}
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sent on {new Date(q.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
