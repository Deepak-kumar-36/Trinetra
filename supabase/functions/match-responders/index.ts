import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple Haversine distance function
function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { incident_id } = await req.json();

    if (!incident_id) {
      throw new Error("incident_id is required");
    }

    // 1. Fetch Incident
    const { data: incident, error: incError } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', incident_id)
      .single();

    if (incError || !incident) {
      throw new Error("Incident not found");
    }

    // We need the location of the incident
    let incLat = 0;
    let incLon = 0;
    
    if (incident.location && incident.location.startsWith('POINT(')) {
      const match = incident.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
      if (match) {
        incLon = parseFloat(match[1]);
        incLat = parseFloat(match[2]);
      }
    }

    // 2. Fetch Available Responders
    const { data: responders, error: resError } = await supabase
      .from('responders')
      .select('*')
      .eq('availability', true)
      .is('current_mission_id', null);

    if (resError || !responders || responders.length === 0) {
      console.log("No available responders for incident:", incident_id);
      return new Response(JSON.stringify({ message: "No available responders" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const candidates = [];

    // 3. HARD CONSTRAINTS FILTER
    for (const responder of responders) {
      let failReason = null;

      // Rule 1: Must have a boat if the incident requires one
      const requiredCapabilities = incident.required_capabilities || [];

      if (requiredCapabilities.includes('boat') && responder.vehicle_type !== 'boat') {
        failReason = "Requires a boat";
      }

      // Rule 2: Must have medical training if strictly requested
      // (Assuming responder.skills is a JSON array of strings)
      if (requiredCapabilities.includes('medical') && !responder.skills?.includes('medical')) {
        failReason = "Requires medical training";
      }

      // Calculate distance if responder has location
      let resLat = 0;
      let resLon = 0;
      if (responder.location && responder.location.startsWith('POINT(')) {
        const match = responder.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
        if (match) {
          resLon = parseFloat(match[1]);
          resLat = parseFloat(match[2]);
        }
      }

      const distanceKm = getDistanceKM(incLat, incLon, resLat, resLon);
      const estimatedMinutes = Math.round((distanceKm / 40) * 60); // Assume avg 40km/h

      if (!failReason) {
        candidates.push({
          responder_id: responder.id,
          distance_km: distanceKm,
          estimated_eta_mins: estimatedMinutes,
          reasoning: `Matches capabilities (Distance: ${distanceKm.toFixed(1)}km, ETA: ${estimatedMinutes}m)`,
          fit_score: 100 - estimatedMinutes // Lower ETA = Higher Fit Score
        });
      }
    }

    if (candidates.length === 0) {
      console.log("No responders passed hard constraints for incident:", incident_id);
      return new Response(JSON.stringify({ message: "No qualified responders found" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 4. SOFT RANKING
    // Rank candidates by fit_score (highest first)
    candidates.sort((a, b) => b.fit_score - a.fit_score);

    // Pick top candidate
    const topCandidate = candidates[0];

    // 5. DISPATCH CREATION
    const { data: mission, error: dispatchError } = await supabase
      .from('missions')
      .insert({
        incident_id: incident.id,
        responder_id: topCandidate.responder_id,
        status: 'assigned',
        eta_minutes: topCandidate.estimated_eta_mins,
        match_score: topCandidate.fit_score,
        match_reasoning: {
          selected: topCandidate.reasoning,
          alternatives: candidates.slice(1, 4),
        },
      })
      .select('id')
      .single();

    if (dispatchError) {
      throw new Error("Failed to create dispatch record: " + dispatchError.message);
    }

    const { error: responderUpdateError } = await supabase
      .from('responders')
      .update({ current_mission_id: mission.id })
      .eq('id', topCandidate.responder_id);

    if (responderUpdateError) {
      throw new Error("Failed to update responder mission: " + responderUpdateError.message);
    }

    const { error: incidentUpdateError } = await supabase
      .from('incidents')
      .update({ status: 'assigned' })
      .eq('id', incident.id);

    if (incidentUpdateError) {
      throw new Error("Failed to update incident status: " + incidentUpdateError.message);
    }

    console.log(`Successfully queued dispatch for responder ${topCandidate.responder_id}`);

    return new Response(JSON.stringify({ success: true, matched_responder: topCandidate.responder_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Matchmaking Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
