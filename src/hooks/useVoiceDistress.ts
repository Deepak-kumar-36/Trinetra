import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { generateUUID } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

// Define the speech recognition interface since it's non-standard
interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

const DISTRESS_KEYWORDS = [
  'help', 'help me', 'bachao', 'emergency', 'save me', 'i need help',
  'call the police', 'please help', 'someone help'
];

// Max consecutive restarts before we give up (prevents infinite crash loops on Android)
const MAX_RESTARTS = 5;
const RESTART_DELAY_MS = 1500; // Delay before restarting recognition to avoid overwhelming Android AudioRecord

export function useVoiceDistress(isActive: boolean) {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Timer ref to manage the countdown interval
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRestartingRef = useRef(false);
  const restartCountRef = useRef(0);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(isActive);

  // Keep a ref in sync with the prop so callbacks always see the latest value
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const triggerSOS = useCallback(() => {
    if (!user) return;
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const reporter_id = generateUUID(user.uid);
          
          await supabase.from('users').upsert([{
            id: reporter_id,
            role: 'citizen',
            full_name: user.displayName || user.email || 'Citizen'
          }], { onConflict: 'id' });

          await supabase.from('incidents').insert([{
            reporter_id,
            status: 'reported',
            category: 'voice_distress',
            raw_transcript: `Passive SOS Triggered via Voice Distress!`,
            people_affected: 1,
            hazards: [],
            urgency_score: 100, // Maximum urgency
            urgency_band: 'critical',
            urgency_breakdown: [{ reason: 'Triggered via Passive Voice Distress (+100)' }],
            location: `POINT(${lon} ${lat})`
          }]);

          // Also write to localStorage for instant cross-tab sync
          const newIncident = {
            id: Date.now(),
            pos: [lat, lon],
            title: 'Voice SOS',
            severity: 'Critical',
            urgency_band: 100,
            category: 'voice_distress',
            trigger_source: 'voice_keyword_auto',
            raw_transcript: JSON.stringify({ detail: 'voice_keyword', type: 'voice_distress' })
          };
          const existing = JSON.parse(localStorage.getItem('trinetra_live_incidents') || '[]');
          localStorage.setItem('trinetra_live_incidents', JSON.stringify([...existing, newIncident]));
          window.dispatchEvent(new Event('storage'));
        },
        async (err) => {
          console.warn("GPS failed for voice distress", err);
          // Fallback to static location
          const reporter_id = generateUUID(user.uid);
          await supabase.from('users').upsert([{
            id: reporter_id,
            role: 'citizen',
            full_name: user.displayName || user.email || 'Citizen'
          }], { onConflict: 'id' });

          await supabase.from('incidents').insert([{
            reporter_id,
            status: 'reported',
            category: 'voice_distress',
            raw_transcript: `Passive SOS Triggered via Voice Distress! (No GPS)`,
            people_affected: 1,
            hazards: [],
            urgency_score: 100,
            urgency_band: 'critical',
            urgency_breakdown: [{ reason: 'Triggered via Passive Voice Distress (+100)' }],
            location: `POINT(77.2090 28.6139)`
          }]);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [user]);

  const startCountdown = useCallback(() => {
    if (timerRef.current) return; // Already counting down
    
    setCountdown(7);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          triggerSOS();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [triggerSOS]);

  const cancelCountdown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      // Clean up everything when deactivated
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) { /* ignore */ }
        recognitionRef.current = null;
      }
      isRestartingRef.current = false;
      restartCountRef.current = 0;
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; // Use interim to catch phrases quickly
    recognition.lang = 'en-US';
    
    recognitionRef.current = recognition;
    restartCountRef.current = 0;

    recognition.onresult = (event) => {
      // Reset restart counter on successful result (proves mic is working)
      restartCountRef.current = 0;

      // If we are already counting down, don't restart it
      if (timerRef.current) return;
      
      if (!event.results || event.results.length === 0) return;
      
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult || !lastResult[0]) return;
      
      const transcript = lastResult[0].transcript.toLowerCase().trim();
      
      // Check if any keyword matches
      const isMatch = DISTRESS_KEYWORDS.some(keyword => transcript.includes(keyword));
      
      if (isMatch) {
        console.log(`Distress keyword detected in transcript: "${transcript}"`);
        startCountdown();
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error || event);
      
      // Fatal errors that we should NOT try to restart from
      const fatalErrors = ['not-allowed', 'service-not-allowed', 'language-not-supported'];
      if (fatalErrors.includes(event.error)) {
        console.error("Fatal speech recognition error. Stopping voice distress.");
        setIsListening(false);
        return;
      }
      // For non-fatal errors (network, audio-capture, aborted), let onend handle restart
    };

    recognition.onend = () => {
      // Guard: don't restart if we are already in a restart cycle, if deactivated, or if countdown is running
      if (!isActiveRef.current || timerRef.current || isRestartingRef.current) {
        setIsListening(false);
        return;
      }

      // Guard: don't restart if we've exceeded the max restart limit
      if (restartCountRef.current >= MAX_RESTARTS) {
        console.warn(`Voice distress: exceeded ${MAX_RESTARTS} restart attempts. Stopping.`);
        setIsListening(false);
        return;
      }

      // Debounced restart to avoid crash loops on Android
      isRestartingRef.current = true;
      setIsListening(false);

      restartTimeoutRef.current = setTimeout(() => {
        isRestartingRef.current = false;
        if (!isActiveRef.current) return;

        restartCountRef.current++;
        try {
          recognition.start();
          setIsListening(true);
        } catch (e) {
          console.warn("Failed to restart speech recognition", e);
          setIsListening(false);
        }
      }, RESTART_DELAY_MS);
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Failed to start speech recognition", e);
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      try { recognition.abort(); } catch(e) { /* ignore */ }
    };
  }, [isActive, startCountdown]);

  return {
    isListening,
    countdown,
    cancelCountdown
  };
}
