import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

export const CoordinatorMissions: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Active Missions</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--on-surface-variant)' }}>Medical Transport</h3>
            <Chip label="En Route" variant="secure" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Assigned to: Team Alpha • ETA: 5m
          </p>
        </Card>

        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--on-surface-variant)' }}>Evacuation</h3>
            <Chip label="Arrived" variant="secure" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Assigned to: Boat Unit 2 • On Scene
          </p>
        </Card>
      </div>
    </div>
  );
};
