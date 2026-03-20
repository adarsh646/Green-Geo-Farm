import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './LandingPage.css';
import './Dashboard.css';
import './AdminDashboard.css';
import './CattleManagement.css';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageRanchers from './pages/ManageRanchers';
import CattleManagement from './pages/CattleManagement';
import CattleRecordForm from './pages/CattleRecordForm';
import CattleReport from './pages/CattleReport';
import FeedStock from './pages/FeedStock';
import LandingPage from './pages/LandingPage';
import ManagementModule from './pages/ManagementModule';
import FarmAssets from './pages/FarmAssets';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleAuth = (authStatus, role = null) => {
    setIsAuthenticated(authStatus);
    if (role) setUserRole(role);
    else if (!authStatus) setUserRole(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      handleAuth(true, role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    handleAuth(false);
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/management" element={<ManagementModule />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login setAuth={handleAuth} />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  userRole === 'admin' ? <AdminDashboard /> : <Dashboard />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/cattle-management" 
              element={isAuthenticated ? <CattleManagement /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cattle-records" 
              element={isAuthenticated ? <CattleRecordForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cattle-report/:id" 
              element={isAuthenticated ? <CattleReport /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/feed-stock" 
              element={isAuthenticated ? <FeedStock /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/farm-assets" 
              element={isAuthenticated ? <FarmAssets /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/manage-ranchers" 
              element={isAuthenticated && userRole === 'admin' ? <ManageRanchers /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated && userRole === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
