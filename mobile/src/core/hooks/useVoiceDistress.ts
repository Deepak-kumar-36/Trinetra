import { useState, useEffect, useRef } from 'react';
import * as Vosk from 'react-native-vosk';

export function useVoiceDistress(enabled: boolean) {
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultSubRef = useRef<any>(null);

  useEffect(() => {
    let isActive = true;

    const startVosk = async () => {
      try {
        await Vosk.loadModel('model-en');
        
        if (!resultSubRef.current) {
          resultSubRef.current = Vosk.onResult((res: string) => {
            if (!res) return;
            const text = res.toLowerCase();
            
            // Wake words
            if (text.includes('help') || text.includes('emergency') || text.includes('bachao')) {
              console.log("Wake word detected:", text);
              startCountdown();
            }
          });
        }
        
        await Vosk.start({
          grammar: ['help', 'emergency', 'bachao', '[unk]']
        });
        
        if (isActive) setIsListening(true);
      } catch (err) {
        console.error("Failed to start Vosk:", err);
        setIsSupported(false);
      }
    };

    const stopVosk = () => {
      try {
        Vosk.stop();
        if (resultSubRef.current) {
          resultSubRef.current.remove();
          resultSubRef.current = null;
        }
        if (isActive) setIsListening(false);
      } catch (err) {
        console.error("Failed to stop Vosk:", err);
      }
    };

    if (enabled) {
      startVosk();
    } else {
      stopVosk();
      cancelCountdown();
    }

    return () => {
      isActive = false;
      stopVosk();
    };
  }, [enabled]);

  const startCountdown = () => {
    // Only start if not already counting down
    if (countdownTimerRef.current) return;
    
    setCountdown(5);
    
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
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  };

  const triggerSOS = () => {
    console.log("VOICE DISTRESS SOS FIRED NATIVELY!");
    // The UI handles actual dispatch, this simulates the action
  };

  return { 
    isListening, 
    countdown, 
    cancelCountdown,
    isSupported
  };
}
