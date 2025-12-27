'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PersonalityMode = 'friendly' | 'professional' | 'creative' | 'teacher';
export type ResponseLength = 'short' | 'medium' | 'explained';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar' | 'pt' | 'ko' | 'it' | 'hi' | 'tr' | 'ru' | 'nl' | 'sv' | 'pl' | 'id' | 'th' | 'vi' | 'tl' | 'el' | 'he' | 'ur';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface AppContextType {
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string | null) => void;
  personalityMode: PersonalityMode;
  setPersonalityMode: (mode: PersonalityMode) => void;
  responseLength: ResponseLength;
  setResponseLength: (length: ResponseLength) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  enableAnimations: boolean;
  setEnableAnimations: (enabled: boolean) => void;
  enableTypingIndicator: boolean;
  setEnableTypingIndicator: (enabled: boolean) => void;
  clearChatHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [geminiApiKey, setGeminiApiKeyValue] = useState<string | null>(null);
  const [personalityMode, setPersonalityModeValue] = useState<PersonalityMode>('creative');
  const [responseLength, setResponseLengthValue] = useState<ResponseLength>('medium');
  const [language, setLanguageValue] = useState<Language>('en');
  const [enableAnimations, setEnableAnimationsValue] = useState(true);
  const [enableTypingIndicator, setEnableTypingIndicatorValue] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedApiKey = localStorage.getItem('geminiApiKey');
      const storedPersonality = localStorage.getItem('personalityMode') as PersonalityMode;
      const storedResponseLength = localStorage.getItem('responseLength') as ResponseLength;
      const storedLanguage = localStorage.getItem('language') as Language;
      const storedAnimations = localStorage.getItem('enableAnimations');
      const storedTyping = localStorage.getItem('enableTypingIndicator');

      if (storedApiKey) setGeminiApiKeyValue(storedApiKey);
      if (storedPersonality) setPersonalityModeValue(storedPersonality);
      if (storedResponseLength) setResponseLengthValue(storedResponseLength);
      if (storedLanguage) setLanguageValue(storedLanguage);
      if (storedAnimations) setEnableAnimationsValue(JSON.parse(storedAnimations));
      if (storedTyping) setEnableTypingIndicatorValue(JSON.parse(storedTyping));
    } catch (e) {
    }
  }, []);

  const setGeminiApiKey = (key: string | null) => {
    setGeminiApiKeyValue(key);
    if (isMounted) {
      if (key) {
        localStorage.setItem('geminiApiKey', key);
      } else {
        localStorage.removeItem('geminiApiKey');
      }
    }
  };

  const setPersonalityMode = (mode: PersonalityMode) => {
    setPersonalityModeValue(mode);
    if (isMounted) {
      localStorage.setItem('personalityMode', mode);
    }
  };

  const setResponseLength = (length: ResponseLength) => {
    setResponseLengthValue(length);
    if (isMounted) {
      localStorage.setItem('responseLength', length);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageValue(lang);
    if (isMounted) {
      localStorage.setItem('language', lang);
    }
  };
  
  const setEnableAnimations = (enabled: boolean) => {
    setEnableAnimationsValue(enabled);
    if (isMounted) {
      localStorage.setItem('enableAnimations', JSON.stringify(enabled));
    }
  };
  
  const setEnableTypingIndicator = (enabled: boolean) => {
    setEnableTypingIndicatorValue(enabled);
    if (isMounted) {
      localStorage.setItem('enableTypingIndicator', JSON.stringify(enabled));
    }
  };

  const clearChatHistory = () => {
    if (isMounted) {
        localStorage.removeItem('chatHistory');
    }
  };

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AppContext.Provider value={{ 
        geminiApiKey, setGeminiApiKey, 
        personalityMode, setPersonalityMode, 
        responseLength, setResponseLength,
        language, setLanguage,
        enableAnimations, setEnableAnimations,
        enableTypingIndicator, setEnableTypingIndicator,
        clearChatHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
