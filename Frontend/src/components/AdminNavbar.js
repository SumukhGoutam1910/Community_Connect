import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart2, Users, LogOut, Home, FileText, Calendar, CheckCircle, MessageCircle, Settings, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Toast = styled.div`
  position: fixed;
  top: 24px;
  right: 32px;
  background: #fff;
  color: #0a66c2;
  padding: 16px 28px;
  border-radius: 8px;
  box-shadow: 0 2px 12px #0a66c255;
  font-size: 1.08rem;
  font-weight: 700;
  z-index: 9999;
  opacity: 0.98;
  display: flex;
  align-items: center;
  gap: 10px;
  transform: translateX(120%);
  animation: slideIn 0.5s forwards;
  border: 2px solid #0a66c2;
  @keyframes slideIn {
    from { transform: translateX(120%); opacity: 0.2; }
    to { transform: translateX(0); opacity: 0.98; }
  }
`;


const AdminNavbarContainer = styled.header`
  background: #0a66c2;
  color: #fff;
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px #e3eaf5;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 1px;
  gap: 12px;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
  &:hover {
    color: #b3e5fc;
  }
`;


const AdminNavbar = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);
  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };
  const handleLogout = () => {
    localStorage.removeItem('ece_logged_in');
    localStorage.removeItem('ece_role');
    navigate('/');
  };
  // Handler for nav links that should show toast
  const futureHandler = e => {
    e.preventDefault();
    showToast();
  };
  return (
    <>
      {toast && (
        <Toast>
          <BarChart2 size={22} color="#0a66c2" />
          <span style={{ color: '#0a66c2', fontWeight: 700 }}>
            This functionality will be implemented in future.
          </span>
        </Toast>
      )}
      <AdminNavbarContainer>
        <Brand>
          <BarChart2 size={28} />CommunityConnect
        </Brand>
        <NavLinks>
          <NavLink onClick={futureHandler}><Home size={20} />Dashboard</NavLink>
          <NavLink onClick={futureHandler}><Users size={20} />Users</NavLink>
          <NavLink onClick={futureHandler}><FileText size={20} />Posts</NavLink>
          <NavLink onClick={futureHandler}><CheckCircle size={20} />Approvals</NavLink>
          <NavLink onClick={futureHandler}><MessageCircle size={20} />Feedback</NavLink>
          <NavLink onClick={futureHandler}><Settings size={20} />Settings</NavLink>
          <NavLink as="a" href="/" target="_blank" rel="noopener noreferrer"><Globe size={20} />Public Site</NavLink>
          <NavLink onClick={handleLogout}><LogOut size={20} />Logout</NavLink>
        </NavLinks>
      </AdminNavbarContainer>
    </>
  );
};

export default AdminNavbar;
