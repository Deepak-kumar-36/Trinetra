import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, LayoutList, Map, ClipboardList, Box } from 'lucide-react';
import './CoordinatorLayout.css';

export const CoordinatorLayout: React.FC = () => {
  return (
    <div className="coordinator-layout">
      <main className="layout-content">
        <Outlet />
      </main>

      <nav className="bottom-nav coordinator-nav">
        <NavLink to="/coordinator" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={24} />
          <span>Operations</span>
        </NavLink>
        <NavLink to="/coordinator/incidents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutList size={24} />
          <span>Incidents</span>
        </NavLink>
        <NavLink to="/coordinator/map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Map size={24} />
          <span>Map</span>
        </NavLink>
        <NavLink to="/coordinator/missions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ClipboardList size={24} />
          <span>Missions</span>
        </NavLink>
        <NavLink to="/coordinator/resources" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Box size={24} />
          <span>Resources</span>
        </NavLink>
      </nav>
    </div>
  );
};
