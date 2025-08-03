import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Bell, Users, Briefcase, MessageSquare, Calendar, Award, Settings } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'connection',
      icon: <Users size={20} />,
      title: 'Dr. Sarah Johnson accepted your connection request',
      description: 'You are now connected with Dr. Sarah Johnson',
      time: '2 hours ago',
      unread: true,
      avatar: '/ECE_logo/Logo.jpg'
    },
    {
      id: 2,
      type: 'job',
      icon: <Briefcase size={20} />,
      title: 'New job opportunity: Senior VLSI Engineer',
      description: 'Intel Corporation posted a job that matches your profile',
      time: '4 hours ago',
      unread: true,
      avatar: '/ECE_logo/Logo.jpg'
    },
    {
      id: 3,
      type: 'message',
      icon: <MessageSquare size={20} />,
      title: 'Message from ECE Study Group',
      description: 'Alex Rodriguez: "Don\'t forget about tomorrow\'s lab session"',
      time: '6 hours ago',
      unread: false,
      avatar: '/ECE_logo/Logo.jpg'
    },
    {
      id: 4,
      type: 'event',
      icon: <Calendar size={20} />,
      title: 'Upcoming event: IEEE Conference on Electronics',
      description: 'Conference starts in 3 days - March 15, 2024',
      time: '1 day ago',
      unread: false,
      avatar: '/ECE_logo/Logo.jpg'
    },
    {
      id: 5,
      type: 'achievement',
      icon: <Award size={20} />,
      title: 'Congratulations! Profile views increased by 40%',
      description: 'Your profile was viewed 28 times this week',
      time: '2 days ago',
      unread: false,
      avatar: '/ECE_logo/Logo.jpg'
    },
    {
      id: 6,
      type: 'connection',
      icon: <Users size={20} />,
      title: 'Prof. Mark Wilson viewed your profile',
      description: 'Communication Systems Expert at IIT Delhi',
      time: '3 days ago',
      unread: false,
      avatar: '/ECE_logo/Logo.jpg'
    },
    {
      id: 7,
      type: 'job',
      icon: <Briefcase size={20} />,
      title: 'Application status update',
      description: 'Your application for Electronics Engineer at Qualcomm is under review',
      time: '1 week ago',
      unread: false,
      avatar: '/ECE_logo/Logo.jpg'
    }
  ];

  const categories = [
    { name: 'All', count: notifications.length, active: true },
    { name: 'Connections', count: 3, active: false },
    { name: 'Jobs', count: 2, active: false },
    { name: 'Messages', count: 1, active: false },
    { name: 'Events', count: 1, active: false }
  ];

  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Notifications</Title>
          <HeaderActions>
            <MarkAllRead>Mark all as read</MarkAllRead>
            <SettingsButton>
              <Settings size={20} />
              Settings
            </SettingsButton>
          </HeaderActions>
        </Header>

        <NotificationsGrid>
          <LeftColumn>
            <FilterCard>
              <FilterTitle>Categories</FilterTitle>
              {categories.map((category, index) => (
                <FilterItem key={index} active={category.active}>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryCount>{category.count}</CategoryCount>
                </FilterItem>
              ))}
            </FilterCard>
          </LeftColumn>

          <CenterColumn>
            <NotificationsList>
              {notifications.map(notification => (
                <NotificationItem key={notification.id} unread={notification.unread}>
                  <NotificationIcon type={notification.type}>
                    {notification.icon}
                  </NotificationIcon>
                  
                  <NotificationContent>
                    <NotificationHeader>
                      <NotificationTitle>{notification.title}</NotificationTitle>
                      <NotificationTime>{notification.time}</NotificationTime>
                    </NotificationHeader>
                    <NotificationDescription>
                      {notification.description}
                    </NotificationDescription>
                  </NotificationContent>
                  
                  <NotificationAvatar>
                    <Avatar src={notification.avatar} alt="" />
                    {notification.unread && <UnreadDot />}
                  </NotificationAvatar>
                </NotificationItem>
              ))}
            </NotificationsList>
          </CenterColumn>

          <RightColumn>
            <QuickActionsCard>
              <QuickActionsTitle>Quick Actions</QuickActionsTitle>
              
              <QuickAction>
                <ActionIcon>
                  <Bell size={20} />
                </ActionIcon>
                <ActionText>
                  <ActionTitle>Notification settings</ActionTitle>
                  <ActionDescription>Manage your notification preferences</ActionDescription>
                </ActionText>
              </QuickAction>
              
              <QuickAction>
                <ActionIcon>
                  <Users size={20} />
                </ActionIcon>
                <ActionText>
                  <ActionTitle>Connection requests</ActionTitle>
                  <ActionDescription>View pending connection requests</ActionDescription>
                </ActionText>
              </QuickAction>
              
              <QuickAction>
                <ActionIcon>
                  <MessageSquare size={20} />
                </ActionIcon>
                <ActionText>
                  <ActionTitle>Message requests</ActionTitle>
                  <ActionDescription>Check new message requests</ActionDescription>
                </ActionText>
              </QuickAction>
            </QuickActionsCard>

            <TrendingCard>
              <TrendingTitle>Trending in ECE</TrendingTitle>
              
              <TrendingItem>
                <TrendingTag>#VLSIDesign</TrendingTag>
                <TrendingCount>234 posts this week</TrendingCount>
              </TrendingItem>
              
              <TrendingItem>
                <TrendingTag>#5GTechnology</TrendingTag>
                <TrendingCount>156 posts this week</TrendingCount>
              </TrendingItem>
              
              <TrendingItem>
                <TrendingTag>#SignalProcessing</TrendingTag>
                <TrendingCount>89 posts this week</TrendingCount>
              </TrendingItem>
              
              <TrendingItem>
                <TrendingTag>#EmbeddedSystems</TrendingTag>
                <TrendingCount>67 posts this week</TrendingCount>
              </TrendingItem>
            </TrendingCard>
          </RightColumn>
        </NotificationsGrid>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #f3f2ef;
