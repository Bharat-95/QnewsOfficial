import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en';
import te from '../locales/te';

interface LanguageContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translations: typeof en | typeof te;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode; // Define children as ReactNode type
}

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>('te');
  const translations = useMemo(() => (language === 'en' ? en : te), [language]);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) setLanguage(savedLanguage);
      } catch (err) {
        console.error('Failed to load language', err);
      }
    };
    loadLanguage();
  }, []);
  

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'te' : 'en';
    setLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to access language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Default export for LanguageProvider
export default LanguageProvider;
