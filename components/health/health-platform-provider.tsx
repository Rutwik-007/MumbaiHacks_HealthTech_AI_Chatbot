'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type SupportedLanguage,
  type UserRole,
  EMERGENCY_KEYWORDS,
  speak,
} from '@/lib/health-platform';

interface HealthPlatformContextType {
  // State
  language: SupportedLanguage;
  role: UserRole;
  voiceOutputEnabled: boolean;
  isEmergency: boolean;

  // Actions
  setLanguage: (language: SupportedLanguage) => void;
  setRole: (role: UserRole) => void;
  setVoiceOutputEnabled: (enabled: boolean) => void;
  checkForEmergency: (text: string) => boolean;
  clearEmergency: () => void;
  speakText: (text: string) => void;
}

const HealthPlatformContext = createContext<HealthPlatformContextType | null>(null);

interface HealthPlatformProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
  defaultRole?: UserRole;
}

export function HealthPlatformProvider({
  children,
  defaultLanguage = 'en',
  defaultRole = 'citizen',
}: HealthPlatformProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage);
  const [role, setRoleState] = useState<UserRole>(defaultRole);
  const [voiceOutputEnabled, setVoiceOutputEnabledState] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('health-platform-language');
    const savedRole = localStorage.getItem('health-platform-role');
    const savedVoice = localStorage.getItem('health-platform-voice-output');

    if (savedLanguage && ['en', 'hi', 'mr', 'pa'].includes(savedLanguage)) {
      setLanguageState(savedLanguage as SupportedLanguage);
    }
    if (savedRole && ['citizen', 'asha', 'officer'].includes(savedRole)) {
      setRoleState(savedRole as UserRole);
    }
    if (savedVoice !== null) {
      setVoiceOutputEnabledState(savedVoice === 'true');
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('health-platform-language', lang);
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    localStorage.setItem('health-platform-role', r);
  }, []);

  const setVoiceOutputEnabled = useCallback((enabled: boolean) => {
    setVoiceOutputEnabledState(enabled);
    localStorage.setItem('health-platform-voice-output', String(enabled));
  }, []);

  const checkForEmergency = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    
    // Check emergency keywords in all languages
    for (const lang of Object.keys(EMERGENCY_KEYWORDS) as SupportedLanguage[]) {
      const keywords = EMERGENCY_KEYWORDS[lang];
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          setIsEmergency(true);
          return true;
        }
      }
    }
    
    return false;
  }, []);

  const clearEmergency = useCallback(() => {
    setIsEmergency(false);
  }, []);

  const speakText = useCallback((text: string) => {
    if (voiceOutputEnabled) {
      speak(text, { language });
    }
  }, [voiceOutputEnabled, language]);

  const value: HealthPlatformContextType = {
    language,
    role,
    voiceOutputEnabled,
    isEmergency,
    setLanguage,
    setRole,
    setVoiceOutputEnabled,
    checkForEmergency,
    clearEmergency,
    speakText,
  };

  return (
    <HealthPlatformContext.Provider value={value}>
      {children}
    </HealthPlatformContext.Provider>
  );
}

export function useHealthPlatform() {
  const context = useContext(HealthPlatformContext);
  if (!context) {
    throw new Error('useHealthPlatform must be used within a HealthPlatformProvider');
  }
  return context;
}
