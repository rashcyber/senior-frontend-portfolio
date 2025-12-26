import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import NotificationDropdown from './NotificationDropdown';
import '../styles/Navbar.css';

const Navbar = () => {
  const { toggleSidebar, notifications } = useAppStore();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={24} />
        </button>
        <h1 className="navbar-title">Senior Frontend Portfolio</h1>
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper">
          <button
            className={`icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="user-menu">
          <User size={20} />
          <span className="user-name">{user?.name || 'Guest'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
