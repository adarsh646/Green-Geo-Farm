import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Search, ArrowLeft, Info, Calendar, Activity, Scale, User as UserIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../CattleManagement.css';

const CattleManagement = () => {
  const [cattle, setCattle] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
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
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    try {
      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSelectedCattle(null);
      setShowDeleteConfirm(false);
      fetchCattle();
    } catch (err) {
      console.error('Error deleting cattle');
      alert('Error deleting cattle. Please try again.');
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
                onClick={() => setSelectedCattle(item)}
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
            {cattle.length === 0 && <p className="no-data">No cattle records found.</p>}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button className="fab-add" onClick={() => setShowAddForm(true)}>
        <Plus size={28} />
      </button>

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

      {/* Detail Popup Modal */}
      {selectedCattle && (
        <div className="modal-overlay">
          <div className="modal-content detail-modal">
            <div className="modal-header">
              <h2>Cattle Details</h2>
              <button className="close-btn" onClick={() => setSelectedCattle(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="detail-card">
              {selectedCattle.imageUrl && (
                <div className="detail-image-container">
                  <img 
                    src={`${BASE_URL}${selectedCattle.imageUrl}`} 
                    alt="Cattle" 
                    className="detail-image" 
                  />
                </div>
              )}
              <div className="detail-header-main">
                <div className="detail-tag-large">{selectedCattle.tagNumber}</div>
                <span className={`status-badge ${selectedCattle.healthStatus.toLowerCase()}`}>
                  {selectedCattle.healthStatus}
                </span>
              </div>

              <div className="detail-info-grid">
                <div className="info-item">
                  <UserIcon size={20} />
                  <div>
                    <span className="info-label">Breed</span>
                    <span className="info-value">{selectedCattle.breed}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={20} />
                  <div>
                    <span className="info-label">Age</span>
                    <span className="info-value">{selectedCattle.age} Years</span>
                  </div>
                </div>
                <div className="info-item">
                  <Activity size={20} />
                  <div>
                    <span className="info-label">Gender</span>
                    <span className="info-value">{selectedCattle.gender}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Scale size={20} />
                  <div>
                    <span className="info-label">Weight</span>
                    <span className="info-value">{selectedCattle.weight || 'Not recorded'} Kg</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="btn-submit-cattle" 
              style={{ width: '100%', marginBottom: '12px' }}
              onClick={() => navigate('/cattle-records', { 
                state: { 
                  cattleId: selectedCattle._id, 
                  tagNumber: selectedCattle.tagNumber,
                  breed: selectedCattle.breed,
                  age: selectedCattle.age
                } 
              })}
            >
              Add Daily Record
            </button>
            <button 
              className="btn-submit-cattle" 
              style={{ width: '100%', marginBottom: '12px', backgroundColor: '#3b82f6' }}
              onClick={() => navigate(`/cattle-report/${selectedCattle._id}`)}
            >
              View Weekly Report
            </button>
            <button 
              className="btn-submit-cattle" 
              style={{ width: '100%', marginBottom: '12px', backgroundColor: '#ef4444' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={20} style={{ marginRight: '8px' }} />
              Delete Cattle Record
            </button>
            <button className="btn-close-detail" style={{ marginTop: 0 }} onClick={() => setSelectedCattle(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="delete-confirm-icon" style={{ color: '#ef4444', marginBottom: '20px' }}>
              <Trash2 size={48} />
            </div>
            <h2 style={{ marginBottom: '12px' }}>Delete Cattle?</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              Are you sure you want to delete cattle <strong>{selectedCattle?.tagNumber}</strong>? This action cannot be undone.
            </p>
            <div className="form-row" style={{ gap: '12px' }}>
              <button 
                className="btn-close-detail" 
                style={{ marginTop: 0, flex: 1 }} 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-submit-cattle" 
                style={{ marginTop: 0, flex: 1, backgroundColor: '#ef4444' }}
                onClick={() => handleDelete(selectedCattle?._id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CattleManagement;
