import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, List, Map, User } from 'lucide-react';
import './VolunteerLayout.css';

export const VolunteerLayout: React.FC = () => {
  return (
    <div className="volunteer-layout">
      <main className="layout-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/volunteer" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/volunteer/missions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <List size={24} />
          <span>Missions</span>
        </NavLink>
        <NavLink to="/volunteer/map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Map size={24} />
          <span>Map</span>
        </NavLink>
        <NavLink to="/volunteer/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
