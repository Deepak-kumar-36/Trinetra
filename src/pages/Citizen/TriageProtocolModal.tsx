import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, AlertTriangle, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TriageProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (triageData: any) => void;
}

const DANGER_OPTIONS = [
  { id: 'unconscious', label: 'Unconscious', icon: 'mood_bad', score: 30 },
  { id: 'breathing', label: 'Difficulty breathing', icon: 'air', score: 25 },
  { id: 'bleeding', label: 'Severe bleeding', icon: 'water_drop', score: 25 },
  { id: 'fire', label: 'Fire / explosion nearby', icon: 'local_fire_department', score: 20 },
  { id: 'trapped', label: 'Trapped / unable to escape', icon: 'no_transfer', score: 25 },
  { id: 'none', label: 'None of these', icon: 'check_circle', score: 0 }
];

const VULNERABILITY_OPTIONS = [
  { id: 'disability', label: 'Disability', score: 10 },
  { id: 'pregnant', label: 'Pregnant', score: 15 },
  { id: 'medication', label: 'Requires medication', score: 10 },
  { id: 'medical', label: 'Medical condition', score: 18 }
];

const INCIDENT_TYPES = [
  { id: 'flood', label: 'Flood / Water', icon: 'flood' },
  { id: 'fire', label: 'Fire / Smoke', icon: 'local_fire_department' },
  { id: 'medical', label: 'Medical Emergency', icon: 'medical_services' },
  { id: 'security', label: 'Security / Threat', icon: 'security' },
  { id: 'other', label: 'Other', icon: 'more_horiz' }
];

