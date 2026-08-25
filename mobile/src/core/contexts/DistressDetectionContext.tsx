import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, AppState, type EventSubscription } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import * as Vosk from 'react-native-vosk';

interface KeywordConfig {
  phrase: string;
  locale: string;
}

export const DISTRESS_KEYWORDS: KeywordConfig[] = [
  { phrase: 'help', locale: 'en' },
  { phrase: 'help me', locale: 'en' },
  { phrase: 'save me', locale: 'en' },
  { phrase: 'emergency', locale: 'en' },
  { phrase: 'bachao', locale: 'hi' },
  { phrase: 'madad', locale: 'hi' },
];

export const MULTI_HIT_WINDOW_MS = 15000; // 15s window to require multiple hits
export const REQUIRED_HITS = 2; // Must hear the phrase twice in 15s to trigger
const COUNTDOWN_SECONDS = 15;

const LISTENING_WINDOW_MS = 6000; // Listen for 6s
const LISTENING_PAUSE_MS = 2000;  // Pause for 2s to save battery/CPU

interface DistressDetectionContextType {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  phase: 'IDLE' | 'CONFIRMING' | 'SUBMITTING';
  countdown: number;
  lastHeard: string;
  cancelSOS: () => void;
  testTrigger: () => void;
}

const DistressDetectionContext = createContext<DistressDetectionContextType>({
  enabled: false,
  setEnabled: () => {},
  phase: 'IDLE',
  countdown: COUNTDOWN_SECONDS,
  lastHeard: '',
  cancelSOS: () => {},
  testTrigger: () => {},
});

export const useVoiceDistress = (initialEnabled: boolean) => {
  const context = useContext(DistressDetectionContext);
  const enabled = context.enabled || initialEnabled;

  return {
    isListening: enabled && context.phase === 'IDLE',
    countdown: context.phase === 'CONFIRMING' ? context.countdown : null,
    cancelCountdown: context.cancelSOS,
    isSupported: true
  };
};

