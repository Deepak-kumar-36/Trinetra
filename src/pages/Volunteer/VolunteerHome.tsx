import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { generateUUID } from '../../lib/utils';

export const VolunteerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [responderId, setResponderId] = useState<string | null>(null);

  const renderTranscript = (transcript: string) => {
    if (!transcript) return 'Emergency Reported';
    try {
      const data = JSON.parse(transcript);
      if (data.type === 'photo_report' && data.url) {
        return (
          <div className="flex flex-col gap-2 mt-2">
            <span className="flex items-center gap-1 text-sm font-bold text-primary">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span> Photo Report
            </span>
            <img src={data.url} alt="Incident Report" className="w-full h-32 object-cover rounded-lg shadow-sm border border-outline-variant/30" />
          </div>
        );
      }
    } catch (e) {
      // Not JSON
    }
    return <span>{transcript}</span>;
  };
  const [mission, setMission] = useState<any>(null);
  const [incident, setIncident] = useState<any>(null);
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isSelfAssigning, setIsSelfAssigning] = useState(false);

  const fetchActiveIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'reported')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (!error && data) {
      setActiveIncidents(data);
    }
  };

  const fetchMission = async (rId: string) => {
    // Find active mission
    const { data, error } = await supabase
      .from('missions')
      .select('*, incidents(*)')
      .eq('responder_id', rId)
      .eq('status', 'assigned')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setMission(data);
      setIncident(data.incidents);
    } else {
      setMission(null);
      setIncident(null);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const init = async () => {
      const uId = generateUUID(user.uid);
      // Fetch responder ID for this user
      let { data } = await supabase
        .from('responders')
        .select('id')
        .eq('user_id', uId)
        .single();
        
      if (!data) {
        // Auto-register this Firebase Volunteer as a responder so they can be dispatched
        // First ensure they exist in public.users
        await supabase.from('users').upsert([{ id: uId, role: 'volunteer', full_name: user.displayName || user.email || 'Volunteer Team' }], { onConflict: 'id' });
        
        const { data: inserted } = await supabase.from('responders').insert([{
          user_id: uId,
          skills: ['water_rescue', 'first_aid', 'medical'],
          vehicle_type: 'boat',
          equipment: ['rescue_boat', 'life_jackets', 'medical_kit'],
          cargo_capacity: 6,
          availability: true,
          location: `POINT(77.2150 28.6150)` // Near the incident
        }]).select('id').single();
        
        if (inserted) data = inserted;
      }
        
      if (data) {
        setResponderId(data.id);
        await fetchMission(data.id);
      }
    };
    
    init();
  }, [user]);

  // Fetch and subscribe to active incidents independently of responder ID
  useEffect(() => {
    fetchActiveIncidents();

    const incidentsChannel = supabase
      .channel('volunteer-incidents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => {
          console.log("Incidents table changed, refreshing...");
          fetchActiveIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(incidentsChannel);
    };
  }, []);

  // Subscribe to missions table for Realtime updates
  useEffect(() => {
    if (!responderId) return;

    const channel = supabase
      .channel('volunteer-missions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'missions', filter: `responder_id=eq.${responderId}` },
        () => {
          // Fetch full mission details when new mission arrives
          fetchMission(responderId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [responderId]);

  const handleSelfAssign = async (targetIncident: any) => {
    if (!responderId || !user) return;
    setIsSelfAssigning(true);
    
    // Create mission
    const { error: missionError } = await supabase.from('missions').insert([{
      incident_id: targetIncident.id,
      responder_id: responderId,
      assigned_by: generateUUID(user.uid), // Self-assigned
      status: 'accepted' // Auto-accept since they self-assigned
    }]).select('id').single();
    
    if (missionError) {
      console.error("Failed to self-assign mission:", missionError);
      setIsSelfAssigning(false);
      return;
    }
    
    // Update incident status
    await supabase.from('incidents').update({ status: 'assigned' }).eq('id', targetIncident.id);
    
    // Notify citizen
    await supabase.from('notifications').insert([{
      user_id: targetIncident.reporter_id,
      type: 'resource_dispatched',
      priority: 'high',
      related_incident_id: targetIncident.id,
      message: `A Volunteer Team has dispatched to your location and is en route!`,
    }]);
    
    setIsSelfAssigning(false);
    navigate('/volunteer/map');
  };

  const handleAccept = async () => {
    if (!mission) return;
    setIsAccepting(true);
    
    const { error } = await supabase
      .from('missions')
      .update({ status: 'accepted' })
      .eq('id', mission.id);
      
    setIsAccepting(false);
    
    if (!error) {
      navigate('/volunteer/map');
    } else {
      console.error("Failed to accept mission:", error);
    }
  };

  return (
    <div className="font-body-md antialiased min-h-screen flex flex-col mesh-bg relative pb-32">
      {/* Background Mesh styling */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(at_10%_20%,_hsla(28,100%,74%,0.1)_0px,_transparent_50%),radial-gradient(at_80%_90%,_hsla(116,36%,66%,0.1)_0px,_transparent_50%),radial-gradient(at_90%_10%,_hsla(140,24%,38%,0.05)_0px,_transparent_50%)] pointer-events-none"></div>

      <main className="flex-grow flex justify-center w-full z-10">
        <div className="w-full max-w-[1040px] px-margin-mobile md:px-0 py-section-gap flex flex-col gap-section-gap">
          {/* Page Title Area */}
          <div className="flex flex-col gap-4 fade-in-up stagger-1">
            <h2 className="font-display-lg text-display-lg text-primary drop-shadow-sm">
              {mission ? 'Incoming Mission' : 'Standby Mode'}
            </h2>
          </div>

          {!mission ? (
            <div className="flex flex-col gap-6 fade-in-up stagger-2">
              {activeIncidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-surface-container/50 backdrop-blur-sm rounded-2xl border border-surface-variant">
                  <span className="material-symbols-outlined text-[64px] text-sage-primary/50 mb-4 animate-pulse">radar</span>
                  <h3 className="font-headline-md text-on-surface mb-2">Waiting for Assignment</h3>
                  <p className="text-on-surface-variant text-center max-w-md">
                    You are currently on standby. Any reported incidents nearby will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="font-headline-sm text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined animate-pulse text-error">sensors</span> Live Incidents Nearby
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeIncidents.map((inc) => (
                      <div key={inc.id} className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${inc.category === 'voice_distress' ? 'bg-error text-white animate-pulse' : 'bg-primary/10 text-primary'}`}>
                              {inc.category || 'Emergency'}
                            </span>
                            <h4 className="font-bold text-lg text-on-surface">{renderTranscript(inc.raw_transcript || inc.description)}</h4>
                          </div>
                          <div className={`flex flex-col items-end ${inc.urgency_score >= 80 ? 'text-error' : 'text-earth-accent'}`}>
                            <span className="font-display-sm leading-none">{inc.urgency_score || 'N/A'}</span>
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Score</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {inc.hazards?.map((h: string, i: number) => (
                            <span key={i} className="text-[10px] uppercase bg-error/10 text-error px-2 py-0.5 rounded-sm border border-error/20">{h}</span>
                          ))}
                          {inc.vulnerabilities?.map((v: string, i: number) => (
                            <span key={i} className="text-[10px] uppercase bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-sm border border-secondary/20">{v}</span>
                          ))}
                        </div>
                        
                        <div className="mt-2 flex justify-end pt-4 border-t border-outline-variant/30">
                          <button 
                            onClick={() => handleSelfAssign(inc)}
                            disabled={isSelfAssigning}
                            className="bg-sage-primary hover:bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">add_task</span> Self-Assign
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              
              {/* Main Incident & Calculation Panel */}
              <div className="md:col-span-7 flex flex-col gap-gutter">
                {/* Incident Context Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-variant transition-all duration-300 relative overflow-hidden fade-in-up stagger-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
                  <div className="relative z-10">
                    <h3 className="font-headline-lg text-headline-lg text-primary mb-4">Situation Context</h3>
                    <div className="font-body-lg text-body-lg text-charcoal-text italic border-l-4 border-earth-accent pl-4 mb-6">
                      {renderTranscript(incident?.raw_transcript || incident?.description)}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {incident?.hazards?.map((h: string, i: number) => (
                        <span key={i} className="bg-error/10 text-error px-4 py-2 rounded-full font-label-sm text-label-sm border border-error/20 uppercase">{h}</span>
                      ))}
                      {incident?.vulnerabilities?.map((v: string, i: number) => (
                        <span key={i} className="bg-earth-accent/10 text-earth-accent px-4 py-2 rounded-full font-label-sm text-label-sm border border-earth-accent/20 uppercase">{v}</span>
                      ))}
                      {incident?.required_capabilities?.map((c: string, i: number) => (
                        <span key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-label-sm text-label-sm border border-primary/20 uppercase">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Urgency Score Calculation */}
                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-variant transition-all duration-300 relative overflow-hidden fade-in-up stagger-3">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6 border-b border-surface-variant pb-4">
                      <h3 className="font-headline-lg text-headline-lg text-primary">Urgency Score</h3>
                      <div className={`flex items-end gap-1 ${incident?.urgency_score >= 80 ? 'text-error animate-pulse-slow' : incident?.urgency_score >= 50 ? 'text-earth-accent' : 'text-sage-primary'}`}>
                        <span className="font-display-lg text-display-lg leading-none">{incident?.urgency_score}</span>
                        <span className="font-body-md text-body-md text-on-surface-variant pb-1">/100</span>
                      </div>
                    </div>
                    <div className="space-y-4 font-body-md text-body-md">
                      {incident?.urgency_breakdown?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-surface p-4 rounded-lg shadow-sm border border-surface-variant/50">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span> {item.reason || item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responder Matching Panel (Volunteer View) */}
              <div className="md:col-span-5 flex flex-col gap-gutter">
                <div className="bg-surface-container/80 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-outline-variant/30 h-full relative overflow-hidden fade-in-up stagger-4">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                      <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                      <h3 className="font-headline-lg text-headline-lg text-primary">Your Match</h3>
                    </div>

                    <div className="bg-surface-container-lowest shadow-[0_20px_50px_-12px_rgba(74,93,78,0.25)] border border-sage-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-sage-primary to-primary"></div>
                      <div className="relative z-10">
                        <div className="absolute top-4 right-4 bg-sage-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">priority_high</span> Dispatched
                        </div>

                        <div className="flex items-start gap-5 mb-5 mt-2">
                          <div className="pt-1">
                            <h4 className="font-bold text-xl text-primary">Action Required</h4>
                            <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1 font-semibold">
                              <span className="material-symbols-outlined text-[16px] text-earth-accent">schedule</span> Urgent Response Requested
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={handleAccept}
                          disabled={isAccepting}
                          className={`mt-8 w-full h-[60px] text-white rounded-xl font-bold transition-all shadow-[0_4px_0_0_#1d2f22,0_8px_20px_-4px_rgba(29,47,34,0.4)] flex items-center justify-center gap-2 ${isAccepting ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-sage-primary hover:bg-primary active:scale-95'}`}
                        >
                          {isAccepting ? 'Accepting...' : (
                            <>
                              <span className="material-symbols-outlined">navigation</span> Accept & Navigate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
