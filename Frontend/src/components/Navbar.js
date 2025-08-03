import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Bell, 
  User,
  Search,
  Grid3X3
} from 'lucide-react';
import axios from 'axios';


const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check backend session for login state
    axios.get('http://localhost:3001/api/user', { withCredentials: true })
      .then(res => setIsLoggedIn(!!res.data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      // Call backend logout
      await axios.post('http://localhost:3001/api/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  // Intercept protected navs
  const handleProtectedNav = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <Header>
      <Container>
        <LeftSection>
          <LogoSection>
            <LogoImg src="/ECE_logo/Logo.jpg" alt="Logo" />
            <BrandText>CommunityConnect</BrandText>
            <SearchContainer>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput 
                type="text" 
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </SearchContainer>
          </LogoSection>
        </LeftSection>

        <Nav>
          <NavItem to="/">
            <Home size={24} />
            <NavLabel>Home</NavLabel>
          </NavItem>
          
          <NavItem to="/network" onClick={e => handleProtectedNav(e, '/network')}>
            <Users size={24} />
            <NavLabel>My Network</NavLabel>
          </NavItem>
          
          <NavItem to="/jobs">
            <Briefcase size={24} />
            <NavLabel>Jobs</NavLabel>
          </NavItem>
          
          <NavItem to="/messaging" onClick={e => handleProtectedNav(e, '/messaging')}>
            <MessageCircle size={24} />
            <NavLabel>Messaging</NavLabel>
          </NavItem>
          
          <NavItem to="/notifications" onClick={e => handleProtectedNav(e, '/notifications')}>
            <Bell size={24} />
            <NavLabel>Notifications</NavLabel>
          </NavItem>
          
          <NavItem to="/profile" onClick={e => handleProtectedNav(e, '/profile')}>
            <User size={24} />
            <NavLabel>Me</NavLabel>
          </NavItem>

          <Divider />
          
          <DropdownItem>
            <Grid3X3 size={24} />
            <NavLabel>For Business</NavLabel>
          </DropdownItem>
          <LoginButton onClick={handleLoginLogout}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </LoginButton>
        </Nav>
      </Container>
    </Header>
  );
};

export default Navbar;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.2);
`;

const LoginButton = styled.button`
  background: #0a66c2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 22px;
  font-size: 15px;
  font-weight: 700;
  margin-left: 18px;
  cursor: pointer;
  box-shadow: 0 1px 3px #e3eaf5;
  transition: background 0.2s;
  &:hover {
    background: #004182;
  }
`;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BrandText = styled.span`
  font-size: 1.25rem; 
  font-weight: 800;
  color: #0a66c2;
  margin-left: 14px;
  letter-spacing: 1px;
  @media (max-width: 600px) {
    display: none;
  }
`;

const LogoImg = styled.img`
  height: 34px;
  width: 34px;
  border-radius: 4px;
  object-fit: cover;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: 25px;
  left: 15%;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const SearchInput = styled.input`
  background: #eef3f8;
  border: none;
  border-radius: 4px;
  padding: 7px 8px 7px 32px;
  width: 280px;
  font-size: 14px;
  color: #000;
  
  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 0 0 1px #0a66c2;
  }

  &::placeholder {
    color: #666;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  text-decoration: none;
  padding: 6px 0;
  transition: color 0.15s ease;
  position: relative;
  
  &:hover {
    color: #000;
  }

  &.active {
    color: #0a66c2;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 2px;
      background: #0a66c2;
    }
  }
`;

const NavLabel = styled.span`
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 1.25;
`;

const Divider = styled.div`
  height: 32px;
  width: 1px;
  background: #e0e0e0;
`;

const DropdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.15s ease;
  
  &:hover {
    color: #000;
  }
`;