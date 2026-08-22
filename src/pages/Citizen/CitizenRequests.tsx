import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

export const CitizenRequests: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>My Requests</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="hazard" hazardStatus="danger">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Flooding - Trapped</h3>
            <Chip label="Prioritized" variant="danger" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            24.123, 75.456 • 3 people
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }} />
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-family-label)' }}>AWAITING RESPONDER</span>
          </div>
        </Card>

        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--on-surface-variant)' }}>Medical Assist</h3>
            <Chip label="Completed" variant="neutral" />
          </div>
          <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Resolved yesterday
          </p>
        </Card>
      </div>
    </div>
  );
};