export const DistressDetectionProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
  initialEnabled: boolean;
}> = ({ children, userId, initialEnabled }) => {
  const [enabled, setEnabledState] = useState(initialEnabled ?? false);
  const [phase, setPhase] = useState<'IDLE' | 'CONFIRMING' | 'SUBMITTING'>('IDLE');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [lastHeard, setLastHeard] = useState('');
  const [matchedKeyword, setMatchedKeyword] = useState<string | null>(null);

  const isModelLoaded = useRef(false);
  const hitTimestamps = useRef<number[]>([]);
  const listeningCycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listeningWindowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultSubscription = useRef<EventSubscription | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);

  // Sync settings to backend
  const setEnabled = async (v: boolean) => {
    setEnabledState(v);
    try {
      await supabase.from('users').update({ distress_detection_enabled: v }).eq('id', userId);
    } catch (e) {
      console.error(e);
    }
  };

  // App lifecycle for foreground constraint
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  // Vosk Engine Setup
  useEffect(() => {
    Vosk.loadModel('vosk-model-small-en-us')
      .then(() => {
        isModelLoaded.current = true;
      })
      .catch((e: any) => {
        console.error("Vosk model failed to load:", e);
      });

    return () => {
      stopListeningCycle();
      resultSubscription.current?.remove();
      Vosk.unload();
    };
  }, []);

  // Match keyword logic
  const handleVoskResult = useCallback((res: string) => {
    if (phase !== 'IDLE') return;
    
    const lowerRes = res.toLowerCase();
    const matched = DISTRESS_KEYWORDS.find(k => lowerRes.includes(k.phrase));
    
    if (matched) {
      const now = Date.now();
      hitTimestamps.current = hitTimestamps.current.filter(t => now - t < MULTI_HIT_WINDOW_MS);
      hitTimestamps.current.push(now);

      setLastHeard(`Detected "${matched.phrase}" (${hitTimestamps.current.length}/${REQUIRED_HITS})`);

      if (hitTimestamps.current.length >= REQUIRED_HITS) {
        triggerConfirmation(matched.phrase);
      }
    } else if (res.length > 0) {
      setLastHeard(`Heard: ${res}`);
    }
  }, [phase]);

  // Handle Listening Cycles
  useEffect(() => {
    // Stop engine if disabled or not in foreground
    if (!enabled || appState !== 'active' || phase !== 'IDLE') {
      stopListeningCycle();
      return;
    }

    if (enabled && appState === 'active' && phase === 'IDLE' && isModelLoaded.current) {
      startListeningCycle();
    }

    return () => {
      stopListeningCycle();
    };
  }, [enabled, appState, phase]);

  const startListeningCycle = () => {
    if (resultSubscription.current) return;
    
    const cycle = async () => {
      if (appState !== 'active' || !enabled || phase !== 'IDLE') return;
      
      try {
        await Vosk.start({
          grammar: [...DISTRESS_KEYWORDS.map((keyword) => keyword.phrase), '[unk]'],
          timeout: LISTENING_WINDOW_MS,
        });
        
        // Listen for a window
        listeningWindowTimer.current = setTimeout(() => {
          Vosk.stop();
          
          // Pause and restart
          listeningCycleTimer.current = setTimeout(cycle, LISTENING_PAUSE_MS);
        }, LISTENING_WINDOW_MS);
        
      } catch (e) {
        console.warn("Vosk cycle error", e);
        listeningCycleTimer.current = setTimeout(cycle, LISTENING_PAUSE_MS);
      }
    };

    resultSubscription.current = Vosk.onResult(handleVoskResult);
    cycle();
  };

  const stopListeningCycle = async () => {
    if (listeningWindowTimer.current) {
      clearTimeout(listeningWindowTimer.current);
      listeningWindowTimer.current = null;
    }
    if (listeningCycleTimer.current) {
      clearTimeout(listeningCycleTimer.current);
      listeningCycleTimer.current = null;
    }
    resultSubscription.current?.remove();
    resultSubscription.current = null;

    try {
      Vosk.stop();
    } catch(e) {}
  };

  // Countdown timer for CONFIRMING phase
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (phase === 'CONFIRMING') {
      interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            submitReport();
            return COUNTDOWN_SECONDS;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  const submitReport = async () => {
    setPhase('SUBMITTING');
    
    try {
      await supabase.from('incidents').insert({
        reporter_id: userId,
        status: 'reported',
        category: 'general', // Edge Function parses this to voice_distress
        trigger_source: 'voice_keyword_auto',
        trigger_confirmed: null,
        raw_transcript: JSON.stringify({ type: 'voice_keyword_auto', detail: matchedKeyword }),
        location: `POINT(77.2090 28.6139)`, // Default to New Delhi for MVP
      });
    } catch (err) {
      console.error('Incident submission failed:', err);
    } finally {
      setPhase('IDLE');
      setCountdown(COUNTDOWN_SECONDS);
      setMatchedKeyword(null);
      hitTimestamps.current = [];
    }
  };

  const triggerConfirmation = (keyword: string) => {
    if (phase !== 'IDLE') return;
    setMatchedKeyword(keyword);
    setPhase('CONFIRMING');
    setCountdown(COUNTDOWN_SECONDS);
  };

  const cancelSOS = () => {
    setPhase('IDLE');
    setCountdown(COUNTDOWN_SECONDS);
    setMatchedKeyword(null);
    hitTimestamps.current = [];
  };

  const testTrigger = () => {
    triggerConfirmation('__test_keyword__');
  };

  return (
    <DistressDetectionContext.Provider
      value={{
        enabled,
        setEnabled,
        phase,
        countdown,
        lastHeard,
        cancelSOS,
        testTrigger,
      }}
    >
      {children}

      {/* Confirmation Modal */}
      <Modal visible={phase === 'CONFIRMING'} transparent animationType="fade">
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-white rounded-3xl p-8 items-center shadow-xl">
            <View className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <MaterialIcons name="mic" size={56} color="#dc2626" />
            </View>
            <Text className="text-3xl font-bold text-red-600 mb-2">Distress Detected</Text>
            <Text className="text-center text-gray-600 mb-6">
              A voice keyword ({matchedKeyword}) triggered an emergency SOS. Authorities will be notified in...
            </Text>
            <Text className="text-8xl font-extrabold text-red-600 mb-8 tracking-tighter">
              {countdown}
            </Text>
            <TouchableOpacity 
              onPress={cancelSOS}
              className="w-full h-16 bg-gray-200 rounded-full flex items-center justify-center active:scale-95"
            >
              <Text className="text-gray-700 font-bold text-xl uppercase tracking-widest">
                Cancel — I'm OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </DistressDetectionContext.Provider>
  );
};
