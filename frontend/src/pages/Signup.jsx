import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/cattle-logo.png';
import '../Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const { username, email, password } = formData;
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="Green Geo Farms Logo" className="auth-logo" />
          <h1 className="auth-title">Create Account</h1>
        </div>
        <p className="auth-subtitle">Join Green Geo Farms to start managing your herd</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input 
                name="username" 
                placeholder="johndoe" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                name="email" 
                type="email" 
                placeholder="rancher@example.com" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="........" 
                onChange={handleChange} 
                required 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                name="confirmPassword" 
                type={showPassword ? "text" : "password"} 
                placeholder="........" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-auth">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="footer-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
