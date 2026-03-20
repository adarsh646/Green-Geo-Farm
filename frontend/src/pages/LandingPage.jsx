import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, ShoppingCart, ArrowRight, Zap, Droplets, Bug, Radio } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="new-landing">
      {/* Header */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo-group">
            <span className="brand-name">Green Geo Farm</span>
          </div>

          <div className="header-actions">
            <nav className="nav-menu">
              <Link to="/shop">Shop</Link>
              <div className="dropdown">
                <span className="dropdown-trigger">Our Products</span>
                <div className="dropdown-content">
                  <Link to="/management">Farm management software</Link>
                  <Link to="/sensors">Automatic Feed dispenser</Link>
                  <Link to="/sensors">Dung collector</Link>
                  <Link to="/sensors">Milking Robot</Link>
                </div>
              </div>
              <Link to="/community">Community</Link>
              <Link to="/about">About</Link>
            </nav>
            <div className="search-container">
              <Search size={18} />
              <input type="text" placeholder="Search ecosystem..." />
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
            <button className="cart-btn">
              <ShoppingCart size={18} />
              <span>Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section-new">
        <div className="hero-container">
          <div className="hero-text-content">
            <span className="subtitle">ECOSYSTEM SOLUTIONS</span>
            <h1>The Future is <span>Autonomous.</span></h1>
            <p>
              Merge biological precision with neural intelligence. Our suite of professional 
              tools transforms traditional acreage into a responsive, high-output digital greenhouse.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Deploy GeoHarvest</button>
              <button className="btn-secondary" disabled>View All Tools</button>
            </div>
          </div>
          <div className="hero-image-container">
            <img src="https://images.unsplash.com/photo-1585059895316-249051d95b81?auto=format&fit=crop&q=80&w=800" alt="Autonomous Greenhouse" />
            <div className="live-status-card">
              <div className="status-header">
                <span className="status-label">LIVE DEPLOYMENT</span>
                <h3>Project Canopy Beta</h3>
              </div>
              <div className="status-metric">
                <span className="dot"></span>
                <span>98.4% Efficiency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precision Hub */}
      <section className="precision-hub">
        <div className="section-title-group">
          <h2>Precision Hub</h2>
          <p>Integrated hardware and neural software designed to breathe with your farm.</p>
          <div className="accent-line"></div>
        </div>

        <div className="hub-grid">
          {/* Main Card: GeoHarvest Pro */}
          <div className="hub-card main-card">
            <div className="card-content">
              <div className="card-header">
                <Zap className="card-icon" />
                <span className="card-badge">FLAGSHIP NEURAL OS</span>
              </div>
              <h3>GeoHarvest Pro</h3>
              <p>The central nervous system of your operation. Real-time soil telemetry meets predictive yield modeling.</p>
              <div className="card-actions">
                <button className="btn-small-primary">Initialize Cluster</button>
                <button className="btn-text">View Technical Specs <ArrowRight size={16} /></button>
              </div>
            </div>
            <div className="card-visual">
                <div className="tablet-mockup">
                    <div className="mockup-content">
                        <div className="world-map"></div>
                    </div>
                </div>
            </div>
          </div>

          {/* Irrigation Card */}
          <div className="hub-card irrigation-card">
            <Droplets className="card-icon-large" />
            <h3>Irrigation Cloud</h3>
            <p>Autonomous hydration cycles based on atmospheric humidity and satellite imagery.</p>
            <div className="metric-box">
              <span className="metric-label">WATER SAVED (MONTH)</span>
              <span className="metric-value">142,000 Liters</span>
            </div>
          </div>

          {/* Pest Control Card */}
          <div className="hub-card pest-card">
            <Bug className="card-icon" />
            <h3>Neural Pest Control</h3>
            <p>Computer vision drones that identify and mitigate threats without chemical overspray.</p>
            <div className="drone-visual">
                <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400" alt="Agricultural Drone" />
            </div>
          </div>

          {/* Sensors Card */}
          <div className="hub-card sensors-card">
            <div className="sensors-text">
                <h3>Ground-Zero Sensors</h3>
                <p>Deploy ultra-low power LoRaWAN sensors that last 10 years on a single charge. Sub-surface moisture and pH monitoring.</p>
                <div className="sensor-metrics">
                    <div className="s-metric">
                        <span className="s-label">PRECISION</span>
                        <span className="s-value">±0.02 pH</span>
                    </div>
                    <div className="s-metric">
                        <span className="s-label">LATENCY</span>
                        <span className="s-value">12ms</span>
                    </div>
                </div>
            </div>
            <div className="sensor-visual">
                <div className="signal-waves">
                    <Radio size={40} className="radio-icon" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Section */}
      <section className="scale-section">
        <div className="scale-container">
          <span className="ready-badge">⚡ READY FOR DEPLOYMENT</span>
          <h2>Scale your ecology with <br/> <span>Green Geo.</span></h2>
          <p>Join over 4,500 modern farms using our neural grid to increase yields while reducing resource dependency. Start your transition today.</p>
          <div className="scale-buttons">
            <button className="btn-primary-large">Schedule Consultation</button>
            <button className="btn-secondary-large">Documentation</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">Green Geo Farm</span>
            <p>Pioneering the intersection of silicon and soil for a sustainable future.</p>
          </div>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/api">API Documentation</Link>
            <Link to="/support">Support</Link>
          </div>
          <div className="footer-social">
            <div className="social-icon">🌐</div>
            <div className="social-icon">🌎</div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Green Geo Farm. The Digital Greenhouse Ecosystem.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
