import { createClient } from '@supabase/supabase-js';

// The remote supabase project we pushed to
const supabaseUrl = 'https://ktoyfgxbfmnhdqktyfcj.supabase.co';
const supabaseKey = 'sb_publishable__aRkbsIitW_fCi-Z_G65lg_cn_ws9u3'; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log("=== Matching Engine Verification ===");

  // 1. Fetch any incident
  const { data: incidents, error: incErr } = await supabase.from('incidents').select('id, required_capabilities, location').limit(1);
  
  if (incErr) {
    console.error("Error fetching incidents:", incErr);
    return;
  }

  if (incidents.length === 0) {
    console.log("No incidents found in DB. You need to create an incident first via the UI or seed data.");
    return;
  }

  const incidentId = incidents[0].id;
  console.log(`Testing with Incident ID: ${incidentId}`);
  console.log(`Required Capabilities:`, incidents[0].required_capabilities);
  console.log(`Location:`, incidents[0].location);

  // 2. Test calculate_urgency
  console.log("\n-> Testing calculate_urgency...");
  const { data: urgencyScore, error: uErr } = await supabase.rpc('calculate_urgency', { p_incident_id: incidentId });
  
  if (uErr) {
    console.error("RPC Error (calculate_urgency):", uErr);
  } else {
    console.log("Returned Urgency Score:", urgencyScore);
    
    // Check if it actually updated the row
    const { data: updatedIncident } = await supabase.from('incidents').select('urgency_score, urgency_band, urgency_breakdown').eq('id', incidentId).single();
    console.log("Updated Incident in DB:", updatedIncident);
  }

  // 3. Test get_recommended_responders
  console.log("\n-> Testing get_recommended_responders...");
  const { data: responders, error: rErr } = await supabase.rpc('get_recommended_responders', { p_incident_id: incidentId });
  
  if (rErr) {
    console.error("RPC Error (get_recommended_responders):", rErr);
  } else {
    console.log(`Returned ${responders?.length || 0} recommended responders:`);
    console.log(responders);
  }
}

runTests();
