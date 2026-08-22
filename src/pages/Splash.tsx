import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 'var(--margin-mobile)', justifyContent: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '48px', color: 'var(--primary-container)', marginBottom: '16px', fontWeight: 800 }}>TriNetra</h1>
        <p style={{ fontSize: '20px', color: 'var(--on-surface-variant)', textAlign: 'center' }}>
          Report. Track. Get Help.
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button variant="primary" size="large" fullWidth onClick={() => navigate('/role')}>
          Continue
        </Button>
      </div>
    </div>
  );
};
