import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create an account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us today and start your journey</p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group-register">
            <label htmlFor="name">Full Name</label>
            <div className="input-container">
              <i className="icon user-icon"></i>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          
          <div className="form-group-register">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <i className="icon email-icon"></i>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group-register">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <i className="icon password-icon"></i>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="form-group-register">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <i className="icon password-icon"></i>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Creating Account...</span>
              </>
            ) : 'Create Account'}
          </button>
          
          <div className="login-link-register">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
      
      <div className="register-features">
        <div className="feature">
          <div className="feature-icon secure-icon"></div>
          <h3>Secure & Private</h3>
          <p>Your data is encrypted and never shared</p>
        </div>
        <div className="feature">
          <div className="feature-icon support-icon"></div>
          <h3>24/7 Support</h3>
          <p>Our team is always ready to help</p>
        </div>
        <div className="feature">
          <div className="feature-icon updates-icon"></div>
          <h3>Regular Updates</h3>
          <p>New features added monthly</p>
        </div>
      </div>
    </div>
  );
}

export default Register;