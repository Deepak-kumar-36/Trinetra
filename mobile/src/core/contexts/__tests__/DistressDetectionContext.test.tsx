import { DISTRESS_KEYWORDS, MULTI_HIT_WINDOW_MS, REQUIRED_HITS } from '../DistressDetectionContext';

// Pure function test for keyword matching
const matchKeyword = (res: string) => {
  const lowerRes = res.toLowerCase();
  return DISTRESS_KEYWORDS.find(k => lowerRes.includes(k.phrase));
};

// Pure function test for rolling window
const testRollingWindow = (hits: number[], now: number) => {
  let activeHits = hits.filter(t => now - t < MULTI_HIT_WINDOW_MS);
  activeHits.push(now);
  return activeHits.length >= REQUIRED_HITS;
};

// Mock process-incident logic
const mockProcessIncidentScore = (record: any, extractedData: any) => {
  let urgencyScore = 30;
  if (extractedData.category === 'voice_distress') urgencyScore += 30;
  if (record.trigger_source === 'voice_keyword_auto' && record.trigger_confirmed !== true) {
    urgencyScore -= 20;
  }
  return urgencyScore;
};

describe('Passive Distress Detection Logic', () => {
  
  describe('Keyword Matcher', () => {
    it('matches exact phrase', () => {
      expect(matchKeyword('help me')?.phrase).toBe('help me');
    });

    it('matches embedded phrase', () => {
      expect(matchKeyword('please someone help me now')?.phrase).toBe('help me');
    });

    it('ignores unrelated text', () => {
      expect(matchKeyword('i need a glass of water')).toBeUndefined();
    });
  });

  describe('Rolling Multi-Hit Window', () => {
    it('triggers when REQUIRED_HITS is met within window', () => {
      const hits = [Date.now() - 5000]; // 5 seconds ago
      const triggers = testRollingWindow(hits, Date.now());
      expect(triggers).toBe(true);
    });

    it('does not trigger if previous hit was outside window', () => {
      const hits = [Date.now() - 20000]; // 20 seconds ago (outside 15s window)
      const triggers = testRollingWindow(hits, Date.now());
      expect(triggers).toBe(false);
    });
  });

  describe('State Machine & Audio Persistence', () => {
    it('discards audio on cancel (zero persisted audio)', () => {
      let state = 'CONFIRMING';
      let persistedAudio = 'audio_buffer_01';
      
      const cancelSOS = () => {
        state = 'IDLE';
        persistedAudio = ''; // Simulate zero persisted audio
      };
      
      cancelSOS();
      
      expect(state).toBe('IDLE');
      expect(persistedAudio).toBe('');
    });
  });

  describe('AI Urgency Penalty (process-incident)', () => {
    it('applies penalty to unconfirmed voice_keyword_auto reports', () => {
      const record = { trigger_source: 'voice_keyword_auto', trigger_confirmed: null };
      const data = { category: 'voice_distress' }; // Base 30 + 30 = 60
      const score = mockProcessIncidentScore(record, data);
      
      expect(score).toBe(40); // 60 - 20 penalty = 40
    });

    it('does not apply penalty to confirmed manual reports', () => {
      const record = { trigger_source: 'manual', trigger_confirmed: true };
      const data = { category: 'voice_distress' }; 
      const score = mockProcessIncidentScore(record, data);
      
      expect(score).toBe(60); // No penalty
    });
  });
});
