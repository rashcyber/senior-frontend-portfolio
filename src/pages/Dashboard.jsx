import React from 'react';
import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import Card from '../components/Card';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { data: users, loading } = useFetch('/users');

  const stats = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: '#3b82f6',
      change: '+12%',
    },
    {
      title: 'Revenue',
      value: '$45,231',
      icon: DollarSign,
      color: '#10b981',
      change: '+8.2%',
    },
    {
      title: 'Sales',
      value: '2,456',
      icon: ShoppingCart,
      color: '#f59e0b',
      change: '+23%',
    },
    {
      title: 'Growth',
      value: '48.6%',
      icon: TrendingUp,
      color: '#8b5cf6',
      change: '+4.3%',
    },
  ];

  if (loading) {
    return <Loading fullscreen />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your app today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="stat-info">
                <p className="stat-label">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-change positive">{stat.change} from last month</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="Recent Activity" className="activity-card">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div>
                <p className="activity-text">New user registered</p>
                <span className="activity-time">2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div>
                <p className="activity-text">Order #1234 completed</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div>
                <p className="activity-text">Payment received</p>
                <span className="activity-time">3 hours ago</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Stats" className="quick-stats-card">
          <div className="quick-stat">
            <span>Active Sessions</span>
            <strong>1,234</strong>
          </div>
          <div className="quick-stat">
            <span>Avg. Session Duration</span>
            <strong>4m 32s</strong>
          </div>
          <div className="quick-stat">
            <span>Bounce Rate</span>
            <strong>32.4%</strong>
          </div>
          <div className="quick-stat">
            <span>Conversion Rate</span>
            <strong>12.8%</strong>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
