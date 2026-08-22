import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface TTSContextType {
  isTTSEnabled: boolean;
  toggleTTS: () => void;
  speak: (text: string) => void;
}

const TTSContext = createContext<TTSContextType>({
  isTTSEnabled: false,
  toggleTTS: () => {},
  speak: () => {},
});

export const useTTS = () => useContext(TTSContext);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(() => {
    // Check local storage for preference
    const saved = localStorage.getItem('trinetra_tts_enabled');
    return saved === 'true';
  });

  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  const toggleTTS = useCallback(() => {
    setIsTTSEnabled(prev => {
      const next = !prev;
      localStorage.setItem('trinetra_tts_enabled', next.toString());
      
      // Speak a confirmation when turning on
      if (next && synthesis) {
        const utterance = new SpeechSynthesisUtterance("Text to speech enabled");
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        synthesis.speak(utterance);
      } else if (!next && synthesis) {
        synthesis.cancel(); // Stop speaking if turned off
      }
      
      return next;
    });
  }, [synthesis]);

  const speak = useCallback((text: string) => {
    if (!isTTSEnabled || !synthesis) return;
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Optional: Select a specific voice if desired, otherwise uses default
    
    synthesis.speak(utterance);
  }, [isTTSEnabled, synthesis]);

  return (
    <TTSContext.Provider value={{ isTTSEnabled, toggleTTS, speak }}>
      {children}
    </TTSContext.Provider>
  );
};
