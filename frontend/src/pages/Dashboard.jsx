import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, User, Plus, Milk, Calendar, Package,
  Settings, BarChart3, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cattle-logo.png';
import '../Dashboard.css';
import { getManagementUsername } from '../utils/sessionStorage';

const Dashboard = () => {
  const username = getManagementUsername() || 'Rancher';
  const navigate = useNavigate();
  const [feedStockPercentage, setFeedStockPercentage] = useState(0);
  const [farmAssets, setFarmAssets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedResponse = await axios.get('http://localhost:5000/api/feed-stock');
        const feedStocks = feedResponse.data;
        if (feedStocks.length > 0) {
          const totalPercentage = feedStocks.reduce((acc, curr) => {
            const percentage = (curr.weight / curr.maxCapacity) * 100;
            return acc + percentage;
          }, 0);
          setFeedStockPercentage(Math.round(totalPercentage / feedStocks.length));
        } else {
          setFeedStockPercentage(0);
        }

        const assetsResponse = await axios.get('http://localhost:5000/api/farm-assets');
        setFarmAssets(assetsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const assetsNeedingService = farmAssets.filter(asset => {
    if (asset.status === 'Maintenance Required') return true;
    if (asset.nextServiceDate && new Date(asset.nextServiceDate) < new Date()) return true;
    return false;
  });

  const stats = [
    { label: 'Avg Milk/Cow', value: '5.2L', trend: '+3.1%' },
    { label: 'Health Alerts', value: '3', trend: 'Active', trendType: 'alert' },
    { label: 'Feed Stock', value: `${feedStockPercentage}%`, trend: feedStockPercentage > 50 ? 'Good' : 'Low', id: 'feed-stock' },
  ];

  const managementItems = [
    { title: 'Cattle', desc: 'Manage herd, health & breeding records', icon: <Plus size={24} />, color: '#e8f5e9', link: '/cattle-management' },
    { title: 'Feed Stock', desc: 'Update feed inventory', icon: <Package size={24} />, color: '#fff9c4', link: '/feed-stock' },
    { title: 'Milk Records', desc: 'Track daily production & quality', icon: <Milk size={24} />, color: '#fff3e0' },
    { title: 'Events', desc: 'Breeding, vaccination & farm tasks', icon: <Calendar size={24} />, color: '#e3f2fd' },
    { title: 'Farm Assets', desc: 'Manage workers, pens & equipment', icon: <Settings size={24} />, color: '#f3e5f5', link: '/farm-assets', alert: assetsNeedingService.length > 0 ? `${assetsNeedingService.length} Needs Service` : null },
    { title: 'Reports', desc: 'Financial & production analytics', icon: <BarChart3 size={24} />, color: '#ffebee' },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="dash-nav">
        <div className="dash-nav-left">
          <img src={logo} alt="Green Geo Farms Logo" className="dash-logo-img" />
          <span className="dash-logo">Green Geo Farms</span>
        </div>
        <div className="dash-nav-right">
          <button className="icon-btn"><Bell size={20} /></button>
          <button className="icon-btn"><User size={20} /></button>
        </div>
      </nav>

      <main className="dash-content">
        <header className="dash-header">
          <h1>Good Morning, {username} <span role="img" aria-label="cow">🐄</span></h1>
          <p>Here's your farm overview for today</p>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`stat-card ${stat.id === 'feed-stock' ? 'clickable-stat' : ''}`}
              onClick={() => stat.id === 'feed-stock' && navigate('/feed-stock')}
            >
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-trend ${stat.trendType || ''}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Management Section */}
        <section className="management-section">
          <div className="section-header">
            <h2>Management</h2>
            <button className="quick-add"><Plus size={16} /> Quick Add</button>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>{item.title}</h3>
                    {item.alert && <span className="alert-badge-tile">{item.alert}</span>}
                  </div>
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

export default Dashboard;
