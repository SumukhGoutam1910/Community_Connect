import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import HomePage from './components/HomePage';
import './App.css';
import Network from './components/Network';
import Jobs from './components/Jobs';
import Messaging from './components/Messaging';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Footer from './components/Footer';
import PostPage from './components/PostPage';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Feed and TestFeed routes removed */}
          <Route path="/network" element={<Network />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
        <Footer />
      </Router>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background: #f3f2ef;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

export default App;
