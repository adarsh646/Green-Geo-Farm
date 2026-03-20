import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Menu, Heart, Plus, Grid, List, 
  Leaf, Droplet, Egg, Croissant, Thermometer, Droplets, Home, Zap, Layers, User 
} from 'lucide-react';
import './Shop.css';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { name: 'All', icon: <Leaf size={20} /> },
    { name: 'Dairy', icon: <Droplet size={20} /> },
    { name: 'Poultry', icon: <Egg size={20} /> },
    { name: 'Bakery', icon: <Croissant size={20} /> },
  ];

  const products = [
    {
      id: 1,
      name: 'A2 Fresh Milk',
      category: 'Dairy',
      price: 4.50,
      unit: '1 Litre · Pure Desi',
      image: 'https://images.unsplash.com/photo-1563636619-e910019335ca?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      name: 'Organic Eggs',
      category: 'Poultry',
      price: 6.20,
      unit: '12 pcs · Free Range',
      image: 'https://images.unsplash.com/photo-1582722872445-44c501f3c847?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      name: 'Farm Butter',
      category: 'Dairy',
      price: 3.80,
      unit: '250g · Hand Churned',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      name: 'Raw Forest Honey',
      category: 'Artisan',
      price: 12.00,
      unit: '500ml · Unprocessed',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400',
    }
  ];

  return (
    <div className="shop-page">
      {/* Top Header */}
      <header className="shop-header">
        <div className="header-content">
          <div className="left-group">
            <Menu className="menu-icon" />
            <h1 className="shop-brand">Green Geo Farm</h1>
          </div>
          <div className="cart-container">
            <ShoppingCart size={24} />
            <span className="cart-count">3</span>
          </div>
        </div>
      </header>

      <main className="shop-main">
        <div className="main-container">
          <section className="welcome-section">
            <span className="welcome-subtitle">DIGITAL GREENHOUSE</span>
            <h2 className="welcome-title">Fresh Daily Harvest</h2>
            
            <div className="shop-search-bar">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Search farm fresh products..." />
            </div>
          </section>

          {/* Categories */}
          <section className="categories-section">
            <div className="section-header">
              <h3>Categories</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="categories-list">
              {categories.map((cat) => (
                <button 
                  key={cat.name} 
                  className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Banner */}
          <section className="shop-banner">
            <div className="banner-content">
              <span className="banner-tag">LIMITED OFFER</span>
              <h3>Harvest Fresh Morning Box</h3>
              <p>Delivered within 4 hours</p>
              <button className="banner-btn">Get 20% Off</button>
            </div>
            <div className="banner-image"></div>
          </section>

          {/* Today's Picks */}
          <section className="picks-section">
            <div className="section-header">
              <h3>Today's Picks</h3>
              <div className="view-toggles">
                <button 
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className={`products-${viewMode}`}>
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                    <button className="wishlist-btn">
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="product-info">
                    <span className="product-cat">{product.category}</span>
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-unit">{product.unit}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <button className="add-to-cart-btn">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Farm Status */}
          <section className="farm-status">
            <div className="status-header">
              <h3>Farm Status</h3>
              <div className="live-badge">
                <span className="pulse"></span>
                LIVE
              </div>
            </div>
            <p className="status-desc">Live monitoring active</p>
            <div className="status-grid">
              <div className="status-tile">
                <div className="tile-icon-bg ph">
                  <Thermometer size={18} />
                </div>
                <div className="tile-info">
                  <span className="tile-label">Soil pH</span>
                  <span className="tile-value">6.8 pH</span>
                </div>
              </div>
              <div className="status-tile">
                <div className="tile-icon-bg moisture">
                  <Droplets size={18} />
                </div>
                <div className="tile-info">
                  <span className="tile-label">Moisture</span>
                  <span className="tile-value">42%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <Home size={24} />
          <span>STORE</span>
        </button>
        <button className="nav-item">
          <Zap size={24} />
          <span>AUTOMATION</span>
        </button>
        <button className="nav-item">
          <Layers size={24} />
          <span>SOLUTIONS</span>
        </button>
        <button className="nav-item">
          <User size={24} />
          <span>ACCOUNT</span>
        </button>
      </nav>
    </div>
  );
};

export default Shop;
