import React from 'react';
import AdminNavbar from './AdminNavbar';
import styled from 'styled-components';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const DashboardContainer = styled.div`
  min-height: 80vh;
  padding: 32px 32px 32px 32px;
  background: #fafdff;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #0a66c2;
  margin-bottom: 18px;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px #e3eaf5;
  padding: 28px 18px 18px 18px;
`;

const AdminDashboard = () => {
  // Dummy analytics data
  const userGrowth = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'User Growth',
      data: [12, 19, 25, 32, 40, 55, 70],
      backgroundColor: '#0a66c2',
      borderRadius: 6,
    }]
  };
  const postStats = {
    labels: ['Posts', 'Events', 'Comments', 'Likes'],
    datasets: [{
      label: 'Content Stats',
      data: [120, 45, 300, 900],
      backgroundColor: ['#0a66c2', '#1976d2', '#64b5f6', '#b3e5fc'],
    }]
  };
  const engagement = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Engagement',
      data: [80, 90, 70, 100, 120, 60, 40],
      fill: false,
      borderColor: '#0a66c2',
      tension: 0.4,
    }]
  };
  // New: User Demographics
  const demographics = {
    labels: ['Students', 'Faculty', 'Alumni', 'Industry'],
    datasets: [{
      label: 'User Demographics',
      data: [60, 15, 20, 5],
      backgroundColor: ['#0a66c2', '#1976d2', '#64b5f6', '#b3e5fc'],
    }]
  };
  // New: Post Trends
  const postTrends = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Posts per Week',
      data: [30, 45, 38, 50],
      backgroundColor: '#1976d2',
      borderColor: '#0a66c2',
      fill: false,
      tension: 0.4,
    }]
  };
  // New: Top Users
  const topUsers = [
    { name: 'Alice', posts: 22, likes: 120 },
    { name: 'Bob', posts: 18, likes: 98 },
    { name: 'Carol', posts: 15, likes: 80 },
  ];

  // Dummy data for new sections
  const recentActivity = [
    { type: 'Post', user: 'Alice', action: 'created a post', time: '2 min ago' },
    { type: 'Event', user: 'Bob', action: 'added an event', time: '10 min ago' },
    { type: 'User', user: 'Carol', action: 'registered', time: '30 min ago' },
    { type: 'Post', user: 'Dave', action: 'deleted a post', time: '1 hr ago' },
  ];
  const pendingApprovals = [
    { type: 'Post', title: 'Industry Visit Recap', by: 'Eve' },
    { type: 'Event', title: 'Alumni Meet', by: 'Frank' },
  ];
  const feedbackSummary = [
    { user: 'Grace', message: 'Great platform!', time: 'Today' },
    { user: 'Heidi', message: 'Add more event filters.', time: 'Yesterday' },
  ];
  const systemStatus = [
    { service: 'API', status: 'Online', color: '#388e3c' },
    { service: 'Database', status: 'Online', color: '#388e3c' },
    { service: 'Email', status: 'Degraded', color: '#fbc02d' },
  ];

  return (
    <>
      <AdminNavbar />
      <DashboardContainer>
        <Title>Admin Analytics Dashboard</Title>
        <ChartGrid>
          {/* Analytics Cards */}
          <Card>
            <h3>User Growth</h3>
            <Bar data={userGrowth} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </Card>
          <Card>
            <h3>Content Stats</h3>
            <Pie data={postStats} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </Card>
          <Card>
            <h3>Weekly Engagement</h3>
            <Line data={engagement} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </Card>
          <Card>
            <h3>User Demographics</h3>
            <Pie data={demographics} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </Card>
          <Card>
            <h3>Post Trends</h3>
            <Line data={postTrends} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </Card>
          <Card>
            <h3>Top Users</h3>
            <div style={{ padding: '8px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead>
                  <tr style={{ color: '#0a66c2', fontWeight: 700 }}>
                    <td>Name</td><td>Posts</td><td>Likes</td>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map(u => (
                    <tr key={u.name}>
                      <td>{u.name}</td><td>{u.posts}</td><td>{u.likes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {/* New Variety Cards */}
          <Card>
            <h3>Recent Activity</h3>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {recentActivity.map((a, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <b>{a.user}</b> {a.action} <span style={{ color: '#888', fontSize: 13 }}>({a.time})</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3>Pending Approvals</h3>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {pendingApprovals.length === 0 ? <li>None</li> : pendingApprovals.map((p, i) => (
                <li key={i}>
                  <b>{p.type}:</b> {p.title} <span style={{ color: '#888', fontSize: 13 }}>by {p.by}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3>Feedback Summary</h3>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {feedbackSummary.length === 0 ? <li>No feedback yet</li> : feedbackSummary.map((f, i) => (
                <li key={i}>
                  <b>{f.user}:</b> {f.message} <span style={{ color: '#888', fontSize: 13 }}>({f.time})</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3>System Status</h3>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {systemStatus.map((s, i) => (
                <li key={i}>
                  <b>{s.service}:</b> <span style={{ color: s.color }}>{s.status}</span>
                </li>
              ))}
            </ul>
          </Card>
        </ChartGrid>
      </DashboardContainer>
    </>
  );
};

export default AdminDashboard;
