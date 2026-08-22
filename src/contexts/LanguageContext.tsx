import React, { createContext, useContext, useState } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-IN', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  t: (key: string, defaultText: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: SUPPORTED_LANGUAGES[0],
  setLanguage: () => {},
  t: (_key, defaultText) => defaultText,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('trinetra_language');
    if (saved) {
      const found = SUPPORTED_LANGUAGES.find(l => l.code === saved);
      if (found) return found;
    }
    return SUPPORTED_LANGUAGES[0];
  });

  const setLanguage = (code: string) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (found) {
      setCurrentLanguageState(found);
      localStorage.setItem('trinetra_language', code);
      
      // Trigger Google Translate hidden dropdown
      // The Google Translate widget expects the 2-letter code (e.g., 'hi' instead of 'hi-IN')
      const shortCode = code === 'en-IN' ? 'en' : code.split('-')[0];
      const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (gtCombo) {
        gtCombo.value = shortCode;
        gtCombo.dispatchEvent(new Event('change'));
      }
    }
  };

  // Basic dictionary for MVP
  const dictionary: Record<string, Record<string, string>> = {
    'hi-IN': {
      'sos_button': 'एसओएस (SOS) दबाएं',
      'photo_sos': 'फोटो एसओएस',
      'nearby_volunteers': 'आसपास के स्वयंसेवक',
      'report_emergency': 'आपातकाल की रिपोर्ट करें',
      'voice_detection': 'ध्वनि पहचान',
      'help_on_way': 'मदद आ रही है। शांत रहें।',
      'cancel': 'रद्द करें',
      'submit': 'जमा करें'
    },
    'bn-IN': {
      'sos_button': 'এসওএস (SOS) চাপুন',
      'photo_sos': 'ফটো এসওএস',
      'nearby_volunteers': 'কাছাকাছি স্বেচ্ছাসেবক',
      'report_emergency': 'জরুরী রিপোর্ট',
      'voice_detection': 'ভয়েস সনাক্তকরণ',
      'help_on_way': 'সাহায্য আসছে। শান্ত থাকুন।',
      'cancel': 'বাতিল করুন',
      'submit': 'জমা দিন'
    },
    'te-IN': {
      'sos_button': 'SOS నొక్కండి',
      'photo_sos': 'ఫోటో SOS',
      'nearby_volunteers': 'సమీప వాలంటీర్లు',
      'report_emergency': 'అత్యవసర రిపోర్ట్',
      'voice_detection': 'వాయిస్ గుర్తింపు',
      'help_on_way': 'సహాయం వస్తోంది. ప్రశాంతంగా ఉండండి.',
      'cancel': 'రద్దు చేయి',
      'submit': 'సమర్పించండి'
    },
    'ta-IN': {
      'sos_button': 'SOS அழுத்தவும்',
      'photo_sos': 'புகைப்பட SOS',
      'nearby_volunteers': 'அருகிலுள்ள தன்னார்வலர்கள்',
      'report_emergency': 'அவசர நிலை அறிக்கை',
      'voice_detection': 'குரல் கண்டறிதல்',
      'help_on_way': 'உதவி வருகிறது. அமைதியாக இருங்கள்.',
      'cancel': 'ரத்துசெய்',
      'submit': 'சமர்ப்பி'
    },
    'mr-IN': {
      'sos_button': 'SOS दाबा',
      'photo_sos': 'फोटो SOS',
      'nearby_volunteers': 'जवळचे स्वयंसेवक',
      'report_emergency': 'आणीबाणी नोंदवा',
      'voice_detection': 'आवाज ओळख',
      'help_on_way': 'मदत येत आहे. शांत राहा.',
      'cancel': 'रद्द करा',
      'submit': 'सबमिट करा'
    }
  };

  const t = (key: string, defaultText: string) => {
    if (currentLanguage.code === 'en-IN') return defaultText;
    const langDict = dictionary[currentLanguage.code];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return defaultText;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
