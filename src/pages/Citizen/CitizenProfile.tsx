import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const CitizenProfile: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Profile & Settings</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Personal Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Name" placeholder="Your name" defaultValue="Guest User" />
            <Input label="Phone Number" placeholder="Your phone number" />
            <Button variant="secondary" size="default">Save Changes</Button>
          </div>
        </Card>

        <Card variant="default">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>App Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>Language</span>
              <span style={{ color: 'var(--primary-container)', fontWeight: 700 }}>English</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>Notifications</span>
              <span style={{ color: 'var(--primary-container)', fontWeight: 700 }}>Enabled</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
