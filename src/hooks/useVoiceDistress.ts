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

export function useVoiceDistress(isActive: boolean) {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Timer ref to manage the countdown interval
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startCountdown = useCallback(() => {
    if (countdown !== null) return; // Already counting down
    
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
  }, [countdown, user]); // Include user dependency

  const cancelCountdown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(null);
  }, []);

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

  useEffect(() => {
    if (!isActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
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

    recognition.onresult = (event) => {
      // If we are already counting down, don't restart it
      if (countdown !== null) return;
      
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.toLowerCase().trim();
      
      // Check if any keyword matches
      const isMatch = DISTRESS_KEYWORDS.some(keyword => transcript.includes(keyword));
      
      if (isMatch) {
        console.log(`Distress keyword detected in transcript: "${transcript}"`);
        startCountdown();
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error", event);
    };

    recognition.onend = () => {
      // Auto-restart if it was stopped by the system but isActive is still true
      if (isActive && countdown === null) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore start errors
        }
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Failed to start speech recognition", e);
    }

    return () => {
      recognition.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, countdown, startCountdown]);

  return {
    isListening,
    countdown,
    cancelCountdown
  };
}
