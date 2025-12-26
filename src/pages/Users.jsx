import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserPlus, Mail, Phone, CheckCircle, Edit2, Trash2, Globe, Filter as FilterIcon } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import AddUserForm from '../components/AddUserForm';
import FilterPanel from '../components/FilterPanel';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import { showToast } from '../store/useToastStore';
import '../styles/Users.css';

const STORAGE_KEY = 'local_users';

const Users = () => {
  const { data: users, loading, error } = useFetch('/users');
  const [searchTerm, setSearchTerm] = useState('');
  const [localUsers, setLocalUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
  });
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { addNotification } = useAppStore();
  const { canCreate, canUpdate, canDelete } = useAuthStore();

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem(STORAGE_KEY);
    if (savedUsers) {
      try {
        setLocalUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error('Error loading saved users:', e);
      }
    }
  }, []);

  // Save users to localStorage whenever localUsers changes
  useEffect(() => {
    if (localUsers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localUsers));
    }
  }, [localUsers]);

  // Combine API users with locally added users
  const allUsers = useMemo(() => {
    return [...(users || []), ...localUsers];
  }, [users, localUsers]);

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    if (!allUsers || allUsers.length === 0) return [];

    let filtered = allUsers;

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.phone?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'new') {
        filtered = filtered.filter((user) => user.isNew);
      } else if (filters.status === 'existing') {
        filtered = filtered.filter((user) => !user.isNew);
      }
    }

    // Apply source filter
    if (filters.source) {
      if (filters.source === 'local') {
        filtered = filtered.filter((user) => user.isLocal);
      } else if (filters.source === 'api') {
        filtered = filtered.filter((user) => !user.isLocal);
      }
    }

    return filtered;
  }, [allUsers, debouncedSearch, filters]);

  // Filter options configuration
  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'new', label: 'New Users' },
        { value: 'existing', label: 'Existing Users' },
      ],
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select',
      options: [
        { value: 'local', label: 'Local Users' },
        { value: 'api', label: 'API Users' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      source: '',
    });
    showToast.info('Filters cleared');
  };

  // Handle add user
  const handleAddUser = (formData) => {
    // Find the highest ID from all users and increment by 1
    const maxId = allUsers.length > 0
      ? Math.max(...allUsers.map(u => typeof u.id === 'number' ? u.id : parseInt(u.id) || 0))
      : 0;

    const newUser = {
      id: maxId + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: {
        name: formData.company,
      },
      website: formData.website || '',
      isNew: true,
      isLocal: true,
    };

    setLocalUsers((prev) => [newUser, ...prev]);
    setIsAddModalOpen(false);

    showToast.success(`User "${formData.name}" has been added successfully!`);
  };

  // Handle edit user
  const handleEditUser = (formData) => {
    setLocalUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: { name: formData.company },
              website: formData.website || '',
            }
          : user
      )
    );

    setIsEditModalOpen(false);
    setSelectedUser(null);

    showToast.success(`User "${formData.name}" has been updated successfully!`);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setLocalUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);

    showToast.success(`User "${selectedUser.name}" has been deleted successfully!`);

    setSelectedUser(null);
  };

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (user) => (
        <div className="id-cell">
          <span>#{user.id}</span>
          {user.isNew && (
            <span className="new-badge">
              <CheckCircle size={14} />
              New
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (user) => (
        <div className="user-cell">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <span>{user.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (user) => (
        <div className="email-cell">
          <Mail size={16} />
          <span>{user.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (user) => (
        <div className="phone-cell">
          <Phone size={16} />
          <span>{user.phone}</span>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      render: (user) => user.company.name,
    },
    {
      key: 'website',
      label: 'Website',
      render: (user) => (
        <div className="website-cell">
          {user.website ? (
            <a
              href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="website-link"
            >
              <Globe size={16} />
              <span>{user.website}</span>
            </a>
          ) : (
            <span className="no-website">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => {
        // Check if user exists in localUsers array (these are the ones we can edit/delete)
        const isLocalUser = localUsers.some(localUser => localUser.id === user.id);

        return (
          <div className="action-buttons">
            {isLocalUser ? (
              <>
                {canUpdate() && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(user)}
                    title="Edit user"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {canDelete() && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => openDeleteModal(user)}
                    title="Delete user"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {!canUpdate() && !canDelete() && (
                  <span className="api-user-badge">No Permission</span>
                )}
              </>
            ) : (
              <span className="api-user-badge">API User</span>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <Loading fullscreen />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading users: {error}</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage and view all users in the system</p>
        </div>
        {canCreate() && (
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={20} />
            Add User
          </Button>
        )}
      </div>

      <Card>
        <div className="users-toolbar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <div className="users-count">
              Showing {filteredUsers.length} of {allUsers?.length || 0} users
            </div>
          </div>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterOptions={filterOptions}
          />
        )}

        <Table columns={columns} data={filteredUsers} />
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        size="large"
      >
        <AddUserForm
          onSubmit={handleAddUser}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="large"
      >
        {selectedUser && (
          <AddUserForm
            onSubmit={handleEditUser}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            initialData={{
              name: selectedUser.name,
              email: selectedUser.email,
              phone: selectedUser.phone,
              company: selectedUser.company.name,
              website: selectedUser.website || '',
            }}
            isEdit
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        size="small"
      >
        {selectedUser && (
          <div className="delete-confirmation">
            <p>
              Are you sure you want to delete <strong>{selectedUser.name}</strong>?
            </p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
