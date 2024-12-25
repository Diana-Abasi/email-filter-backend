import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettings(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load settings');
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/settings', settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Settings updated successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to update settings');
    }
  };

  return (
    <div>
      <h2>User Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Always Trust:
          <input
            type="text"
            value={settings.customAlwaysTrust?.join(', ') || ''}
            onChange={(e) =>
              setSettings({ ...settings, customAlwaysTrust: e.target.value.split(',').map((item) => item.trim()) })
            }
          />
        </label>
      </div>
      <div>
        <label>
          Always Quarantine:
          <input
            type="text"
            value={settings.customAlwaysQuarantine?.join(', ') || ''}
            onChange={(e) =>
              setSettings({ ...settings, customAlwaysQuarantine: e.target.value.split(',').map((item) => item.trim()) })
            }
          />
        </label>
      </div>
      <div>
        <label>
          Quarantine Retention (days):
          <input
            type="number"
            value={settings.quarantineRetention || 30}
            onChange={(e) => setSettings({ ...settings, quarantineRetention: Number(e.target.value) })}
          />
        </label>
      </div>
      <div>
        <label>
          Email Notifications:
          <input
            type="checkbox"
            checked={settings.emailNotifications || false}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
};

export default SettingsPage;