`;

const MainContent = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding-top: 72px;
  padding-left: 24px;
  padding-right: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  color: #000;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: #0a66c2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    background: #f3f2ef;
  }
`;

const NotificationsGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 24px;
`;

const LeftColumn = styled.div``;

const CenterColumn = styled.div``;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
`;

const FilterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.active ? '#f0f7ff' : 'transparent'};
  
  &:hover {
    background: #f3f2ef;
  }
`;

const CategoryName = styled.div`
  font-size: 14px;
  color: #000;
  font-weight: ${props => props.active ? '600' : '400'};
`;

const CategoryCount = styled.div`
  font-size: 12px;
  color: #666;
  background: #f3f2ef;
  padding: 2px 6px;
  border-radius: 10px;
`;

const NotificationsList = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  background: ${props => props.unread ? '#f9fafb' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f3f2ef;
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => {
    switch(props.type) {
      case 'connection': return '#e7f3ff';
      case 'job': return '#fff2e5';
      case 'message': return '#f0f9ff';
      case 'event': return '#f5f3ff';
      case 'achievement': return '#ecfdf5';
      default: return '#f3f2ef';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'connection': return '#0a66c2';
      case 'job': return '#ff6b35';
      case 'message': return '#0ea5e9';
      case 'event': return '#8b5cf6';
      case 'achievement': return '#10b981';
      default: return '#666';
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
  line-height: 1.3;
  flex: 1;
  margin-right: 8px;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #666;
  white-space: nowrap;
`;

const NotificationDescription = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.4;
`;

const NotificationAvatar = styled.div`
  position: relative;
  margin-left: 12px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #0a66c2;
  border: 2px solid white;
  border-radius: 50%;
`;

const QuickActionsCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const QuickActionsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
`;

const QuickAction = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
  
  &:hover {
    background: #f3f2ef;
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const ActionIcon = styled.div`
  color: #666;
`;

const ActionText = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
`;

const ActionDescription = styled.div`
  font-size: 12px;
  color: #666;
`;

const TrendingCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const TrendingTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
`;

const TrendingItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TrendingTag = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0a66c2;
  margin-bottom: 2px;
`;

const TrendingCount = styled.div`
  font-size: 12px;
  color: #666;
`;

export default Notifications;
