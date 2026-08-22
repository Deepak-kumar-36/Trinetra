import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mic, Camera, ArrowLeft } from 'lucide-react';

export const ReportEmergency: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'location' | 'review'>('input');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--surface-variant)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, fontSize: '24px' }}>Report Emergency</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
        {step === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '18px', marginBottom: '32px' }}>
              Describe the situation clearly. We will use AI to extract the details.
            </p>
            
            <Input 
              label="What is happening?" 
              placeholder="e.g. 3 people trapped in flooded house..." 
              style={{ minHeight: '120px' }}
            />

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <Button variant="secondary" style={{ flex: 1 }}>
                <Mic size={20} /> Speak
              </Button>
              <Button variant="secondary" style={{ flex: 1 }}>
                <Camera size={20} /> Photo
              </Button>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
              <Button variant="primary" size="tactical" fullWidth onClick={() => setStep('location')}>
                Next: Location
              </Button>
            </div>
          </div>
        )}

        {step === 'location' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '18px', marginBottom: '24px' }}>
              Confirm location for responders.
            </p>
            
            <div style={{ backgroundColor: 'var(--surface-container)', height: '250px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '2px dashed var(--outline)' }}>
              [Map View Placeholder]
            </div>

            <Input label="Address (Optional)" placeholder="Enter manual address" />

            <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
              <Button variant="primary" size="tactical" fullWidth onClick={() => setStep('review')}>
                Confirm Location
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-container)' }}>Incident Details</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <span className="tactical-label" style={{ color: 'var(--on-surface-variant)' }}>TYPE</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '18px' }}>Flooding</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <span className="tactical-label" style={{ color: 'var(--on-surface-variant)' }}>PEOPLE AFFECTED</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '18px' }}>3 (Included 1 elderly)</p>
              </div>

              <div>
                <span className="tactical-label" style={{ color: 'var(--on-surface-variant)' }}>LOCATION</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '18px' }}>24.123, 75.456</p>
              </div>
            </div>

            <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
              By submitting, you confirm these details are accurate to your knowledge.
            </p>

            <div style={{ marginTop: 'auto' }}>
              <Button variant="danger" size="tactical" fullWidth onClick={() => navigate('/citizen')}>
                SUBMIT REPORT
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
