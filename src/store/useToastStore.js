import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for common toast types
export const showToast = {
  success: (message, duration) => {
    useToastStore.getState().addToast({ type: 'success', message, duration });
  },
  error: (message, duration) => {
    useToastStore.getState().addToast({ type: 'error', message, duration });
  },
  warning: (message, duration) => {
    useToastStore.getState().addToast({ type: 'warning', message, duration });
  },
  info: (message, duration) => {
    useToastStore.getState().addToast({ type: 'info', message, duration });
  },
};

export default useToastStore;
