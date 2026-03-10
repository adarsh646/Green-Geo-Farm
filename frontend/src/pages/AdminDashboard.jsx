import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, User, Users, Activity, 
  TrendingUp, Search, MoreVertical, Plus, Milk, Calendar, Settings, BarChart3, ChevronRight
} from 'lucide-react';
import '../AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dbRanchers, setDbRanchers] = useState([]);
  const [dbCattle, setDbCattle] = useState([]);
  const [loading, setLoading] = useState(true);

  const RANCHERS_API = 'http://localhost:5000/api/users/ranchers';
  const CATTLE_API = 'http://localhost:5000/api/cattle';

  const fetchData = async () => {
    try {
      const [ranchersRes, cattleRes] = await Promise.all([
        axios.get(RANCHERS_API),
        axios.get(CATTLE_API)
      ]);
      setDbRanchers(ranchersRes.data);
      setDbCattle(cattleRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Ranchers', value: dbRanchers.length.toString(), trend: '+12%', icon: <Users size={20} />, id: 'rancher-mgmt' },
    { label: 'Total Cattle', value: dbCattle.length.toString(), trend: '+5.4%', icon: <Activity size={20} /> },
    { label: 'Avg Milk/Cow', value: '5.2L', trend: '+3.1%' },
    { label: 'System Health', value: '99.9%', trend: 'Stable', icon: <TrendingUp size={20} /> },
    { label: 'Revenue', value: '$12.4K', trend: '+8.2%', icon: <BarChart3 size={20} /> },
    { label: 'Feed Stock', value: '78%', trend: 'Good', icon: <Activity size={20} /> },
  ];

  const managementItems = [
    { title: 'Manage Ranchers', desc: 'View, edit & delete rancher accounts', icon: <Users size={24} />, color: '#f3e5f5', link: '/manage-ranchers' },
    { title: 'CattleManage', desc: 'herd, health & breeding records', icon: <Plus size={24} />, color: '#e8f5e9', link: '/cattle-management' },
    { title: 'Milk Analytics', desc: 'Global production & quality trends', icon: <Milk size={24} />, color: '#fff3e0' },
    { title: 'Global Events', desc: 'System-wide vaccinations & tasks', icon: <Calendar size={24} />, color: '#e3f2fd' },
    { title: 'System Reports', desc: 'Financial & production analytics', icon: <BarChart3 size={24} />, color: '#ffebee' },
  ];

  return (
    <div className="admin-container">
      {/* Admin Nav */}
      <nav className="admin-nav">
        <div className="admin-nav-left">
          <span className="admin-logo" onClick={() => navigate('/dashboard')}>Admin Console</span>
        </div>
        <div className="admin-nav-right">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search ranchers..." />
          </div>
          <button className="icon-btn"><Bell size={20} /></button>
          <button className="icon-btn"><User size={20} /></button>
        </div>
      </nav>

      <main className="admin-content">
        <header className="admin-header">
          <h1>Admin Overview <span role="img" aria-label="shield">🛡️</span></h1>
          <p>Monitor and manage all farm accounts and system data</p>
        </header>

        {/* Global Stats */}
        <div className="admin-stats">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`admin-stat-card ${stat.id === 'rancher-mgmt' ? 'clickable-stat' : ''}`}
              onClick={() => stat.id === 'rancher-mgmt' && navigate('/manage-ranchers')}
            >
              <div className="stat-icon-bg">{stat.icon || <Activity size={20} />}</div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
              <span className="stat-trend"> {stat.trend}</span>
            </div>
          ))}
        </div>

        {/* Management Section (Replicating Rancher Dashboard Style) */}
        <section className="management-section">
          <div className="section-header">
            <h2>System Management</h2>
          </div>
          
          <div className="management-grid">
            {managementItems.map((item, i) => (
              <div 
                key={i} 
                className="manage-tile" 
                onClick={() => item.link ? navigate(item.link) : null}
              >
                <div className="manage-icon" style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <div className="manage-text">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <ChevronRight className="chevron" size={20} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
