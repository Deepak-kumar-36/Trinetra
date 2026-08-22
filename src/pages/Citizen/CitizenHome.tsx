import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const CitizenHome: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '28px', margin: 0 }}>Active Status</h2>
        <ShieldAlert color="var(--secondary-container)" size={28} />
      </div>

      {/* Active Incident Mock */}
      <Card variant="hazard" hazardStatus="danger" onClick={() => console.log('View incident')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Flooding - Trapped</h3>
          <Chip label="Prioritized" variant="danger" />
        </div>
        <p style={{ margin: '0 0 16px 0', color: 'var(--on-surface-variant)' }}>
          Reported 12m ago • 3 people affected
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }} />
          <span style={{ fontSize: '14px', fontFamily: 'var(--font-family-label)' }}>AWAITING RESPONDER</span>
        </div>
      </Card>

      <div>
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Safety Information</h3>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '16px', margin: '0 -20px', padding: '0 20px 16px 20px' }}>
          <Card variant="elevated" className="carousel-card" style={{ minWidth: '240px', flex: '0 0 auto' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary-container)' }}>Flood Safety</h4>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--on-surface-variant)' }}>Move to higher ground immediately. Do not walk through moving water.</p>
          </Card>
          <Card variant="elevated" className="carousel-card" style={{ minWidth: '240px', flex: '0 0 auto' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary-container)' }}>Emergency Kit</h4>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--on-surface-variant)' }}>Keep water, flashlight, and first aid ready.</p>
          </Card>
        </div>
      </div>
      
    </div>
  );
};
