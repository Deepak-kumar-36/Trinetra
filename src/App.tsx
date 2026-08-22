
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import { CitizenLayout } from './layouts/CitizenLayout';
import { VolunteerLayout } from './layouts/VolunteerLayout';
import { CoordinatorLayout } from './layouts/CoordinatorLayout';

import { AuthProvider } from './contexts/AuthContext';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { RoleSelection } from './pages/RoleSelection';
import { CitizenHome } from './pages/Citizen/CitizenHome';
import { ReportEmergency } from './pages/Citizen/ReportEmergency';

import { CitizenRequests } from './pages/Citizen/CitizenRequests';
import { CitizenNearby } from './pages/Citizen/CitizenNearby';
import { CitizenProfile } from './pages/Citizen/CitizenProfile';
import { CitizenPhoto } from './pages/Citizen/CitizenPhoto';

import { VolunteerHome } from './pages/Volunteer/VolunteerHome';
import { VolunteerMissions } from './pages/Volunteer/VolunteerMissions';
import { VolunteerMap } from './pages/Volunteer/VolunteerMap';
import { VolunteerProfile } from './pages/Volunteer/VolunteerProfile';

import { CoordinatorOperations } from './pages/Coordinator/CoordinatorOperations';
import { CoordinatorIncidents } from './pages/Coordinator/CoordinatorIncidents';
import { CoordinatorMap } from './pages/Coordinator/CoordinatorMap';
import { CoordinatorMissions } from './pages/Coordinator/CoordinatorMissions';
import { CoordinatorResources } from './pages/Coordinator/CoordinatorResources';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />

        {/* Citizen Flow */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenHome />} />
          <Route path="requests" element={<CitizenRequests />} />
          <Route path="nearby" element={<CitizenNearby />} />
          <Route path="profile" element={<CitizenProfile />} />
          <Route path="photo" element={<CitizenPhoto />} />
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
    </AuthProvider>
  );
}

export default App;
