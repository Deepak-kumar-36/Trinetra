import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

export const CoordinatorOperations: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Operations Command</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--error)' }}>12</div>
          <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Critical</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--secondary-container)' }}>45</div>
          <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Active Missions</div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Top Priority (Unassigned)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card variant="hazard" hazardStatus="danger">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Flooding - Trapped</h3>
              <Chip label="Score: 98" variant="danger" />
            </div>
            <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
              Sector 4 • 3 people (1 elderly) • Water rising fast
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--primary-container)' }}>Requires: Boat, First Aid</span>
              <span className="tactical-label" style={{ color: 'var(--on-surface-variant)' }}>REVIEW</span>
            </div>
          </Card>

          <Card variant="hazard" hazardStatus="danger">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Building Collapse</h3>
              <Chip label="Score: 92" variant="danger" />
            </div>
            <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
              Downtown • Unknown count • Structural damage
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--primary-container)' }}>Requires: Heavy Lift, Medical</span>
              <span className="tactical-label" style={{ color: 'var(--on-surface-variant)' }}>REVIEW</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