export const TriageProtocolModal: React.FC<TriageProtocolModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [selectedDangers, setSelectedDangers] = useState<string[]>([]);
  
  // Step 2 State
  const [people, setPeople] = useState({ adults: 1, children: 0, elderly: 0 });
  const [vulnerabilities, setVulnerabilities] = useState<string[]>([]);
  
  // Step 3 State
  const [incidentType, setIncidentType] = useState<string>('');
  const [situationAnswers, setSituationAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const toggleDanger = (id: string) => {
    if (id === 'none') {
      setSelectedDangers(['none']);
      return;
    }
    setSelectedDangers(prev => {
      const filtered = prev.filter(p => p !== 'none');
      if (filtered.includes(id)) return filtered.filter(p => p !== id);
      return [...filtered, id];
    });
  };

  const toggleVulnerability = (id: string) => {
    setVulnerabilities(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updatePeople = (type: 'adults' | 'children' | 'elderly', delta: number) => {
    setPeople(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const calculateScore = () => {
    let score = 0;
    const reasons: { label: string; points: number }[] = [];

    // Dangers
    selectedDangers.forEach(dId => {
      const danger = DANGER_OPTIONS.find(d => d.id === dId);
      if (danger && danger.score > 0) {
        score += danger.score;
        reasons.push({ label: danger.label, points: danger.score });
      }
    });

    // People
    if (people.children > 0) {
      score += 20;
      reasons.push({ label: 'Child involved', points: 20 });
    }
    if (people.elderly > 0) {
      score += 15;
      reasons.push({ label: 'Elderly involved', points: 15 });
    }
    const totalPeople = people.adults + people.children + people.elderly;
    if (totalPeople > 2) {
      score += 9;
      reasons.push({ label: 'Multiple people affected', points: 9 });
    }

    // Vulnerabilities
    vulnerabilities.forEach(vId => {
      const vuln = VULNERABILITY_OPTIONS.find(v => v.id === vId);
      if (vuln) {
        score += vuln.score;
        reasons.push({ label: vuln.label, points: vuln.score });
      }
    });

    // Situation
    if (situationAnswers['water_level'] === 'critical' || situationAnswers['fire_spreading'] === 'yes') {
      score += 20;
      reasons.push({ label: 'Situation worsening', points: 20 });
    }
    if (situationAnswers['safe_exit'] === 'no' || situationAnswers['evacuation'] === 'no') {
      score += 25;
      reasons.push({ label: 'Person trapped / No exit', points: 25 });
    }

    return {
      total: Math.min(100, score),
      reasons: reasons.sort((a, b) => b.points - a.points).slice(0, 5) // Top 5 reasons
    };
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h2 className="font-display-lg text-2xl mb-1 text-on-surface">Immediate Danger</h2>
      <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-6">Is anyone in immediate danger?</p>
      
      <div className="grid grid-cols-2 gap-3">
        {DANGER_OPTIONS.map(option => {
          const isSelected = selectedDangers.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleDanger(option.id)}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 text-center border-2 transition-all active:scale-95
                ${isSelected 
                  ? 'border-error bg-error/10 text-error' 
                  : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }
                ${option.id === 'none' ? 'col-span-2' : ''}
              `}
            >
              <span className="material-symbols-outlined text-3xl">{option.icon}</span>
              <span className={`font-bold ${isSelected ? 'text-error' : 'text-on-surface'} text-sm`}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <h2 className="font-display-lg text-2xl mb-1 text-on-surface">People & Vulnerability</h2>
      <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-6">Who needs help?</p>
      
      <div className="bg-surface-container rounded-2xl p-5 mb-6 border border-outline-variant/30">
        {[
          { id: 'adults', label: 'Adults' },
          { id: 'children', label: 'Children' },
          { id: 'elderly', label: 'Elderly' }
        ].map(group => (
          <div key={group.id} className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0 last:pb-0">
            <span className="font-bold text-on-surface">{group.label}</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => updatePeople(group.id as any, -1)}
                className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-outline-variant/50 transition-colors"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="font-display-lg text-xl w-6 text-center">{people[group.id as keyof typeof people]}</span>
              <button 
                onClick={() => updatePeople(group.id as any, 1)}
                className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:brightness-95 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="font-label-sm uppercase tracking-wider text-on-surface-variant mb-3">Vulnerabilities / Special Needs</p>
      <div className="flex flex-wrap gap-2">
        {VULNERABILITY_OPTIONS.map(vuln => {
          const isSelected = vulnerabilities.includes(vuln.id);
          return (
            <button
              key={vuln.id}
              onClick={() => toggleVulnerability(vuln.id)}
              className={`px-4 py-2 rounded-full font-bold text-sm border transition-all
                ${isSelected
                  ? 'bg-secondary-container text-on-secondary-container border-transparent'
                  : 'bg-transparent border-outline-variant text-on-surface hover:bg-surface-variant'
                }
              `}
            >
              {vuln.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
      <h2 className="font-display-lg text-2xl mb-1 text-on-surface">Situation Assessment</h2>
      <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-6">Provide more context</p>
      
      {!incidentType && (
        <div className="mb-6">
          <p className="font-bold text-on-surface mb-3">What is the primary incident type?</p>
          <div className="grid grid-cols-2 gap-2">
            {INCIDENT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setIncidentType(type.id)}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all
                  ${incidentType === type.id ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/30 bg-surface-container text-on-surface'}
                  ${type.id === 'other' ? 'col-span-2' : ''}
                `}
              >
                <span className="material-symbols-outlined text-xl">{type.icon}</span>
                <span className="font-bold text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {incidentType === 'flood' && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <p className="font-bold text-on-surface mb-2">Water level</p>
            <div className="flex gap-2">
              {['Low', 'Rising', 'Critical'].map(level => (
                <button
                  key={level}
                  onClick={() => setSituationAnswers(prev => ({...prev, water_level: level.toLowerCase()}))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${situationAnswers['water_level'] === level.toLowerCase() ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-on-surface mb-2">People trapped?</p>
            <div className="flex gap-2">
              {['Yes', 'No'].map(ans => (
                <button
                  key={ans}
                  onClick={() => setSituationAnswers(prev => ({...prev, trapped: ans.toLowerCase()}))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${situationAnswers['trapped'] === ans.toLowerCase() ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface'}`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-on-surface mb-2">Safe exit available?</p>
            <div className="flex gap-2">
              {['Yes', 'No'].map(ans => (
                <button
                  key={ans}
                  onClick={() => setSituationAnswers(prev => ({...prev, safe_exit: ans.toLowerCase()}))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${situationAnswers['safe_exit'] === ans.toLowerCase() ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface'}`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {incidentType === 'fire' && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <p className="font-bold text-on-surface mb-2">Fire spreading?</p>
            <div className="flex gap-2">
              {['Yes', 'No'].map(ans => (
                <button
                  key={ans}
                  onClick={() => setSituationAnswers(prev => ({...prev, fire_spreading: ans.toLowerCase()}))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${situationAnswers['fire_spreading'] === ans.toLowerCase() ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface'}`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-on-surface mb-2">Smoke exposure?</p>
            <div className="flex gap-2">
              {['Heavy', 'Light', 'None'].map(ans => (
                <button
                  key={ans}
                  onClick={() => setSituationAnswers(prev => ({...prev, smoke: ans.toLowerCase()}))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${situationAnswers['smoke'] === ans.toLowerCase() ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface'}`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-on-surface mb-2">Building evacuation possible?</p>
            <div className="flex gap-2">
              {['Yes', 'No'].map(ans => (
                <button
                  key={ans}
                  onClick={() => setSituationAnswers(prev => ({...prev, evacuation: ans.toLowerCase()}))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${situationAnswers['evacuation'] === ans.toLowerCase() ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface'}`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {incidentType && !['flood', 'fire'].includes(incidentType) && (
        <div className="animate-fade-in bg-surface-container rounded-xl p-6 text-center border border-outline-variant/30">
          <span className="material-symbols-outlined text-4xl text-sage-primary mb-2">check_circle</span>
          <p className="font-bold text-on-surface">Standard Protocol Active</p>
          <p className="text-sm text-on-surface-variant mt-1">No additional situation questions required for this incident type.</p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => {
    const { total, reasons } = calculateScore();
    let severityColor = 'text-primary';
    let severityBg = 'bg-primary-container';
    let severityLabel = 'MODERATE';
    
    if (total >= 70) {
      severityColor = 'text-error';
      severityBg = 'bg-error/15';
      severityLabel = 'CRITICAL';
    } else if (total >= 40) {
      severityColor = 'text-amber-600';
      severityBg = 'bg-amber-500/15';
      severityLabel = 'HIGH';
    }

    return (
      <div className="animate-fade-in flex flex-col items-center">
        <h2 className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-6">Triage Result</h2>
        
        <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 ${total >= 70 ? 'border-error shadow-[0_0_40px_rgba(200,50,50,0.4)]' : total >= 40 ? 'border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]' : 'border-primary'} mb-6 relative`}>
          <div className="absolute inset-0 rounded-full border-[10px] border-surface-container-lowest opacity-50"></div>
          <span className={`font-display-lg text-5xl font-bold ${severityColor}`}>{total}</span>
          <span className={`font-label-sm font-bold uppercase tracking-widest ${severityColor}`}>/ 100</span>
        </div>

        <div className={`px-6 py-2 rounded-full ${severityBg} ${severityColor} font-bold tracking-widest uppercase mb-8 flex items-center gap-2`}>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
          {severityLabel} PRIORITY
        </div>

        <div className="w-full bg-surface-container rounded-2xl p-5 border border-outline-variant/30 mb-8">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant mb-3 border-b border-outline-variant/30 pb-2">Assessment Reasoning</p>
          <div className="space-y-2">
            {reasons.length > 0 ? reasons.map((reason, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-on-surface font-medium flex items-center gap-2">
                  <span className="text-[10px]">▲</span> {reason.label}
                </span>
                <span className={`${severityColor} font-bold text-sm`}>+{reason.points}</span>
              </div>
            )) : (
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Standard Baseline</span>
                <span>+0</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => onComplete({
            score: total,
            severity: severityLabel,
            dangers: selectedDangers,
            people,
            vulnerabilities,
            incidentType,
            situationAnswers
          })}
          className="w-full bg-error hover:bg-error/90 text-white py-4 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all active:scale-95 shadow-[0_8px_24px_rgba(200,50,50,0.3)] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">send</span>
          Send to Command Center
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-stone-bg flex flex-col animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md">
        <button 
          onClick={step > 1 ? () => setStep(step - 1) : onClose}
          className="p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-primary' : step > i ? 'w-4 bg-primary/40' : 'w-4 bg-outline-variant/30'}`} />
          ))}
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 max-w-lg mx-auto w-full">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {step < 4 && (
        <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-stone-bg via-stone-bg to-transparent">
          <div className="max-w-lg mx-auto">
            <button 
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && selectedDangers.length === 0}
              className="w-full bg-primary disabled:bg-surface-variant disabled:text-on-surface-variant hover:bg-primary/90 text-on-primary py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
