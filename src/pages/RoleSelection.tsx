import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 'var(--margin-mobile)', paddingTop: '64px' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Select Role</h2>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: '32px' }}>How do you want to use TriNetra?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <Button variant="primary" size="large" fullWidth onClick={() => navigate('/citizen')}>
          I need help (Citizen)
        </Button>
        <Button variant="secondary" size="large" fullWidth onClick={() => navigate('/volunteer')}>
          I want to volunteer
        </Button>
        <Button variant="secondary" size="large" fullWidth onClick={() => navigate('/coordinator')}>
          I am a coordinator
        </Button>
      </div>
    </div>
  );
};
