import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { login, register: registerUser, findUserByEmail } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!registerData.name) {
      newErrors.name = 'Name is required';
    }

    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (findUserByEmail(registerData.email)) {
      newErrors.email = 'Email already registered';
    }

    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(registerData.password)) {
      newErrors.password = 'Password must contain uppercase letter';
    } else if (!/[a-z]/.test(registerData.password)) {
      newErrors.password = 'Password must contain lowercase letter';
    } else if (!/[0-9]/.test(registerData.password)) {
      newErrors.password = 'Password must contain number';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      // Check if user exists in registered users
      const existingUser = findUserByEmail(formData.email);

      setTimeout(() => {
        if (existingUser && existingUser.password === formData.password) {
          // User exists and password matches
          login({ ...existingUser, password: undefined }, 'token-' + Date.now(), formData.password);
          setIsLoading(false);
          navigate('/dashboard');
        } else {
          // Demo login for any credentials
          const userData = {
            id: 1,
            name: 'John Doe',
            email: formData.email,
          };
          login(userData, 'demo-token-12345', formData.password);
          setIsLoading(false);
          navigate('/dashboard');
        }
      }, 1000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateRegisterForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      setTimeout(() => {
        const newUser = registerUser({
          name: registerData.name,
          email: registerData.email,
        }, registerData.password);

        login(newUser, 'token-' + Date.now(), registerData.password);
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isRegistering ? 'Sign up to get started' : 'Sign in to your account to continue'}</p>
        </div>

        {!isRegistering ? (
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '38px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              error={errors.name}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                error={errors.password}
                placeholder="Create a password (min 8 chars)"
                autoComplete="new-password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '38px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        )}

        <div className="login-footer">
          <p style={{ marginBottom: '0.5rem', cursor: 'pointer', color: '#3b82f6', fontWeight: '500' }} onClick={() => {
            setIsRegistering(!isRegistering);
            setErrors({});
            setShowPassword(false);
          }}>
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </p>
          {!isRegistering && <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Demo: any email and password (6+ chars)</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
