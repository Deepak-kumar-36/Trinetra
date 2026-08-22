import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CitizenNearby: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Nearby Help</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Community Hall Shelter</h3>
              <p style={{ margin: '0 0 4px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>2.4 km away • Open</p>
              <p style={{ margin: 0, color: 'var(--secondary-container)', fontSize: '14px' }}>Capacity: Filling fast</p>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Button variant="secondary" size="default" fullWidth>Get Directions</Button>
          </div>
        </Card>

        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>City Hospital (Safe Zone)</h3>
              <p style={{ margin: '0 0 4px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>5.1 km away • Open</p>
              <p style={{ margin: 0, color: 'var(--secondary-container)', fontSize: '14px' }}>Medical support available</p>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Button variant="secondary" size="default" fullWidth>Get Directions</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
