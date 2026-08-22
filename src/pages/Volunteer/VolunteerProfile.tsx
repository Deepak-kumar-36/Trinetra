import React from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';

export const VolunteerProfile: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '28px', margin: 0 }}>Volunteer Profile</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="default">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Capabilities (Hard Constraints)</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>Vehicle</span>
            <Chip label="Motorized Boat" variant="secure" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>Skills</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Chip label="Water Rescue" variant="neutral" />
              <Chip label="First Aid" variant="neutral" />
            </div>
          </div>

          <div>
            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>Capacity</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>4 Passengers</span>
          </div>
        </Card>

        <Card variant="default">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Personal Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Name" placeholder="Your name" defaultValue="Arjun" />
            <Input label="Phone Number" placeholder="Your phone number" defaultValue="+91 98765 43210" />
            <Button variant="secondary" size="default">Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
