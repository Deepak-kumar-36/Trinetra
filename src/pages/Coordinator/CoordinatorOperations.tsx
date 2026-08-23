import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { generateUUID } from '../../lib/utils';

export const CoordinatorOperations: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [dispatchedIncidents] = useState<Record<string, string>>({});

  const renderTranscript = (transcript: string) => {
    if (!transcript) return 'Emergency Reported';
    try {
      const data = JSON.parse(transcript);
      if (data.type === 'photo_report' && data.url) {
        return (
          <div className="flex items-center gap-2 mt-1 mb-2 text-primary font-bold">
            <span className="material-symbols-outlined text-[18px]">photo_camera</span> Photo Report Attached
          </div>
        );
      }
    } catch (e) {
      // Not JSON
    }
    return <p className="text-on-surface font-body-md line-clamp-2">{transcript}</p>;
  };
  
  // Dispatch Modal State
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [recommendedResponders, setRecommendedResponders] = useState<any[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [dispatchTab, setDispatchTab] = useState<'resources' | 'volunteers'>('resources');

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (!error && data) {
      setIncidents(data);
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => {
          fetchIncidents(); // re-fetch on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDispatchClick = async (incident: any) => {
    setSelectedIncident(incident);
    setDispatchTab('resources');
    setIsDispatching(true);
    setRecommendedResponders([]);
    
    // Call Postgres function to get matching responders
    const { data, error } = await supabase.rpc('get_recommended_responders', {
      p_incident_id: incident.id
    });
    
    if (error) {
      console.error("Error fetching responders:", error);
      setIsDispatching(false);
    } else {
      let responders = data || [];
      if (responders.length === 0) {
        // Fallback for hackathon demo if no users are registered
        responders = [{
          responder_id: 'mock-volunteer-1',
          full_name: 'Local Volunteer Team (Demo)',
          match_score: 85,
          eta_minutes: 12,
          distance_meters: 2500,
          missing_capabilities: []
        }];
      }
      setRecommendedResponders(responders);
      setIsDispatching(false);
    }
  };

  const handleResourceDispatch = async (resourceType: string) => {
    if (!selectedIncident || !user) return;
    setIsAssigning(true);
    
    // Create notification for the citizen
    if (selectedIncident.reporter_id) {
      await supabase.from('notifications').insert([{
        user_id: selectedIncident.reporter_id,
        type: 'resource_dispatched',
        priority: 'high',
        related_incident_id: selectedIncident.id,
        message: `The Coordinator has dispatched ${resourceType} to your location. Stay calm, help is on the way!`,
      }]);
    }
    
    // Update incident status
    await supabase.from('incidents').update({ status: 'assigned' }).eq('id', selectedIncident.id);
    
    setIsAssigning(false);
    setSelectedIncident(null);
    fetchIncidents();
  };

  const handleAssign = async (responderId: string) => {
    if (!selectedIncident || !user) return;
    setIsAssigning(true);
    
    const coordinatorId = generateUUID(user.uid);
    
    // Create mission
    const { error: missionError } = await supabase.from('missions').insert([{
      incident_id: selectedIncident.id,
      responder_id: responderId,
      assigned_by: coordinatorId,
      status: 'assigned'
    }]);
    
    if (missionError) {
      console.error("Failed to assign mission:", missionError);
      setIsAssigning(false);
      return;
    }
    
    // Create notification for the citizen
    if (selectedIncident.reporter_id) {
      await supabase.from('notifications').insert([{
        user_id: selectedIncident.reporter_id,
        type: 'resource_dispatched',
        priority: 'high',
        related_incident_id: selectedIncident.id,
        message: `The Coordinator has dispatched a Volunteer Team to your location. Stay calm, help is on the way!`,
      }]);
    }
    
    // Update incident status
    await supabase.from('incidents').update({ status: 'assigned' }).eq('id', selectedIncident.id);
    
    setIsAssigning(false);
    setSelectedIncident(null);
    fetchIncidents(); // Refresh queue
  };

  return (
    <div className="text-on-surface font-body-lg min-h-screen flex flex-col items-center relative bg-background">
      <header className="bg-surface/50 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center w-full px-margin-mobile h-touch-target fixed top-0 z-40">
        <button className="text-primary hover:bg-surface-container-low transition-colors opacity-70 w-[88px] h-[88px] flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}>menu</span>
        </button>
        <h1 className="font-display-lg text-headline-lg flex items-center tracking-tight">
          <span className="text-[#FF9933]">t</span>
          <span className="text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">r</span>
          <span className="text-[#138808]">i</span>
          <span className="font-bold text-primary uppercase ml-1">NETRA</span>
        </h1>
        <button className="text-primary hover:bg-surface-container-low transition-colors opacity-70 w-[88px] h-[88px] flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}>notifications</span>
        </button>
      </header>

      <main className="w-full max-w-[600px] mt-touch-target mb-[120px] px-margin-mobile py-gutter flex flex-col gap-6 h-full z-10">
        {/* Threat Level / Disaster Rating Bar */}
        <div className="w-full bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-4 shadow-sm border border-outline-variant/30 mt-2 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">Disaster Threat Level</span>
              <span className="font-display-lg text-error leading-none flex items-center gap-2">High <span className="w-3 h-3 rounded-full bg-error animate-pulse-slow"></span></span>
            </div>
            <div className="text-right">
              <span className="font-headline-lg text-on-surface leading-none block">85<span className="text-body-md text-on-surface-variant">/100</span></span>
            </div>
          </div>
          {/* Rating Bar */}
          <div className="w-full h-3 bg-surface-variant/50 rounded-full overflow-hidden flex">
            <div className="h-full bg-error w-[85%] rounded-full opacity-80 transition-all duration-1000 ease-out"></div>
          </div>
          {/* Urgency Engine Factors */}
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="px-2 py-1 bg-error/10 text-error text-[12px] font-bold rounded-md border border-error/20 backdrop-blur-sm transition-all hover:bg-error/20">Threat to Life: 90</span>
            <span className="px-2 py-1 bg-sage-primary/10 text-sage-primary text-[12px] font-bold rounded-md border border-sage-primary/20 backdrop-blur-sm transition-all hover:bg-sage-primary/20">Medical: 80</span>
            <span className="px-2 py-1 bg-on-surface-variant/10 text-on-surface text-[12px] font-bold rounded-md border border-outline-variant/30 backdrop-blur-sm transition-all hover:bg-on-surface-variant/20">Property: 40</span>
          </div>
        </div>

        {/* Live Incidents Feed */}
        <section className="flex flex-col gap-4 mt-2 flex-1">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Live Incidents Queue</h2>
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-xs font-bold">{incidents.length} Active</span>
          </div>
          
          {incidents.length === 0 ? (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 text-center text-on-surface-variant">
              No active incidents in the database.
            </div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.id} className={`bg-surface/80 backdrop-blur-md rounded-xl p-5 shadow-sm border ${incident.status === 'assigned' ? 'border-sage-primary/50 opacity-75' : 'border-outline-variant/30'} flex flex-col gap-3 transition-all`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${incident.category === 'voice_distress' ? 'bg-error text-white animate-pulse' : 'bg-primary/10 text-primary'}`}>
                      {incident.category || 'Emergency'}
                    </span>
                    {(incident.urgency_score || incident.urgencyScore) && (
                      <>
                        <span className={`w-3 h-3 rounded-full ${(incident.urgency_score || incident.urgencyScore) >= 80 ? 'bg-error animate-pulse' : (incident.urgency_score || incident.urgencyScore) >= 50 ? 'bg-earth-accent' : 'bg-sage-primary'}`}></span>
                        <span className="font-bold text-on-surface text-sm">Score: {incident.urgency_score || incident.urgencyScore}</span>
                      </>
                    )}
                  </div>
                  <span className="text-on-surface-variant text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {incident.created_at ? new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                  </span>
                </div>
                
                <h3 className="font-headline-sm text-on-surface mb-2 truncate">
                  {incident.reporter_id ? 'Citizen Report' : 'Anonymous Report'}
                </h3>
                
                <div className="mb-4">
                  {renderTranscript(incident.raw_transcript || incident.description)}
                </div>

                <p className="text-on-surface-variant font-body-sm flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> Citizen Location: Lat 28.6139, Lng 77.2090
                </p>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {incident.hazards?.map((h: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase bg-error/10 text-error px-2 py-0.5 rounded-sm border border-error/20">{h}</span>
                  ))}
                  {incident.vulnerabilities?.map((v: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-sm border border-secondary/20">{v}</span>
                  ))}
                  {incident.required_capabilities?.map((c: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-sm border border-primary/20">{c}</span>
                  ))}
                </div>
                
                {(incident.vulnerabilities?.includes('medical') || incident.required_capabilities?.includes('medical')) && (
                  <div className="text-xs text-error font-bold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px]">medical_services</span> Medical Attention Required
                  </div>
                )}
                
                {incident.status === 'assigned' || dispatchedIncidents[incident.id] ? (
                  <div className="mt-2 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-sm font-bold text-sage-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Dispatched {dispatchedIncidents[incident.id] ? `: ${dispatchedIncidents[incident.id]}` : ''}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 pt-3 border-t border-outline-variant/20 flex justify-end">
                    <button 
                      onClick={() => handleDispatchClick(incident)}
                      className="text-primary font-label-sm uppercase tracking-wider hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors active:scale-95 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span> Dispatch Team
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      {/* Dispatch Assignment Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={() => setSelectedIncident(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full sm:w-[500px] sm:max-h-[85vh] max-h-[90vh] bg-surface rounded-t-3xl sm:rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.3)] animate-slide-in-up flex flex-col overflow-hidden border border-outline-variant/30">
            {/* Header */}
            <div className="p-6 pb-0 border-b border-outline-variant/30 bg-surface-container-lowest sticky top-0 z-10 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-headline-sm text-primary tracking-tight">Dispatch Resources</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Incident Score: {selectedIncident.urgency_score}</p>
                </div>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 -mr-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant active:scale-95"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDispatchTab('resources')}
                  className={`pb-3 px-2 font-bold text-sm tracking-wide transition-colors ${dispatchTab === 'resources' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Government Resources
                </button>
                <button 
                  onClick={() => setDispatchTab('volunteers')}
                  className={`pb-3 px-2 font-bold text-sm tracking-wide transition-colors ${dispatchTab === 'volunteers' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Volunteer Teams
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {dispatchTab === 'resources' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleResourceDispatch('an Ambulance')}
                    disabled={isAssigning}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-earth-accent hover:shadow-md transition-all active:scale-95 text-charcoal-text disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl text-earth-accent">ambulance</span>
                    <span className="font-bold text-sm uppercase tracking-wide text-center">Dispatch Ambulance</span>
                  </button>
                  <button 
                    onClick={() => handleResourceDispatch('Fire Department')}
                    disabled={isAssigning}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-error hover:shadow-md transition-all active:scale-95 text-charcoal-text disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl text-error">local_fire_department</span>
                    <span className="font-bold text-sm uppercase tracking-wide text-center">Fire Department</span>
                  </button>
                  <button 
                    onClick={() => handleResourceDispatch('Police Department')}
                    disabled={isAssigning}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-primary hover:shadow-md transition-all active:scale-95 text-charcoal-text disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl text-primary">local_police</span>
                    <span className="font-bold text-sm uppercase tracking-wide text-center">Police Department</span>
                  </button>
                  <button 
                    onClick={() => handleResourceDispatch('Medicines & Medical Supplies')}
                    disabled={isAssigning}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-sage-primary hover:shadow-md transition-all active:scale-95 text-charcoal-text disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl text-sage-primary">medical_services</span>
                    <span className="font-bold text-sm uppercase tracking-wide text-center">Dispatch Medicines</span>
                  </button>
                  <button 
                    onClick={() => handleResourceDispatch('Relief Supplies (Food/Water)')}
                    disabled={isAssigning}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-[#FF9933] hover:shadow-md transition-all active:scale-95 text-charcoal-text disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl text-[#FF9933]">inventory_2</span>
                    <span className="font-bold text-sm uppercase tracking-wide text-center">Dispatch Supplies</span>
                  </button>
                  <button 
                    onClick={() => handleResourceDispatch('Specialized Rescue Teams')}
                    disabled={isAssigning}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-on-surface hover:shadow-md transition-all active:scale-95 text-charcoal-text disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-4xl text-on-surface">groups</span>
                    <span className="font-bold text-sm uppercase tracking-wide text-center">Other Rescue Teams</span>
                  </button>
                </div>
              ) : isDispatching ? (
                <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-4">
                  <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                  <p>Running matching algorithm...</p>
                </div>
              ) : recommendedResponders.length === 0 ? (
                <div className="bg-error-container text-on-error-container p-6 rounded-xl text-center">
                  <span className="material-symbols-outlined text-[32px] mb-2">warning</span>
                  <p className="font-bold">No available responders found.</p>
                  <p className="text-sm mt-1">Try expanding the search radius or bypassing requirements.</p>
                </div>
              ) : (
                recommendedResponders.map((responder) => {
                  const isPerfectMatch = responder.missing_capabilities?.length === 0;
                  return (
                    <div 
                      key={responder.responder_id} 
                      className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${isPerfectMatch ? 'border-sage-primary/50 bg-sage-primary/5' : 'border-outline-variant/50 bg-surface-container-lowest'}`}
                    >
                      {isPerfectMatch && (
                        <div className="absolute top-0 right-0 bg-sage-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">
                          Top Match
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-on-surface text-lg">{responder.full_name}</h3>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">directions_car</span> ETA: {responder.eta_minutes} mins ({(responder.distance_meters / 1000).toFixed(1)}km)
                          </p>
                        </div>
                        <div className="bg-surface-container text-primary px-3 py-1 rounded-lg text-center shadow-inner border border-outline-variant/30">
                          <span className="block text-[10px] font-bold uppercase text-on-surface-variant">Match</span>
                          <span className="font-display-sm leading-none">{Math.round(responder.match_score)}%</span>
                        </div>
                      </div>

                      {!isPerfectMatch && responder.missing_capabilities?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[11px] text-error font-bold uppercase tracking-wider mb-1">Missing Requirements:</p>
                          <div className="flex flex-wrap gap-1">
                            {responder.missing_capabilities.map((cap: string, i: number) => (
                              <span key={i} className="text-[10px] bg-error/10 text-error px-1.5 py-0.5 rounded-sm border border-error/20">{cap}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => handleAssign(responder.responder_id)}
                        disabled={isAssigning}
                        className={`w-full py-3 rounded-xl font-bold tracking-wide uppercase text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${isAssigning ? 'opacity-50 cursor-not-allowed bg-surface-variant text-on-surface-variant' : 'bg-primary text-white hover:bg-primary/90 shadow-sm'}`}
                      >
                        {isAssigning ? 'Assigning...' : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">send</span> Assign Mission
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
