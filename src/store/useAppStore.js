import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: localStorage.getItem('app-theme') || 'light',
      notifications: [],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setTheme: (theme) => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
        set({ theme });
      },

      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          { ...notification, id: Date.now(), timestamp: new Date() }
        ]
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme
      }),
    }
  )
);

// Apply theme on initial load
const currentTheme = localStorage.getItem('app-theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

export default useAppStore;
