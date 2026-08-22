import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

export const VolunteerMissions: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Mission History</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--on-surface-variant)' }}>Medical Transport</h3>
            <Chip label="Completed" variant="secure" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Aug 21, 2026 • City Hospital
          </p>
        </Card>

        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--on-surface-variant)' }}>Supply Run</h3>
            <Chip label="Completed" variant="secure" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Aug 20, 2026 • Sector 4 Shelter
          </p>
        </Card>
      </div>
    </div>
  );
};
