import { getAI, getGenerativeModel } from "firebase/ai";
import { app } from "./firebase";

// Initialize AI service
// Note: Requires Firebase App Check and Vertex AI to be enabled in Production
let ai: any;
let jsonModel: any;

try {
  ai = getAI(app);
  jsonModel = getGenerativeModel(ai, {
    model: "gemini-2.5-flash-lite", // Using flash-lite for speed
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          peopleCount: { type: "integer", description: "Number of people affected" },
          isMedical: { type: "boolean", description: "Does the situation require medical attention?" },
          severity: { type: "string", enum: ["Critical", "High", "Medium", "Low"], description: "Severity of the incident" },
          vulnerabilities: { 
            type: "array", 
            items: { type: "string" },
            description: "E.g. elderly, children, disabled, pregnant, medical condition"
          },
          hazards: {
            type: "array",
            items: { type: "string" },
            description: "E.g. rising water, fire, structural damage, live wires"
          },
          requiredCapabilities: {
            type: "array",
            items: { type: "string" },
            description: "What responder equipment or skills are absolutely required (e.g. boat, first_aid, extraction_gear)"
          }
        },
        required: ["peopleCount", "isMedical", "severity", "vulnerabilities", "hazards", "requiredCapabilities"]
      }
    }
  });
} catch (e) {
  console.warn("Firebase AI not fully configured yet. Falling back to mock extraction.");
}

export interface ExtractedIncidentData {
  peopleCount: number;
  isMedical: boolean;
  severity: "Critical" | "High" | "Medium" | "Low";
  vulnerabilities: string[];
  hazards: string[];
  requiredCapabilities: string[];
}

export async function extractIncidentData(reportText: string): Promise<ExtractedIncidentData> {
  if (!jsonModel) {
    // Mock extraction for development without active Firebase
    return mockExtraction(reportText);
  }

  try {
    const prompt = `Analyze the following emergency report and extract the structured data requested in the schema.
    
    Report: "${reportText}"
    
    Guidelines:
    - requiredCapabilities should be hard constraints only (e.g., if there's water, require "boat". If medical, require "first_aid" or "paramedic").
    - If exact people count isn't specified, estimate 1.
    `;
    
    const result = await jsonModel.generateContent(prompt);
    return JSON.parse(result.response.text()) as ExtractedIncidentData;
  } catch (error) {
    console.error("AI Extraction failed, using fallback:", error);
    return mockExtraction(reportText);
  }
}

function mockExtraction(text: string): ExtractedIncidentData {
  const t = text.toLowerCase();
  return {
    peopleCount: t.match(/\d+/) ? parseInt(t.match(/\d+/)![0]) : 1,
    isMedical: t.includes("hurt") || t.includes("medic") || t.includes("bleed") || t.includes("breath"),
    severity: t.includes("trapped") || t.includes("fire") ? "Critical" : "High",
    vulnerabilities: t.includes("child") ? ["child"] : [],
    hazards: t.includes("water") ? ["rising water"] : [],
    requiredCapabilities: t.includes("water") ? ["boat"] : t.includes("fire") ? ["fire_extinguisher"] : []
  };
}
