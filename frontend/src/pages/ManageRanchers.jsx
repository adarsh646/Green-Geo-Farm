import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, User as UserIcon, Search, Lock, Plus } from 'lucide-react';
import './ManageRanchers.css';

const ManageRanchers = () => {
  const [ranchers, setRanchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);
  const [newRancher, setNewRancher] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/users/ranchers';

  const fetchRanchers = async () => {
    try {
      const response = await axios.get(API_URL);
      setRanchers(response.data);
    } catch (err) {
      console.error('Error fetching ranchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanchers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rancher? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchRanchers();
      } catch (err) {
        alert('Error deleting rancher');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewRancher({ ...newRancher, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let generated = '';
    for (let i = 0; i < 12; i += 1) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewRancher((prev) => ({ ...prev, password: generated }));
  };

  const handleCreateRancher = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await axios.post(API_URL, newRancher);
      alert('Rancher account created successfully');
      setNewRancher({ username: '', email: '', password: '' });
      await fetchRanchers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating rancher');
    } finally {
      setCreating(false);
    }
  };

  const filteredRanchers = ranchers.filter(r => 
    r.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-ranchers-container">
      <header className="manage-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Manage Ranchers</h1>
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <section className="create-rancher-card">
        <h2>Create Rancher Credentials</h2>
        <form className="create-rancher-form" onSubmit={handleCreateRancher}>
          <div className="credential-input">
            <UserIcon size={16} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={newRancher.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="credential-input">
            <Mail size={16} />
            <input
              type="email"
              name="email"
              placeholder="rancher@example.com"
              value={newRancher.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="credential-input">
            <Lock size={16} />
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={newRancher.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="credential-actions">
            <button type="button" className="btn-generate-password" onClick={generatePassword}>
              Generate Password
            </button>
            <button type="submit" className="btn-add-rancher" disabled={creating}>
              <Plus size={16} />
              {creating ? 'Creating...' : 'Add Rancher'}
            </button>
          </div>
        </form>
      </section>

      <main className="ranchers-list-main">
        {loading ? (
          <div className="loading">Loading ranchers...</div>
        ) : (
          <div className="ranchers-grid">
            {filteredRanchers.map((rancher) => (
              <div key={rancher._id} className="rancher-row-card">
                <div className="rancher-avatar-main">
                  <UserIcon size={24} />
                </div>
                <div className="rancher-details">
                  <h3>{rancher.username}</h3>
                  <div className="rancher-meta">
                    <Mail size={14} />
                    <span>{rancher.email}</span>
                  </div>
                </div>
                <div className="rancher-actions">
                  <button className="btn-delete" onClick={() => handleDelete(rancher._id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {filteredRanchers.length === 0 && <p className="no-data">No ranchers found.</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageRanchers;
