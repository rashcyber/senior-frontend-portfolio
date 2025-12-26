import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      password: null, // Store current password (in production, this would be hashed on backend)
      registeredUsers: [], // Store registered users
      userRole: 'viewer', // Default role: admin, editor, viewer

      login: (userData, token, password) => {
        // Assign role based on user (demo logic)
        const role = userData.role || 'viewer';

        set({
          user: userData,
          token,
          password, // Store password for validation
          isAuthenticated: true,
          userRole: role
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          password: null,
          isAuthenticated: false,
          userRole: 'viewer'
        });
      },

      setUserRole: (role) => {
        set({ userRole: role });
      },

      // Permission check helpers
      hasPermission: (permission) => {
        const { userRole } = get();
        const permissions = {
          admin: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_settings'],
          editor: ['create', 'read', 'update'],
          viewer: ['read']
        };
        return permissions[userRole]?.includes(permission) || false;
      },

      canCreate: () => get().hasPermission('create'),
      canUpdate: () => get().hasPermission('update'),
      canDelete: () => get().hasPermission('delete'),
      canManageUsers: () => get().hasPermission('manage_users'),

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },

      updatePassword: (newPassword) => {
        set({ password: newPassword });
      },

      verifyPassword: (password) => {
        const { password: storedPassword } = get();
        return storedPassword === password;
      },

      register: (userData, password) => {
        const { registeredUsers } = get();
        const newUser = {
          ...userData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };

        set({
          registeredUsers: [...registeredUsers, { ...newUser, password }],
        });

        return newUser;
      },

      findUserByEmail: (email) => {
        const { registeredUsers } = get();
        return registeredUsers.find(user => user.email === email);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
