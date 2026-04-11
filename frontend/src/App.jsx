import React, { useState, useEffect, useCallback } from 'react';
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
import CattleDetails from './pages/CattleDetails';
import CattleRecordForm from './pages/CattleRecordForm';
import CattleReport from './pages/CattleReport';
import FeedStock from './pages/FeedStock';
import LandingPage from './pages/LandingPage';
import ManagementModule from './pages/ManagementModule';
import FarmAssets from './pages/FarmAssets';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import {
  clearManagementSession,
  clearLegacySession,
  getManagementRole,
  getManagementToken,
  getShopToken,
} from './utils/sessionStorage';

const LandingPageWithSessionReset = ({ onEnterLanding }) => {
  useEffect(() => {
    onEnterLanding();
  }, [onEnterLanding]);

  return <LandingPage />;
};

function App() {
  const [isManagementAuthenticated, setIsManagementAuthenticated] = useState(() => Boolean(getManagementToken()));
  const [managementRole, setManagementRole] = useState(() => {
    const token = getManagementToken();
    return token ? getManagementRole() : null;
  });
  const [isShopAuthenticated, setIsShopAuthenticated] = useState(() => Boolean(getShopToken()));

  const hydrateAuthState = () => {
    const managementToken = getManagementToken();
    const role = getManagementRole();
    const shopToken = getShopToken();

    setIsManagementAuthenticated(Boolean(managementToken));
    setManagementRole(managementToken ? role : null);
    setIsShopAuthenticated(Boolean(shopToken));
  };

  useEffect(() => {
    clearLegacySession();
    hydrateAuthState();
  }, []);

  const handleAuth = ({ module, role = null }) => {
    if (module === 'shop') {
      setIsShopAuthenticated(true);
      return;
    }

    if (module === 'management') {
      setIsManagementAuthenticated(true);
      setManagementRole(role);
    }
  };

  const handleLandingEntry = useCallback(() => {
    clearManagementSession();
    setIsManagementAuthenticated(false);
    setManagementRole(null);
  }, []);

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<LandingPageWithSessionReset onEnterLanding={handleLandingEntry} />} />
            <Route path="/management" element={<ManagementModule />} />
            <Route
              path="/shop"
              element={<Shop onShopLogout={() => setIsShopAuthenticated(false)} />}
            />
            <Route path="/shop/login" element={<Login setAuth={handleAuth} portal="shop" />} />
            <Route path="/shop/signup" element={<Signup portal="shop" />} />
            <Route path="/management/login" element={<Login setAuth={handleAuth} portal="management" />} />
            <Route path="/management/signup" element={<Signup portal="management" />} />
            <Route path="/login" element={<Navigate to="/shop/login" replace />} />
            <Route path="/signup" element={<Navigate to="/shop/signup" replace />} />
            <Route 
              path="/dashboard" 
              element={
                isManagementAuthenticated ? (
                  managementRole === 'admin' ? <AdminDashboard /> : <Dashboard />
                ) : (
                  <Navigate to="/management/login" />
                )
              } 
            />
            <Route 
              path="/cattle-management" 
              element={isManagementAuthenticated ? <CattleManagement /> : <Navigate to="/management/login" />} 
            />
            <Route
              path="/cattle-details/:id"
              element={isManagementAuthenticated ? <CattleDetails /> : <Navigate to="/management/login" />}
            />
            <Route 
              path="/cattle-records" 
              element={isManagementAuthenticated ? <CattleRecordForm /> : <Navigate to="/management/login" />} 
            />
            <Route 
              path="/cattle-report/:id" 
              element={isManagementAuthenticated ? <CattleReport /> : <Navigate to="/management/login" />} 
            />
            <Route 
              path="/feed-stock" 
              element={isManagementAuthenticated ? <FeedStock /> : <Navigate to="/management/login" />} 
            />
            <Route 
              path="/farm-assets" 
              element={isManagementAuthenticated ? <FarmAssets /> : <Navigate to="/management/login" />} 
            />
            <Route 
              path="/manage-ranchers" 
              element={isManagementAuthenticated && managementRole === 'admin' ? <ManageRanchers /> : <Navigate to="/management/login" />} 
            />
            <Route 
              path="/admin" 
              element={
                isManagementAuthenticated && managementRole === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/management/login" />
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
