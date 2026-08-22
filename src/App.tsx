import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import { CitizenLayout } from './layouts/CitizenLayout';
import { VolunteerLayout } from './layouts/VolunteerLayout';
import { CoordinatorLayout } from './layouts/CoordinatorLayout';

import { Splash } from './pages/Splash';
import { RoleSelection } from './pages/RoleSelection';
import { CitizenHome } from './pages/Citizen/CitizenHome';
import { ReportEmergency } from './pages/Citizen/ReportEmergency';

import { CitizenRequests } from './pages/Citizen/CitizenRequests';
import { CitizenNearby } from './pages/Citizen/CitizenNearby';
import { CitizenProfile } from './pages/Citizen/CitizenProfile';

// Volunteer Pages
const VolunteerHome = () => <div className="placeholder-page">Volunteer Home</div>;
const VolunteerMissions = () => <div className="placeholder-page">Missions</div>;
const VolunteerMap = () => <div className="placeholder-page">Map</div>;
const VolunteerProfile = () => <div className="placeholder-page">Profile</div>;

// Coordinator Pages
const CoordinatorOperations = () => <div className="placeholder-page">Operations Dashboard</div>;
const CoordinatorIncidents = () => <div className="placeholder-page">Incidents</div>;
const CoordinatorMap = () => <div className="placeholder-page">Map</div>;
const CoordinatorMissions = () => <div className="placeholder-page">Missions</div>;
const CoordinatorResources = () => <div className="placeholder-page">Resources</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/role" element={<RoleSelection />} />

        {/* Citizen Flow */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenHome />} />
          <Route path="requests" element={<CitizenRequests />} />
          <Route path="nearby" element={<CitizenNearby />} />
          <Route path="profile" element={<CitizenProfile />} />
        </Route>
        <Route path="/citizen/report" element={<ReportEmergency />} />

        {/* Volunteer Flow */}
        <Route path="/volunteer" element={<VolunteerLayout />}>
          <Route index element={<VolunteerHome />} />
          <Route path="missions" element={<VolunteerMissions />} />
          <Route path="map" element={<VolunteerMap />} />
          <Route path="profile" element={<VolunteerProfile />} />
        </Route>

        {/* Coordinator Flow */}
        <Route path="/coordinator" element={<CoordinatorLayout />}>
          <Route index element={<CoordinatorOperations />} />
          <Route path="incidents" element={<CoordinatorIncidents />} />
          <Route path="map" element={<CoordinatorMap />} />
          <Route path="missions" element={<CoordinatorMissions />} />
          <Route path="resources" element={<CoordinatorResources />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
