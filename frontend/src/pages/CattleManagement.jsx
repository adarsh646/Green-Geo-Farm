import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Search, ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../CattleManagement.css';
import { getManagementRole, getManagementToken } from '../utils/sessionStorage';

const CattleManagement = () => {
  const [cattle, setCattle] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isAdmin = getManagementRole() === 'admin';
  
  const [formData, setFormData] = useState({
    tagNumber: '',
    breed: '',
    age: '',
    gender: 'Female',
    healthStatus: 'Healthy',
    weight: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const API_URL = 'http://localhost:5000/api/cattle';
  const BASE_URL = 'http://localhost:5000';

  const fetchCattle = async () => {
    try {
      const response = await axios.get(API_URL);
      setCattle(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cattle');
      setLoading(false);
    }
  };

  const filteredCattle = cattle.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.tagNumber.toLowerCase().includes(term) ||
      item.breed.toLowerCase().includes(term) ||
      item.gender.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchCattle();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getManagementToken();

    if (!isAdmin) {
      alert('Only admin can add cattle images and records.');
      return;
    }

    if (!token) {
      alert('Session expired. Please sign in again.');
      navigate('/management/login');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    try {
      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setShowAddForm(false);
      setFormData({
        tagNumber: '',
        breed: '',
        age: '',
        gender: 'Female',
        healthStatus: 'Healthy',
        weight: '',
      });
      setImageFile(null);
      fetchCattle();
    } catch (err) {
      alert('Error adding cattle');
    }
  };

  return (
    <div className="cattle-mgmt-container">
      {/* Header */}
      <header className="cattle-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Cattle Records</h1>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search tag, breed, or gender..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Cattle List */}
      <main className="cattle-list-main">
        {loading ? (
          <div className="loading">Loading records...</div>
        ) : (
          <div className="cattle-list-container">
            {filteredCattle.map((item) => (
              <div 
                key={item._id} 
                className="cattle-item-row" 
                onClick={() =>
                  navigate(`/cattle-details/${item._id}`, {
                    state: { cattle: item }
                  })
                }
              >
                <div className="cattle-avatar">
                  {item.imageUrl ? (
                    <img src={`${BASE_URL}${item.imageUrl}`} alt="Cattle" />
                  ) : (
                    <div className="avatar-placeholder">{item.tagNumber.charAt(0)}</div>
                  )}
                </div>
                <div className="cattle-info-main">
                  <div className="cattle-row-header">
                    <span className="cattle-tag-number">{item.tagNumber}</span>
                    <span className={`status-dot ${item.healthStatus.toLowerCase()}`}></span>
                  </div>
                  <div className="cattle-row-subtext">
                    {item.breed} • {item.age} Years • {item.gender}
                  </div>
                </div>
                <div className="cattle-row-action">
                  <Info size={20} />
                </div>
              </div>
            ))}
            {filteredCattle.length === 0 && <p className="no-data">No cattle records found.</p>}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      {isAdmin && (
        <button className="fab-add" onClick={() => setShowAddForm(true)}>
          <Plus size={28} />
        </button>
      )}

      {/* Add Cattle Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Cattle</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="cattle-form">
              <div className="form-group">
                <label>Tag Number</label>
                <input name="tagNumber" value={formData.tagNumber} onChange={handleChange} placeholder="e.g. TX-402" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g. Angus" required />
                </div>
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Weight (Kg)</label>
                  <input name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>

              <div className="form-group">
                <label>Health Status</label>
                <input name="healthStatus" value={formData.healthStatus} onChange={handleChange} placeholder="e.g. Healthy" />
              </div>

              <div className="form-group">
                <label>Cattle Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                />
              </div>

              <button type="submit" className="btn-submit-cattle">Save Cattle Profile</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CattleManagement;
