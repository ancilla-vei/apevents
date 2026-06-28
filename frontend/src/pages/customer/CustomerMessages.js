import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CustomerMessages() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    api.get('/messages/admin').then(r => {
      setAdmin(r.data);
      if (r.data) loadMessages(r.data._id);
    }).catch(() => {});
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadMessages = async (adminId) => {
    try { const r = await api.get(`/messages/${adminId}`); setMessages(r.data); }
    catch { toast.error('Failed to load messages'); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !admin) return;
    setSending(true);
    try {
      await api.post('/messages', { receiverId: admin._id, content: text.trim() });
      setText('');
      loadMessages(admin._id);
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 8rem)' }}>
      <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1rem' }}>Messages</h1>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--primary)', borderRadius: '12px 12px 0 0' }}>
          <strong style={{ color: '#fff' }}>AP Events Team</strong>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>Admin Support</span>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.length === 0 && (
            <div className="text-center" style={{ margin: 'auto', color: 'var(--text-muted)' }}>
              <p>No messages yet.</p>
              <p style={{ fontSize: '0.85rem' }}>Send a message to start the conversation!</p>
            </div>
          )}
          {messages.map(m => {
            const isMine = m.sender._id === user.id || m.sender._id === user._id;
            return (
              <div key={m._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', padding: '0.65rem 1rem', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMine ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: isMine ? '#fff' : 'var(--text)', fontSize: '0.92rem'
                }}>
                  <p>{m.content}</p>
                  <p style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
          <input className="form-control" placeholder="Type your message..." value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
