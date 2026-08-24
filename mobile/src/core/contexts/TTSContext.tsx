import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

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
  const { currentLanguage } = useLanguage();
  
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
        const utterance = new SpeechSynthesisUtterance("Screen reader mode enabled");
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = currentLanguage.code;
        
        const voices = synthesis.getVoices();
        if (voices.length > 0) {
          const exactMatch = voices.find(v => v.lang === currentLanguage.code);
          const shortCode = currentLanguage.code.split('-')[0];
          const partialMatch = voices.find(v => v.lang.startsWith(shortCode));
          const googleMatch = voices.find(v => v.lang.startsWith(shortCode) && v.name.includes('Google'));
          utterance.voice = googleMatch || exactMatch || partialMatch || null;
        }

        synthesis.speak(utterance);
      } else if (!next && synthesis) {
        synthesis.cancel(); // Stop speaking if turned off
      }
      
      return next;
    });
  }, [synthesis, currentLanguage.code]);

  const speak = useCallback((text: string) => {
    if (!isTTSEnabled || !synthesis || !text.trim()) return;
    
    // Stop currently speaking utterance if any
    synthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = currentLanguage.code; // Apply selected language

    // Explicitly find the best matching voice pack to avoid the "gender swap only" bug
    const voices = synthesis.getVoices();
    if (voices.length > 0) {
      const exactMatch = voices.find(v => v.lang === currentLanguage.code);
      const shortCode = currentLanguage.code.split('-')[0];
      const partialMatch = voices.find(v => v.lang.startsWith(shortCode));
      const googleMatch = voices.find(v => v.lang.startsWith(shortCode) && v.name.includes('Google'));
      
      // Prefer Google's cloud voices if available, then exact, then partial
      utterance.voice = googleMatch || exactMatch || partialMatch || null;
    }
    
    synthesis.speak(utterance);
  }, [isTTSEnabled, synthesis, currentLanguage.code]);

  // Global click listener for "Narrator" mode
  useEffect(() => {
    if (!isTTSEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Try to find the most meaningful text to read
      let textToRead = '';

      // Check aria-label first
      const ariaLabel = target.getAttribute('aria-label') || target.closest('[aria-label]')?.getAttribute('aria-label');
      
      // Check alt text (for images)
      const altText = target.getAttribute('alt');
      
      // Check title
      const title = target.getAttribute('title') || target.closest('[title]')?.getAttribute('title');

      if (ariaLabel) {
        textToRead = ariaLabel;
      } else if (altText) {
        textToRead = altText;
      } else if (title) {
        textToRead = title;
      } else {
        // Fallback to text content
        // Try to get text of the closest button/link, or just the target itself
        const readableElement = target.closest('button, a, label, h1, h2, h3, h4, h5, h6, p, span, div') as HTMLElement;
        if (readableElement) {
           // Only grab direct text content or a sensible substring to avoid reading the whole page if they click body
           textToRead = readableElement.innerText || readableElement.textContent || '';
        }
      }

      textToRead = textToRead.trim();
      
      // Only speak if it's reasonably short (prevent reading massive blocks if they misclick)
      // and not empty
      if (textToRead && textToRead.length > 0) {
         // Truncate to avoid reading forever
         const MAX_LEN = 200;
         const finalSpeech = textToRead.length > MAX_LEN ? textToRead.substring(0, MAX_LEN) + "..." : textToRead;
         speak(finalSpeech);
      }
    };

    // Use capture phase to ensure we catch the click before react does anything that might unmount the element
    document.addEventListener('click', handleGlobalClick, { capture: true });
    
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [isTTSEnabled, speak]);

  return (
    <TTSContext.Provider value={{ isTTSEnabled, toggleTTS, speak }}>
      {children}
    </TTSContext.Provider>
  );
};
