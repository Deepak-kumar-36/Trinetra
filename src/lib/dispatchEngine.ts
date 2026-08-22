import { ExtractedIncidentData } from './aiExtraction';

export interface Responder {
  id: string;
  name: string;
  skills: string[];
  equipment: string[];
  vehicle: string;
  isAvailable: boolean;
  location: { lat: number; lng: number };
}

export interface DispatchRecommendation {
  responderId: string;
  responderName: string;
  score: number;
  etaMinutes: number;
  exclusionReason?: string; // If filtered out
}

/**
 * Calculates a deterministic urgency score (0-100) based on AI extracted data.
 */
export function calculateUrgencyScore(data: ExtractedIncidentData): { score: number; reasoning: string[] } {
  let score = 0;
  const reasoning: string[] = [];

  // Base score by severity
  switch (data.severity) {
    case 'Critical': score += 60; reasoning.push('Severity marked as Critical (+60)'); break;
    case 'High': score += 40; reasoning.push('Severity marked as High (+40)'); break;
    case 'Medium': score += 20; reasoning.push('Severity marked as Medium (+20)'); break;
    case 'Low': score += 5; reasoning.push('Severity marked as Low (+5)'); break;
  }

  // Medical needs
  if (data.isMedical) {
    score += 20;
    reasoning.push('Medical attention required (+20)');
  }

  // Vulnerabilities
  if (data.vulnerabilities.length > 0) {
    const vScore = data.vulnerabilities.length * 5;
    score += vScore;
    reasoning.push(`Vulnerabilities present: ${data.vulnerabilities.join(', ')} (+${vScore})`);
  }

  // Hazards
  if (data.hazards.length > 0) {
    const hScore = data.hazards.length * 5;
    score += hScore;
    reasoning.push(`Hazards present: ${data.hazards.join(', ')} (+${hScore})`);
  }

  // Cap at 100
  if (score > 100) score = 100;

  return { score, reasoning };
}

/**
 * Filters and ranks responders based on HARD capabilities, then ETA.
 */
export function rankResponders(
  incidentRequirements: string[],
  responders: Responder[],
  incidentLocation: { lat: number; lng: number }
): DispatchRecommendation[] {
  const recommendations: DispatchRecommendation[] = [];

  for (const responder of responders) {
    if (!responder.isAvailable) continue;

    // Check hard constraints
    const combinedCapabilities = [...responder.skills, ...responder.equipment, responder.vehicle];
    const missingCapabilities = incidentRequirements.filter(req => !combinedCapabilities.includes(req));

    // Mock ETA calculation (distance based)
    const distance = Math.sqrt(
      Math.pow(responder.location.lat - incidentLocation.lat, 2) + 
      Math.pow(responder.location.lng - incidentLocation.lng, 2)
    );
    const etaMinutes = Math.floor(distance * 100) + 2; // rough mock

    if (missingCapabilities.length > 0) {
      recommendations.push({
        responderId: responder.id,
        responderName: responder.name,
        score: 0,
        etaMinutes,
        exclusionReason: `Missing required capability: ${missingCapabilities.join(', ')}`
      });
    } else {
      // Passes hard constraints, calculate soft score (faster is better)
      const softScore = Math.max(100 - etaMinutes, 10);
      recommendations.push({
        responderId: responder.id,
        responderName: responder.name,
        score: softScore,
        etaMinutes
      });
    }
  }

  // Sort: Valid responders first (sorted by ETA/score), then excluded ones
  return recommendations.sort((a, b) => {
    if (a.exclusionReason && !b.exclusionReason) return 1;
    if (!a.exclusionReason && b.exclusionReason) return -1;
    return b.score - a.score;
  });
}
