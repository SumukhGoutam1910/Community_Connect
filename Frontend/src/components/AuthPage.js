import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';


const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin: 14px 0 0 0;
  color: #0a66c2;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #004182;
  }
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
`;

const AuthCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(10,102,194,0.18);
  padding: 0px 38px 36px 38px;
  min-width: 370px;
  max-width: 95vw;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.1rem;
  font-weight: 800;
  color: #0a66c2;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 28px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: #f3f6f9;
  border-radius: 8px;
  margin-bottom: 18px;
  padding: 0 12px;
  border: 1.5px solid #e0e0e0;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 10px;
  font-size: 1.1rem;
  outline: none;
  color: #222;
`;

const AuthButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #0a66c2 60%, #004182 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  padding: 13px 0;
  margin-top: 10px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px #e3eaf5;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #004182 60%, #0a66c2 100%);
  }
`;

const SwitchText = styled.p`
  text-align: center;
  color: #666;
  margin-top: 18px;
  font-size: 1rem;
`;

const SwitchLink = styled.span`
  color: #0a66c2;
  font-weight: 700;
  cursor: pointer;
  margin-left: 6px;
  &:hover {
    text-decoration: underline;
  }
`;

const GoogleBar = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 1px 3px #e3eaf5;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 18px 0 8px 0;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #f3f6f9;
    border-color: #0a66c2;
  }
`;

const AnimatedWave = styled.div`
  position: absolute;
  left: -60px;
  bottom: -60px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle at 60% 40%, #0a66c2 0%, #004182 100%);
  opacity: 0.13;
  border-radius: 50%;
  z-index: 0;
  animation: wave 6s infinite linear alternate;
  @keyframes wave {
    0% { transform: scale(1) translateY(0); }
    100% { transform: scale(1.15) translateY(18px); }
  }
`;

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (mode === 'register') {
      if (!form.name || !form.email || !form.password || !form.confirm) {
        setError('Please fill all fields.');
        return;
      }
      if (form.password !== form.confirm) {
        setError('Passwords do not match.');
        return;
      }
      try {
        await axios.post('http://localhost:3001/api/register', {
          username: form.email.split('@')[0],
          name: form.name,
          email: form.email,
          password: form.password
        }, { withCredentials: true });
        setSuccess('Registration successful! You can now log in.');
        setMode('login');
        setForm({ name: '', email: '', password: '', confirm: '' });
      } catch (err) {
        setError(err.response?.data?.error || 'Registration failed.');
      }
    } else {
      if (!form.email || !form.password) {
        setError('Please enter email and password.');
        return;
      }
      try {
        const res = await axios.post('http://localhost:3001/api/login', {
          email: form.email,
          password: form.password
        }, { withCredentials: true });
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/profile');
        }, 900);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid credentials.');
      }
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AnimatedWave />
        <Title>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</Title>
        <Subtitle>{mode === 'login' ? 'Login to your CommunityConnect account' : 'Register to join the ECE CommunityConnect'}</Subtitle>
        {/* Sample credentials info */}
        {mode === 'login' && (
          <div style={{ background: '#f3f6f9', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '12px 18px', marginBottom: 18, fontSize: 15 }}>
            <b>Sample Accounts:</b><br />
            <span style={{ color: '#0a66c2' }}>User:</span> user@ece.com / user123<br />
            <span style={{ color: '#0a66c2' }}>Admin:</span> admin@ece.com / admin123
          </div>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          {mode === 'register' && (
            <InputGroup>
              <FiUser style={{ marginRight: 8, color: '#0a66c2' }} />
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                autoFocus
              />
            </InputGroup>
          )}
          <InputGroup>
            <FiMail style={{ marginRight: 8, color: '#0a66c2' }} />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              autoFocus={mode === 'login'}
            />
          </InputGroup>
          <InputGroup>
            <FiLock style={{ marginRight: 8, color: '#0a66c2' }} />
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <span style={{ cursor: 'pointer' }} onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </InputGroup>
          {mode === 'register' && (
            <InputGroup>
              <FiLock style={{ marginRight: 8, color: '#0a66c2' }} />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirm"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
              />
            </InputGroup>
          )}
          {error && <div style={{ color: '#e53935', marginBottom: 8, fontWeight: 600 }}>{error}</div>}
          {success && <div style={{ color: '#388e3c', marginBottom: 8, fontWeight: 600 }}>{success}</div>}
          <AuthButton type="submit">{mode === 'login' ? 'Login' : 'Register'}</AuthButton>
        </form>
        <GoogleBar title="Login with Google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          Continue with Google
        </GoogleBar>
        <SwitchText>
          {mode === 'login' ? (
            <>
              New here?
              <SwitchLink onClick={() => { setMode('register'); setError(''); setSuccess(''); }}>
                Register <FiArrowRight style={{ verticalAlign: 'middle' }} />
              </SwitchLink>
            </>
          ) : (
            <>
              Already have an account?
              <SwitchLink onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>
                <FiArrowLeft style={{ verticalAlign: 'middle' }} /> Login
              </SwitchLink>
            </>
          )}
        </SwitchText>
        <HomeLink to="/">
          <FiArrowLeft style={{ marginRight: 4, fontSize: '1.1em' }} /> Back to Home
        </HomeLink>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;
