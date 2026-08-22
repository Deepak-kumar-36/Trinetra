import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const CoordinatorOperations: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [activeDispatchId, setActiveDispatchId] = useState<string | null>(null);
  const [dispatchedIncidents, setDispatchedIncidents] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchIncidents = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setIncidents(data);
      }
    };

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
              <div key={incident.id} className="bg-surface/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${incident.urgencyScore >= 80 ? 'bg-error animate-pulse' : incident.urgencyScore >= 50 ? 'bg-earth-accent' : 'bg-sage-primary'}`}></span>
                    <span className="font-bold text-on-surface">Score: {incident.urgencyScore}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md ${dispatchedIncidents[incident.id] ? 'bg-sage-primary/20 text-sage-primary font-bold' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {dispatchedIncidents[incident.id] ? 'Assigned' : incident.status || 'Received'}
                  </span>
                </div>
                
                <p className="text-on-surface font-body-md line-clamp-2">{incident.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {incident.aiStructuredData?.hazards?.map((h: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase bg-error/10 text-error px-2 py-0.5 rounded-sm border border-error/20">{h}</span>
                  ))}
                  {incident.aiStructuredData?.vulnerabilities?.map((v: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-sm border border-secondary/20">{v}</span>
                  ))}
                  {incident.aiStructuredData?.requiredCapabilities?.map((c: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-sm border border-primary/20">{c}</span>
                  ))}
                </div>
                
                {incident.isMedical && (
                  <div className="text-xs text-error font-bold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px]">medical_services</span> Medical Attention Required
                  </div>
                )}
                
                {dispatchedIncidents[incident.id] ? (
                  <div className="mt-2 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-sm font-bold text-sage-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Dispatched: {dispatchedIncidents[incident.id]}
                    </span>
                  </div>
                ) : activeDispatchId === incident.id ? (
                  <div className="mt-2 pt-3 border-t border-outline-variant/20 flex flex-col gap-2 animate-fade-in">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Select Unit to Deploy</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setDispatchedIncidents(prev => ({ ...prev, [incident.id]: 'Medical Rescue Alpha' }));
                          setActiveDispatchId(null);
                        }}
                        className="p-2 bg-error/10 text-error hover:bg-error/20 border border-error/20 rounded-lg text-sm font-medium transition-colors text-left"
                      >
                        Medical Alpha
                      </button>
                      <button 
                        onClick={() => {
                          setDispatchedIncidents(prev => ({ ...prev, [incident.id]: 'Boat Unit 4' }));
                          setActiveDispatchId(null);
                        }}
                        className="p-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-lg text-sm font-medium transition-colors text-left"
                      >
                        Boat Unit 4
                      </button>
                      <button 
                        onClick={() => {
                          setDispatchedIncidents(prev => ({ ...prev, [incident.id]: 'Search & Rescue Charlie' }));
                          setActiveDispatchId(null);
                        }}
                        className="p-2 bg-earth-accent/10 text-earth-accent hover:bg-earth-accent/20 border border-earth-accent/20 rounded-lg text-sm font-medium transition-colors text-left col-span-2"
                      >
                        S&R Charlie (Ground)
                      </button>
                    </div>
                    <button onClick={() => setActiveDispatchId(null)} className="text-xs text-on-surface-variant text-center mt-2 hover:text-on-surface underline">Cancel</button>
                  </div>
                ) : (
                  <div className="mt-2 pt-3 border-t border-outline-variant/20 flex justify-end">
                    <button 
                      onClick={() => setActiveDispatchId(incident.id)}
                      className="text-primary font-label-sm uppercase tracking-wider hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors active:scale-95 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span> Assign Task
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};
