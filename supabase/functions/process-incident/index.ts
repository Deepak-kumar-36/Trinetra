import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }

    // Supabase Webhook payload
    const payload = await req.json();
    const record = payload.record; // The newly inserted incident row

    if (!record || !record.id) {
      return new Response(JSON.stringify({ error: "No record found in payload" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const rawDescription = record.raw_transcript || record.description || record.title;

    if (!rawDescription) {
      return new Response(JSON.stringify({ message: "No text to process" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing Incident ${record.id} with description: ${rawDescription}`);

    // Call Groq API
    const systemPrompt = `You are a disaster response triage AI. Your job is to extract structured JSON from a raw emergency report.
You must return ONLY a JSON object and no other text.
Extract the following fields:
1. "category": enum ["medical", "flood", "fire", "structural", "voice_distress", "other"]
2. "hazards": array of strings (e.g. ["rising water", "electrical wire"])
3. "vulnerabilities": array of strings (e.g. ["child", "elderly", "disabled", "bleeding"])
4. "people_affected": integer (best guess, default 1)
5. "required_capabilities": array of strings (e.g. ["boat", "medical"])
`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Fast and capable model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Emergency Report: ${rawDescription}` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API Error:", errorText);
      throw new Error("Failed to extract data from Groq API");
    }

    const groqData = await groqResponse.json();
    const extractedText = groqData.choices[0].message.content;
    let extractedData;
    
    try {
      extractedData = JSON.parse(extractedText);
    } catch (e) {
      console.error("Failed to parse JSON from Groq:", extractedText);
      throw new Error("Invalid JSON from Groq");
    }

    console.log("Extracted Data:", extractedData);

    // DETERMINISTIC SCORING ENGINE
    let urgencyScore = 30; // base score

    if (extractedData.category === 'fire') urgencyScore += 20;
    const requiredCapabilities = Array.isArray(extractedData.required_capabilities)
      ? extractedData.required_capabilities
      : [];
    const peopleAffected = Number(extractedData.people_affected || extractedData.people_count || 1);

    if (extractedData.category === 'medical' || requiredCapabilities.includes('medical')) urgencyScore += 25;
    if (extractedData.category === 'voice_distress') urgencyScore += 30; // Auto-SOS is always high priority

    if (extractedData.hazards?.length > 0) urgencyScore += (extractedData.hazards.length * 5);
    if (extractedData.vulnerabilities?.length > 0) urgencyScore += (extractedData.vulnerabilities.length * 10);
    
    if (peopleAffected > 1) urgencyScore += Math.min(20, peopleAffected * 2);

    // Cap at 100
    urgencyScore = Math.min(100, urgencyScore);

    const urgencyBreakdown = [
      { reason: "Base incident score", points: 30 },
      { reason: `Category: ${extractedData.category}`, points: extractedData.category === 'fire' ? 20 : extractedData.category === 'voice_distress' ? 30 : 0 },
      { reason: "Medical capability required", points: extractedData.category === 'medical' || requiredCapabilities.includes('medical') ? 25 : 0 },
      { reason: "Hazards present", points: (extractedData.hazards?.length || 0) * 5 },
      { reason: "Vulnerabilities present", points: (extractedData.vulnerabilities?.length || 0) * 10 },
      { reason: "People affected", points: peopleAffected > 1 ? Math.min(20, peopleAffected * 2) : 0 },
    ];

    // Confidence Penalty Logic
    if (record.trigger_source === 'voice_keyword_auto' && record.trigger_confirmed !== true) {
      urgencyScore -= 20;
      urgencyBreakdown.push({ reason: "Unconfirmed auto-detection penalty", points: -20 });
    }

    // Write back to the incident
    const { error: updateError } = await supabase
      .from('incidents')
      .update({
        category: extractedData.category,
        hazards: extractedData.hazards || [],
        vulnerabilities: extractedData.vulnerabilities || [],
        people_affected: peopleAffected,
        required_capabilities: requiredCapabilities,
        urgency_score: urgencyScore,
        urgency_breakdown: urgencyBreakdown,
        status: 'prioritized'
      })
      .eq('id', record.id);

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      throw new Error("Failed to update incident in Supabase");
    }

    // 🚀 Trigger Matchmaking Function directly or let another Webhook handle it
    // For simplicity, we will invoke the match-responders function directly from here
    await supabase.functions.invoke('match-responders', {
      body: { incident_id: record.id }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      incident_id: record.id, 
      score: urgencyScore 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
