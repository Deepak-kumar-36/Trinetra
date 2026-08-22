import React from 'react';

export const VolunteerMap: React.FC = () => {
  return (
    <div style={{ padding: 'var(--margin-mobile)', paddingTop: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '28px', margin: '0 0 16px 0' }}>Live Map</h2>
      <div style={{ flex: 1, backgroundColor: 'var(--surface-container)', borderRadius: '8px', border: '2px dashed var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--on-surface-variant)' }}>[Interactive Map Placeholder]</p>
      </div>
    </div>
  );
};
