import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import '../styles/NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, removeNotification, clearNotifications } = useAppStore();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="notification-icon success" />;
      case 'error':
        return <AlertCircle size={20} className="notification-icon error" />;
      default:
        return <Info size={20} className="notification-icon info" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="notification-overlay" onClick={onClose}></div>
      <div className="notification-dropdown">
        <div className="notification-header">
          <h3>Notifications</h3>
          {notifications.length > 0 && (
            <button className="clear-all-btn" onClick={clearNotifications}>
              Clear All
            </button>
          )}
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <Info size={48} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${notification.type}`}>
                <div className="notification-content">
                  {getIcon(notification.type)}
                  <div className="notification-text">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
                <button
                  className="notification-close"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
