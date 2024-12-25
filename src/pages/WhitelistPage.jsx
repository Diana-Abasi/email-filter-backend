import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhitelistPage = () => {
  const [whitelist, setWhitelist] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch whitelist on load
  useEffect(() => {
    const fetchWhitelist = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/whitelist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWhitelist(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load whitelist');
      }
    };
    fetchWhitelist();
  }, []);

  // Add to whitelist
  const handleAdd = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/whitelist',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWhitelist([...whitelist, res.data]);
      setEmail('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add email to whitelist');
      setLoading(false);
    }
  };

  // Remove from whitelist
  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/whitelist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWhitelist(whitelist.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to remove email from whitelist');
    }
  };

  return (
    <div>
      <h2>Manage Whitelist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="email"
          placeholder="Add email to whitelist"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      <ul>
        {whitelist.map((item) => (
          <li key={item._id}>
            {item.email}
            <button onClick={() => handleRemove(item._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhitelistPage;
