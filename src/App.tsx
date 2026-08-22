import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import { CitizenLayout } from './layouts/CitizenLayout';
import { VolunteerLayout } from './layouts/VolunteerLayout';
import { CoordinatorLayout } from './layouts/CoordinatorLayout';

// Placeholder Pages (Will be implemented in next phases)
const Splash = () => <div className="placeholder-page"><h1>TriNetra</h1><p>Disaster Response System</p><a href="/role" className="trinetra-button variant-primary">Continue</a></div>;
const RoleSelection = () => <div className="placeholder-page">
  <h2>Select Role</h2>
  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
    <a href="/citizen" className="trinetra-button variant-primary">I need help</a>
    <a href="/volunteer" className="trinetra-button variant-secondary">I want to volunteer</a>
    <a href="/coordinator" className="trinetra-button variant-secondary">I am a coordinator</a>
  </div>
</div>;

// Citizen Pages
const CitizenHome = () => <div className="placeholder-page">Citizen Home</div>;
const CitizenRequests = () => <div className="placeholder-page">My Requests</div>;
const CitizenNearby = () => <div className="placeholder-page">Nearby Help</div>;
const CitizenProfile = () => <div className="placeholder-page">Profile</div>;
const ReportEmergency = () => <div className="placeholder-page">Report Emergency Flow</div>;

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
