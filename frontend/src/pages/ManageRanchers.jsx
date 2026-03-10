import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, User as UserIcon, Search } from 'lucide-react';
import './ManageRanchers.css';

const ManageRanchers = () => {
  const [ranchers, setRanchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/users/ranchers';

  const fetchRanchers = async () => {
    try {
      const response = await axios.get(API_URL);
      setRanchers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ranchers');
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
        fetchRanchers();
      } catch (err) {
        alert('Error deleting rancher');
      }
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
