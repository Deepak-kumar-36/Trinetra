import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

export const CoordinatorIncidents: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Incident Queue</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Medical Transport</h3>
            <Chip label="Assigned" variant="secure" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Sector 2 • 1 person (injury)
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Assigned to: Team Alpha</span>
            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>ETA: 5m</span>
          </div>
        </Card>

        <Card variant="hazard" hazardStatus="caution">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Supply Request</h3>
            <Chip label="Pending" variant="caution" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Sector 7 Shelter • Needs 50 water crates
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>No matched responder yet</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
