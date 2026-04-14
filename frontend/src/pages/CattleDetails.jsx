import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Trash2, Edit3, X } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '@google/model-viewer';
import '../CattleManagement.css';
import './CattleDetails.css';
import { getManagementRole, getManagementToken } from '../utils/sessionStorage';

const CattleDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [cattle, setCattle] = useState(location.state?.cattle || null);
  const [loading, setLoading] = useState(!location.state?.cattle);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    tagNumber: '',
    breed: '',
    age: '',
    gender: '',
    healthStatus: '',
    weight: '',
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [modelFileUrl, setModelFileUrl] = useState('');
  const [showDeleteModelOption, setShowDeleteModelOption] = useState(false);
  const [modelBusy, setModelBusy] = useState(false);
  const isAdmin = getManagementRole() === 'admin';

  const API_URL = 'http://localhost:5000/api/cattle';
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchCattle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/${id}`);
        setCattle(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching cattle details:', err);
        setError('Unable to load cattle details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!cattle || cattle._id !== id) {
      fetchCattle();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!cattle?._id) {
      return;
    }

    if (!isAdmin) {
      alert('Only admin can delete cattle images and 3D models.');
      return;
    }

    const token = getManagementToken();
    if (!token) {
      alert('Session expired. Please sign in again.');
      navigate('/management/login');
      return;
    }

    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/${cattle._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/cattle-management');
    } catch (err) {
      console.error('Error deleting cattle:', err);
      alert('Error deleting cattle. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      tagNumber: cattle.tagNumber || '',
      breed: cattle.breed || '',
      age: cattle.age || '',
      gender: cattle.gender || 'Female',
      healthStatus: cattle.healthStatus || 'Healthy',
      weight: cattle.weight || '',
    });
    setEditImageFile(null);
    setShowEditForm(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = getManagementToken();

    if (!isAdmin) {
      alert('Only admin can edit cattle records.');
      return;
    }

    if (!token) {
      alert('Session expired. Please sign in again.');
      navigate('/management/login');
      return;
    }

    const data = new FormData();
    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key] !== null && editFormData[key] !== undefined) {
        data.append(key, editFormData[key]);
      }
    });

    if (editImageFile) {
      data.append('image', editImageFile);
    }

    try {
      setUpdating(true);
      const response = await axios.patch(`${API_URL}/${cattle._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setCattle(response.data);
      setShowEditForm(false);
    } catch (err) {
      console.error('Error updating cattle:', err);
      alert(err.response?.data?.message || 'Error updating cattle. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const statusClass = cattle?.healthStatus
    ? cattle.healthStatus.toLowerCase().replace(/\s+/g, '-')
    : '';
  const healthToneClass = statusClass.includes('healthy')
    ? 'tone-healthy'
    : statusClass.includes('warning')
      ? 'tone-warning'
      : statusClass.includes('sick')
        ? 'tone-sick'
        : 'tone-default';
  const cattleNode = cattle?._id ? cattle._id.slice(-4).toUpperCase() : '----';

  const detailItems = cattle
    ? [
        { label: 'Breed', value: cattle.breed || 'Not recorded' },
        { label: 'Age', value: cattle.age ? `${cattle.age} Years` : 'Not recorded' },
        { label: 'Gender', value: cattle.gender || 'Not recorded' },
        { label: 'Weight', value: cattle.weight ? `${cattle.weight} Kg` : 'Not recorded' },
      ]
    : [];

  const handleModelFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!isAdmin) {
      alert('Only admin can add 3D models.');
      e.target.value = '';
      return;
    }

    const isSupported = /\.(glb|gltf)$/i.test(file.name);
    if (!isSupported) {
      alert('Please upload a .glb or .gltf model file.');
      e.target.value = '';
      return;
    }

    const token = getManagementToken();
    if (!token) {
      alert('Session expired. Please sign in again.');
      navigate('/management/login');
      e.target.value = '';
      return;
    }

    const uploadModel = async () => {
      try {
        setModelBusy(true);
        const formData = new FormData();
        formData.append('model3d', file);

        const response = await axios.patch(`${API_URL}/${id}/model`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setCattle(response.data);
        setShowDeleteModelOption(false);
      } catch (err) {
        console.error('Error uploading 3D model:', err);
        alert(err.response?.data?.message || 'Failed to upload 3D model.');
      } finally {
        setModelBusy(false);
        e.target.value = '';
      }
    };

    uploadModel();
  };

  const handleDeleteModel = async () => {
    if (!isAdmin) {
      alert('Only admin can delete 3D models.');
      return;
    }

    const token = getManagementToken();
    if (!token) {
      alert('Session expired. Please sign in again.');
      navigate('/management/login');
      return;
    }

    try {
      setModelBusy(true);
      const response = await axios.delete(`${API_URL}/${id}/model`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCattle(response.data);
      setShowDeleteModelOption(false);
    } catch (err) {
      console.error('Error deleting 3D model:', err);
      alert(err.response?.data?.message || 'Failed to delete 3D model.');
    } finally {
      setModelBusy(false);
    }
  };

  useEffect(() => {
    if (cattle?.model3dUrl) {
      setModelFileUrl(`${BASE_URL}${cattle.model3dUrl}`);
    } else {
      setModelFileUrl('');
    }
    setShowDeleteModelOption(false);
  }, [cattle]);

  return (
    <div className="cattle-mgmt-container">
      <header className="cattle-header">
        <button className="back-btn" onClick={() => navigate('/cattle-management')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Cattle Details</h1>
      </header>

      <main className="cattle-list-main cattle-details-main">
        {loading ? (
          <div className="loading">Loading details...</div>
        ) : error ? (
          <div className="no-data">
            <p>{error}</p>
          </div>
        ) : cattle ? (
          <section className="cattle-details-page">
            <article className="cattle-profile-panel">
              <div className="cattle-image-column">
                <div className="cattle-image-tile">
                  {cattle.imageUrl ? (
                    <img src={`${BASE_URL}${cattle.imageUrl}`} alt="Cattle" className="cattle-image-tile-img" />
                  ) : (
                    <div className="cattle-image-placeholder">
                      {cattle.tagNumber?.charAt(0) || 'C'}
                    </div>
                  )}
                  <span className="cattle-image-bars" aria-hidden="true">
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </div>
              </div>

              <div className="cattle-profile-content">
                <div className="cattle-profile-meta">
                  <span className={`cattle-profile-grade ${healthToneClass}`}>
                    {cattle.healthStatus || 'Status Pending'}
                  </span>
                </div>

                <div className="cattle-details-header-inline">
                  <div className="cattle-details-tag">{cattle.tagNumber}</div>
                </div>

                <p className="cattle-profile-subtitle">{(cattle.breed || 'Not recorded').toUpperCase()}</p>

                <dl className="cattle-details-grid-direct">
                  {detailItems.map((item) => (
                    <div key={item.label} className="cattle-detail-direct-item">
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="cattle-status-row">
                  <span className={`cattle-neon-pill ${healthToneClass}`}>
                    <span className="cattle-pill-dot"></span>
                    {cattle.healthStatus || 'Not recorded'}
                  </span>
                  <span className="cattle-neon-pill tone-cyan">
                    <span className="cattle-pill-dot"></span>
                    {cattle.gender || 'Not recorded'}
                  </span>
                </div>
              </div>
            </article>

            <aside className="cattle-model-plain">
              <div className="cattle-model-body">
                {modelFileUrl ? (
                  <div className="cattle-model-viewer-wrap">
                    <model-viewer
                      className="cattle-model-viewer"
                      src={modelFileUrl}
                      alt="Cow 3D model preview"
                      camera-controls
                      auto-rotate
                      shadow-intensity="1"
                      exposure="1"
                      interaction-prompt="none"
                      onDoubleClick={() => {
                        if (isAdmin) {
                          setShowDeleteModelOption((previous) => !previous);
                        }
                      }}
                    ></model-viewer>
                    {showDeleteModelOption && isAdmin && (
                      <button
                        type="button"
                        className="model-delete-option-btn"
                        onClick={handleDeleteModel}
                        disabled={modelBusy}
                      >
                        {modelBusy ? 'Deleting...' : 'Delete 3D Model'}
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="cattle-model-placeholder-text">
                      {isAdmin ? 'Upload a .glb file to preview on this side.' : 'No 3D model uploaded.'}
                    </p>
                    {isAdmin && (
                      <label className="cattle-model-upload">
                        <span>{modelBusy ? 'Uploading...' : 'Add 3D Model'}</span>
                        <input
                          type="file"
                          accept=".glb,.gltf"
                          onChange={handleModelFileChange}
                          disabled={modelBusy}
                        />
                      </label>
                    )}
                  </>
                )}
              </div>
            </aside>

            <div className="detail-page-actions cattle-details-actions">
              <button
                className="btn-submit-cattle"
                onClick={() =>
                  navigate('/cattle-records', {
                    state: {
                      cattleId: cattle._id,
                      tagNumber: cattle.tagNumber,
                      breed: cattle.breed,
                      age: cattle.age
                    }
                  })
                }
              >
                Add Daily Record
              </button>
              <button
                className="btn-submit-cattle detail-action-secondary"
                onClick={() => navigate(`/cattle-report/${cattle._id}`)}
              >
                View Weekly Report
              </button>
              {isAdmin && (
                <button
                  className="btn-submit-cattle detail-action-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                >
                  <Trash2 size={20} style={{ marginRight: '8px' }} />
                  {deleting ? 'Deleting...' : 'Delete Cattle Record'}
                </button>
              )}
              {isAdmin && (
                <button
                  className="btn-submit-cattle"
                  onClick={handleEditClick}
                  disabled={updating}
                  style={{ backgroundColor: '#0891b2' }}
                >
                  <Edit3 size={20} style={{ marginRight: '8px' }} />
                  {updating ? 'Updating...' : 'Edit Cattle Record'}
                </button>
              )}
            </div>
          </section>
        ) : (
          <div className="no-data">
            <p>Cattle not found.</p>
          </div>
        )}
      </main>

      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="delete-confirm-icon" style={{ color: '#ef4444', marginBottom: '20px' }}>
              <Trash2 size={48} />
            </div>
            <h2 style={{ marginBottom: '12px' }}>Delete Cattle?</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              Are you sure you want to delete cattle <strong>{cattle?.tagNumber}</strong>? This action cannot be undone.
            </p>
            <div className="form-row" style={{ gap: '12px' }}>
              <button
                className="btn-close-detail"
                style={{ marginTop: 0, flex: 1 }}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-submit-cattle"
                style={{ marginTop: 0, flex: 1, backgroundColor: '#ff3131', boxShadow: '0 0 15px rgba(255, 49, 49, 0.4)' }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Cattle Details</h2>
              <button className="close-btn" onClick={() => setShowEditForm(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="cattle-form">
              <div className="form-group">
                <label>Tag Number</label>
                <input
                  name="tagNumber"
                  value={editFormData.tagNumber}
                  onChange={handleEditChange}
                  placeholder="e.g. TX-402"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    name="breed"
                    value={editFormData.breed}
                    onChange={handleEditChange}
                    placeholder="e.g. Angus"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input
                    name="age"
                    type="number"
                    value={editFormData.age}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={editFormData.gender} onChange={handleEditChange}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Weight (Kg)</label>
                  <input
                    name="weight"
                    type="number"
                    value={editFormData.weight}
                    onChange={handleEditChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Health Status</label>
                <input
                  name="healthStatus"
                  value={editFormData.healthStatus}
                  onChange={handleEditChange}
                  placeholder="e.g. Healthy"
                />
              </div>

              <div className="form-group">
                <label>Cattle Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn-submit-cattle" disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CattleDetails;
