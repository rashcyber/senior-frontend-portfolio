import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Edit3, Eye } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import RoleBadge from '../components/RoleBadge';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { showToast } from '../store/useToastStore';
import '../styles/Settings.css';

const Settings = () => {
  const { user, updateUser, verifyPassword, updatePassword, userRole, setUserRole } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFACode, setTwoFACode] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Generate a secret key for 2FA (in real app, this comes from backend)
  const twoFASecret = 'JBSWY3DPEHPK3PXP'; // Example secret
  const twoFAUri = `otpauth://totp/SeniorPortfolio:${user?.email || 'user@example.com'}?secret=${twoFASecret}&issuer=SeniorPortfolio`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      updateUser(formData);
      setIsSaving(false);
      showToast.success('Settings saved successfully!');
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = {};

    // Check if current password is provided
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    } else if (!verifyPassword(passwordData.currentPassword)) {
      errors.currentPassword = 'Current password is incorrect';
    }

    // Check if new password is provided
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      // Password strength validation
      if (passwordData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(passwordData.newPassword)) {
        errors.newPassword = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(passwordData.newPassword)) {
        errors.newPassword = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(passwordData.newPassword)) {
        errors.newPassword = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*]/.test(passwordData.newPassword)) {
        errors.newPassword = 'Password must contain at least one special character (!@#$%^&*)';
      }
    }

    // Check if new password and current password are the same
    if (passwordData.newPassword && passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    // Check if confirm password matches
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Validate password
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);

    // Simulate API call and update password
    setTimeout(() => {
      updatePassword(passwordData.newPassword);
      showToast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      setIsChangingPassword(false);
    }, 1500);
  };

  const handleEnable2FA = (e) => {
    e.preventDefault();

    if (twoFACode.length !== 6) {
      showToast.error('Please enter a valid 6-digit code!');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      showToast.success('Two-Factor Authentication enabled successfully!');
      setShow2FAModal(false);
      setTwoFACode('');
    }, 1000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-grid">
        <Card title="Profile Information" subtitle="Update your personal details">
          <form onSubmit={handleSubmit} className="settings-form">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>

        <Card title="Appearance" subtitle="Customize your interface">
          <div className="theme-selector">
            <p className="theme-label">Theme</p>
            <div className="theme-options">
              <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
            </div>
          </div>
        </Card>

        <Card title="Notifications" subtitle="Manage notification preferences">
          <div className="notification-settings">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Email notifications</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Push notifications</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>SMS notifications</span>
            </label>
          </div>
        </Card>

        <Card title="User Role & Permissions" subtitle="Manage access level (Demo Mode)">
          <div className="role-selector">
            <div style={{ marginBottom: '1rem' }}>
              <p className="theme-label" style={{ marginBottom: '0.5rem' }}>
                Current Role: <RoleBadge role={userRole} />
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem 0' }}>
                Select a role to test different permission levels
              </p>
            </div>
            <div className="theme-options">
              <button
                className={`theme-option ${userRole === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('admin');
                  showToast.success('Role changed to Admin - Full access granted');
                }}
              >
                <Shield size={16} /> Admin
              </button>
              <button
                className={`theme-option ${userRole === 'editor' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('editor');
                  showToast.info('Role changed to Editor - Can create and edit');
                }}
              >
                <Edit3 size={16} /> Editor
              </button>
              <button
                className={`theme-option ${userRole === 'viewer' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('viewer');
                  showToast.warning('Role changed to Viewer - Read-only access');
                }}
              >
                <Eye size={16} /> Viewer
              </button>
            </div>
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.375rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                <strong>Permissions:</strong><br />
                <strong>Admin:</strong> Create, Read, Update, Delete, Manage Users<br />
                <strong>Editor:</strong> Create, Read, Update<br />
                <strong>Viewer:</strong> Read only
              </p>
            </div>
          </div>
        </Card>

        <Card title="Security" subtitle="Password and authentication">
          <div className="security-section">
            <Button
              variant="secondary"
              onClick={() => {
                console.log('Change Password clicked');
                setShowPasswordModal(true);
              }}
            >
              Change Password
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                console.log('Enable 2FA clicked');
                setShow2FAModal(true);
              }}
            >
              Enable 2FA
            </Button>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        title="Change Password"
        onClose={() => setShowPasswordModal(false)}
        size="medium"
      >
          <form onSubmit={handleChangePassword} className="settings-form">
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                Password Requirements:
              </p>
              <ul style={{ margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li>At least 8 characters long</li>
                <li>Contains uppercase letter (A-Z)</li>
                <li>Contains lowercase letter (a-z)</li>
                <li>Contains number (0-9)</li>
                <li>Contains special character (!@#$%^&*)</li>
              </ul>
            </div>

            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              error={passwordErrors.currentPassword}
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              error={passwordErrors.newPassword}
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              error={passwordErrors.confirmPassword}
            />

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Modal>

      {/* Enable 2FA Modal */}
      <Modal
        isOpen={show2FAModal}
        title="Enable Two-Factor Authentication"
        onClose={() => setShow2FAModal(false)}
        size="medium"
      >
          <form onSubmit={handleEnable2FA} className="settings-form">
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', textAlign: 'center' }}>
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '0.5rem',
                  border: '2px solid var(--border-color)',
                  width: 'fit-content',
                }}
              >
                <QRCodeSVG
                  value={twoFAUri}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p style={{
                margin: '1rem 0 0 0',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textAlign: 'center'
              }}>
                Or enter this code manually:
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '2px'
              }}>
                {twoFASecret}
              </p>
            </div>

            <Input
              label="Verification Code"
              type="text"
              name="twoFACode"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShow2FAModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Enable 2FA
              </Button>
            </div>
          </form>
        </Modal>
    </div>
  );
};

export default Settings;
