'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import zhTW from '../../messages/zh-TW.json';
import zhCN from '../../messages/zh-CN.json';
import enUS from '../../messages/en-US.json';
import jaJP from '../../messages/ja-JP.json';

export type SupportedLocale = 'zh-TW' | 'zh-CN' | 'en-US' | 'ja-JP';

export type MessagesType = typeof zhTW;

const messagesMap: Record<SupportedLocale, MessagesType> = {
  'zh-TW': zhTW,
  'zh-CN': zhCN as unknown as MessagesType,
  'en-US': enUS as unknown as MessagesType,
  'ja-JP': jaJP as unknown as MessagesType,
};

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  m: MessagesType;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'app_locale';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>('zh-TW');

  // Initialize locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem(STORAGE_KEY) as SupportedLocale;
      if (savedLocale && messagesMap[savedLocale]) {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
      } else {
        document.documentElement.lang = 'zh-TW';
      }
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    if (messagesMap[newLocale]) {
      setLocaleState(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLocale);
        document.documentElement.lang = newLocale;
      }
    }
  };

  const m = messagesMap[locale] || messagesMap['zh-TW'];

  return (
    <I18nContext.Provider value={{ locale, setLocale, m }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
