import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';

export const VolunteerHome: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasIncoming, setHasIncoming] = useState(true);

  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Availability Toggle */}
      <Card variant="elevated" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Status: {isAvailable ? 'Available' : 'Off-Duty'}</h3>
        <Button 
          variant={isAvailable ? 'danger' : 'primary'} 
          size="default"
          onClick={() => setIsAvailable(!isAvailable)}
        >
          {isAvailable ? 'Go Offline' : 'Go Online'}
        </Button>
      </Card>

      {/* Incoming Mission */}
      {isAvailable && hasIncoming && (
        <div style={{ position: 'relative' }}>
          {/* Animated glow effect */}
          <div style={{
            position: 'absolute',
            top: -4, left: -4, right: -4, bottom: -4,
            backgroundColor: 'var(--primary-container)',
            borderRadius: '12px',
            opacity: 0.5,
            animation: 'pulse 2s infinite'
          }} />
          <Card variant="hazard" hazardStatus="danger" style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--surface-bright)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--on-surface)' }}>INCOMING MISSION</h2>
              <Chip label="Critical" variant="danger" />
            </div>
            
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Flooding - Trapped</h3>
            <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)', fontSize: '16px' }}>
              Requires: Water Rescue, Boat<br/>
              Distance: 2.1 km
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="primary" size="tactical" fullWidth onClick={() => setHasIncoming(false)}>
                ACCEPT
              </Button>
              <Button variant="secondary" size="tactical" fullWidth onClick={() => setHasIncoming(false)}>
                DECLINE
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Active Mission (If accepted) */}
      {(!hasIncoming || !isAvailable) && (
        <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--on-surface-variant)' }}>
          <p style={{ fontSize: '18px' }}>No active missions.</p>
          <p style={{ fontSize: '14px' }}>Stay safe and wait for dispatch.</p>
        </div>
      )}

    </div>
  );
};
