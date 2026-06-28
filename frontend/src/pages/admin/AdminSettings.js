import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

// ✅ Outside component to prevent re-mount on every render
const Section = ({ title, children }) => (
  <div className="card" style={{ marginBottom: '1.5rem' }}>
    <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>{title}</h2>
    {children}
  </div>
);

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [coreValueInput, setCoreValueInput] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then(r => {
        // ✅ Merge defaults so new fields are always defined in state
        setSettings({
          statsEventsHosted:      '100+',
          statsHappyGuests:       '500+',
          statsYearsOfExcellence: '1',
          statsClientSupport:     '24/7',
          ...r.data,
        });
        setCoreValueInput((r.data.coreValues || []).join(', '));
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      const { _id, __v, ...rest } = settings;
      rest.coreValues = coreValueInput.split(',').map(v => v.trim()).filter(Boolean);
      Object.entries(rest).forEach(([k, v]) => {
        // skip undefined/null, stringify booleans, handle arrays
        if (v === undefined || v === null) return;
        if (Array.isArray(v)) {
          v.forEach(item => fd.append(k, item));
        } else if (typeof v === 'boolean') {
          fd.append(k, v.toString());
        } else {
          fd.append(k, v);
        }
      });
      if (logoFile) fd.append('logo', logoFile);
      if (bgFile) fd.append('backgroundImage', bgFile);
      const r = await api.put('/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSettings(r.data);
      toast.success('Settings saved!');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unknown error';
      console.error('Save settings error:', err?.response?.data || err);
      toast.error(`Failed to save: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!settings) return null;

  return (
    <div>
      <div className="flex-between mb-2">
        <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>Website Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Company Info */}
        <Section title="🏢 Company Information">
          <div className="grid-2">
            <div className="form-group">
              <label>Company Name</label>
              <input className="form-control" value={settings.companyName} onChange={e => handleChange('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input className="form-control" value={settings.tagline} onChange={e => handleChange('tagline', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Mission Statement</label>
            <textarea className="form-control" rows={3} value={settings.missionStatement} onChange={e => handleChange('missionStatement', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Core Values (comma-separated)</label>
            <input className="form-control" value={coreValueInput} onChange={e => setCoreValueInput(e.target.value)} placeholder="Creativity, Excellence, Trust" />
          </div>
        </Section>

        {/* Contact */}
        <Section title="📞 Contact Information">
          <div className="grid-2">
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" value={settings.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input className="form-control" value={settings.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={settings.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="form-group">
              {/* ✅ Full Instagram URL instead of handle */}
              <label>Instagram URL</label>
              <input
                className="form-control"
                type="url"
                value={settings.instagram}
                onChange={e => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/apevents"
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>
                Enter the full URL (e.g. https://instagram.com/yourhandle)
              </small>
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" value={settings.address} onChange={e => handleChange('address', e.target.value)} />
          </div>
        </Section>

        {/* Stats */}
        <Section title="📊 Stats (About Section)">
          <div className="grid-2">
            <div className="form-group">
              <label>Events Hosted</label>
              <input className="form-control" value={settings.statsEventsHosted} onChange={e => handleChange('statsEventsHosted', e.target.value)} placeholder="100+" />
            </div>
            <div className="form-group">
              <label>Happy Guests</label>
              <input className="form-control" value={settings.statsHappyGuests} onChange={e => handleChange('statsHappyGuests', e.target.value)} placeholder="500+" />
            </div>
            <div className="form-group">
              <label>Years of Excellence</label>
              <input className="form-control" value={settings.statsYearsOfExcellence} onChange={e => handleChange('statsYearsOfExcellence', e.target.value)} placeholder="1" />
            </div>
            <div className="form-group">
              <label>Client Support</label>
              <input className="form-control" value={settings.statsClientSupport} onChange={e => handleChange('statsClientSupport', e.target.value)} placeholder="24/7" />
            </div>
          </div>
        </Section>

        {/* Branding */}
        <Section title="🎨 Branding & Appearance">
          <div className="grid-2">
            <div className="form-group">
              <label>Logo</label>
              {settings.logo && (
                <img src={`http://localhost:5000${settings.logo}`} alt="logo" style={{ height: 60, borderRadius: 6, marginBottom: '0.5rem', display: 'block' }} />
              )}
              <input type="file" className="form-control" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Background Image (Hero)</label>
              {settings.backgroundImage && (
                <img src={`http://localhost:5000${settings.backgroundImage}`} alt="bg" style={{ height: 60, borderRadius: 6, marginBottom: '0.5rem', objectFit: 'cover', width: '100%', display: 'block' }} />
              )}
              <input type="file" className="form-control" accept="image/*" onChange={e => setBgFile(e.target.files[0])} />
            </div>
          </div>
          <div className="grid-3">
            <div className="form-group">
              <label>Primary Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={settings.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, border: '1.5px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                <input className="form-control" value={settings.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={settings.secondaryColor} onChange={e => handleChange('secondaryColor', e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, border: '1.5px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                <input className="form-control" value={settings.secondaryColor} onChange={e => handleChange('secondaryColor', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Accent Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={settings.accentColor} onChange={e => handleChange('accentColor', e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, border: '1.5px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                <input className="form-control" value={settings.accentColor} onChange={e => handleChange('accentColor', e.target.value)} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <input type="checkbox" id="darkMode" checked={settings.darkMode} onChange={e => handleChange('darkMode', e.target.checked)} />
            <label htmlFor="darkMode" style={{ marginBottom: 0 }}>Enable dark mode by default</label>
          </div>
        </Section>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }} disabled={saving}>
          <Save size={17} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}