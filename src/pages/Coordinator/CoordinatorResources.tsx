import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CoordinatorResources: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Resource Management</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Community Hall Shelter</h3>
              <p style={{ margin: '0 0 4px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>Capacity: 120 / 150</p>
              <p style={{ margin: 0, color: 'var(--primary-container)', fontSize: '14px' }}>Filling fast</p>
            </div>
            <Button variant="secondary" size="default">Manage</Button>
          </div>
        </Card>

        <Card variant="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Water Crates (Supply Hub 1)</h3>
              <p style={{ margin: '0 0 4px 0', color: 'var(--on-surface-variant)', fontSize: '14px' }}>Stock: 500</p>
              <p style={{ margin: 0, color: 'var(--secondary-container)', fontSize: '14px' }}>Stable</p>
            </div>
            <Button variant="secondary" size="default">Manage</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
