import { useState, useEffect, useRef } from 'react';
import { PorcupineManager, BuiltInKeyword } from '@picovoice/porcupine-react-native';

const PICOVOICE_ACCESS_KEY = process.env.EXPO_PUBLIC_PICOVOICE_ACCESS_KEY || ''; // Replace with user's key

export function useVoiceDistress(enabled: boolean) {
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const porcupineManagerRef = useRef<PorcupineManager | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isActive = true;

    const startPorcupine = async () => {
      if (!PICOVOICE_ACCESS_KEY) {
        console.warn("Picovoice API Key is missing. Voice Distress is disabled.");
        setIsSupported(false);
        return;
      }

      try {
        if (!porcupineManagerRef.current) {
          porcupineManagerRef.current = await PorcupineManager.fromBuiltInKeywords(
            PICOVOICE_ACCESS_KEY,
            [BuiltInKeyword.PORCUPINE, BuiltInKeyword.GRAPEFRUIT], // Using built-in as placeholders for "Help" / "Emergency"
            (keywordIndex: number) => {
              if (keywordIndex >= 0) {
                console.log("Wake word detected! Triggering SOS countdown...");
                startCountdown();
              }
            }
          );
        }
        
        await porcupineManagerRef.current.start();
        if (isActive) setIsListening(true);
      } catch (err) {
        console.error("Failed to start Porcupine:", err);
        setIsSupported(false);
      }
    };

    const stopPorcupine = async () => {
      try {
        if (porcupineManagerRef.current) {
          await porcupineManagerRef.current.stop();
          if (isActive) setIsListening(false);
        }
      } catch (err) {
        console.error("Failed to stop Porcupine:", err);
      }
    };

    if (enabled) {
      startPorcupine();
    } else {
      stopPorcupine();
      cancelCountdown();
    }

    return () => {
      isActive = false;
      stopPorcupine();
    };
  }, [enabled]);

  const startCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    setCountdown(5); // 5 second countdown before auto-trigger
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          triggerSOS();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setCountdown(null);
  };

  const triggerSOS = () => {
    console.log("VOICE DISTRESS SOS FIRED NATIVELY!");
    // In actual implementation, this will queue the incident to the backend using AsyncStorage fallback
  };

  return { 
    isListening, 
    countdown, 
    cancelCountdown,
    isSupported
  };
}
