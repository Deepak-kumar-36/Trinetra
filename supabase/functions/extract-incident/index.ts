import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    const aiProvider = Deno.env.get('AI_PROVIDER') || 'openai'; // 'openai' or 'anthropic' or 'gemini'
    let extractedData = null;

    // We implement a mock extraction logic if no API key is provided
    // In a real environment, you would use OpenAI, Anthropic, or Gemini APIs here.
    
    // Check if we have an OpenAI API Key
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: "json_object" },
          messages: [
            {
              role: 'system',
              content: `Analyze the emergency report and output JSON exactly matching this schema:
              {
                "peopleCount": number,
                "isMedical": boolean,
                "severity": "Critical" | "High" | "Medium" | "Low",
                "vulnerabilities": string[],
                "hazards": string[],
                "requiredCapabilities": string[]
              }`
            },
            {
              role: 'user',
              content: text
            }
          ]
        })
      });
      
      const data = await response.json();
      extractedData = JSON.parse(data.choices[0].message.content);
    } else {
      // Mock extraction fallback
      const t = text.toLowerCase();
      extractedData = {
        peopleCount: t.match(/\d+/) ? parseInt(t.match(/\d+/)![0]) : 1,
        isMedical: t.includes("hurt") || t.includes("medic") || t.includes("bleed") || t.includes("breath"),
        severity: t.includes("trapped") || t.includes("fire") ? "Critical" : "High",
        vulnerabilities: t.includes("child") ? ["child"] : [],
        hazards: t.includes("water") ? ["rising water"] : [],
        requiredCapabilities: t.includes("water") ? ["boat"] : t.includes("fire") ? ["fire_extinguisher"] : []
      };
    }

    return new Response(
      JSON.stringify(extractedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
