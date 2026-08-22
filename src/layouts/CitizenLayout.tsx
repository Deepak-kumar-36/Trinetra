import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, List, MapPin, User, AlertTriangle } from 'lucide-react';
import './CitizenLayout.css';

export const CitizenLayout: React.FC = () => {
  return (
    <div className="citizen-layout">
      <main className="layout-content">
        <Outlet />
      </main>
      
      {/* Floating Action Button for Emergency */}
      <div className="fab-container">
        <NavLink to="/citizen/report" className="fab-button">
          <AlertTriangle size={24} />
          <span>REPORT EMERGENCY</span>
        </NavLink>
      </div>

      <nav className="bottom-nav">
        <NavLink to="/citizen" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/citizen/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <List size={24} />
          <span>My Requests</span>
        </NavLink>
        <NavLink to="/citizen/nearby" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MapPin size={24} />
          <span>Nearby Help</span>
        </NavLink>
        <NavLink to="/citizen/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
