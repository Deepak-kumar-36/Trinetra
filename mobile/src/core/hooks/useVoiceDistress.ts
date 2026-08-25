import { useState } from 'react';

export function useVoiceDistress(enabled: boolean) {
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Picovoice has been removed. Vosk implementation pending.
  const isSupported = false;

  const cancelCountdown = () => {
    setCountdown(null);
  };

  return { 
    isListening, 
    countdown, 
    cancelCountdown,
    isSupported
  };
}
