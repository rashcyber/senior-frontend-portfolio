import React from 'react';
import { Shield, Edit3, Eye } from 'lucide-react';
import '../styles/RoleBadge.css';

const RoleBadge = ({ role }) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          className: 'role-badge-admin',
        };
      case 'editor':
        return {
          label: 'Editor',
          icon: Edit3,
          className: 'role-badge-editor',
        };
      default:
        return {
          label: 'Viewer',
          icon: Eye,
          className: 'role-badge-viewer',
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <span className={`role-badge ${config.className}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
};

export default RoleBadge;
