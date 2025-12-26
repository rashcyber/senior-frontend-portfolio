import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';
import useAppStore from '../store/useAppStore';
import '../styles/Layout.css';

const Layout = () => {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;
