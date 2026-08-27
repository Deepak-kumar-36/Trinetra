
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import { CoordinatorLayout } from './layouts/CoordinatorLayout';

import { AuthProvider } from './contexts/AuthContext';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';

import { CoordinatorOperations } from './pages/Coordinator/CoordinatorOperations';
import { CoordinatorIncidents } from './pages/Coordinator/CoordinatorIncidents';
import { CoordinatorMap } from './pages/Coordinator/CoordinatorMap';
import { CoordinatorMissions } from './pages/Coordinator/CoordinatorMissions';
import { CoordinatorResources } from './pages/Coordinator/CoordinatorResources';
import { TTSProvider } from './contexts/TTSContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <TTSProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />

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
        </TTSProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
