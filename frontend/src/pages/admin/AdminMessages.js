import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminMessages() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    api.get('/messages/customers').then(r => setCustomers(r.data));
    api.get('/customers').then(r => setAllCustomers(r.data));
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadMessages = async (customerId) => {
    try { const r = await api.get(`/messages/${customerId}`); setMessages(r.data); }
    catch { toast.error('Failed to load messages'); }
  };

  const selectCustomer = (c) => { setSelected(c); loadMessages(c._id); };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      await api.post('/messages', { receiverId: selected._id, content: text.trim() });
      setText('');
      loadMessages(selected._id);
    } catch { toast.error('Failed to send'); }
    finally { setSending(false); }
  };

  // Merge: existing chat customers + ability to select any customer
  const chatCustomers = customers;
  const otherCustomers = allCustomers.filter(c => !customers.find(cc => cc._id === c._id));

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1rem' }}>Messages</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem', height: 'calc(100vh - 10rem)' }}>

        {/* Customer list */}
        <div className="card" style={{ padding: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--primary)' }}>Conversations</div>
          {chatCustomers.map(c => (
            <div key={c._id} onClick={() => selectCustomer(c)}
              style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selected?._id === c._id ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.15s' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.phone}</div>
            </div>
          ))}
          {otherCustomers.length > 0 && (
            <>
              <div style={{ padding: '0.6rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>All Customers</div>
              {otherCustomers.map(c => (
                <div key={c._id} onClick={() => selectCustomer(c)}
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selected?._id === c._id ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.15s', opacity: 0.75 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.phone}</div>
                </div>
              ))}
            </>
          )}
          {customers.length === 0 && allCustomers.length === 0 && (
            <p className="text-muted" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.88rem' }}>No customers yet.</p>
          )}
        </div>

        {/* Chat */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selected ? (
            <div className="flex-center" style={{ flex: 1, color: 'var(--text-muted)', flexDirection: 'column', gap: '0.75rem' }}>
              <Send size={36} style={{ opacity: 0.4 }} />
              <p>Select a customer to start messaging</p>
            </div>
          ) : (
            <>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--primary)', borderRadius: '12px 12px 0 0' }}>
                <strong style={{ color: '#fff' }}>{selected.name}</strong>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>{selected.phone}</span>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {messages.length === 0 && <p className="text-center text-muted" style={{ margin: 'auto' }}>No messages yet. Say hello!</p>}
                {messages.map(m => {
                  const isMine = m.sender._id === user.id || m.sender._id === user._id || m.sender.role === 'admin';
                  return (
                    <div key={m._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '0.6rem 1rem',
                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMine ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: isMine ? '#fff' : 'var(--text)', fontSize: '0.9rem'
                      }}>
                        <p>{m.content}</p>
                        <p style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: '0.2rem', textAlign: 'right' }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <form onSubmit={sendMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                <input className="form-control" placeholder={`Message ${selected.name}...`} value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} />
                <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}><Send size={15} /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
