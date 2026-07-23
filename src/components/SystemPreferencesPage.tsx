'use client';

import React, { useState } from 'react';
import { AppTheme } from '../types/poc';
import { useI18n, SupportedLocale } from '../context/I18nContext';
import { SlidersHorizontal, Globe, Palette, Save, Check, Sun, Moon, Monitor } from 'lucide-react';

interface SystemPreferencesPageProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export const SystemPreferencesPage: React.FC<SystemPreferencesPageProps> = ({
  theme,
  setTheme,
}) => {
  const { locale, setLocale, m } = useI18n();
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSave = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-main)] pb-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[var(--brand-primary)]" />
            {m.preferences.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {m.preferences.subtitle}
          </p>
        </div>

        <button id="save-pref-btn" onClick={handleSave} className="btn-enterprise-primary text-sm">
          {showSavedMsg ? (
            <Check className="w-4 h-4 text-emerald-300" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{showSavedMsg ? m.preferences.saved : m.preferences.saveSettings}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Language Selection */}
        <div className="enterprise-panel p-5 space-y-4 text-sm">
          <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3 font-bold text-[var(--text-primary)] text-base">
            <Globe className="w-5 h-5 text-[var(--brand-primary)]" />
            <span>{m.preferences.langSelect}</span>
          </div>

          <div className="space-y-3">
            <label
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                locale === 'zh-TW'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="langOption"
                  value="zh-TW"
                  checked={locale === 'zh-TW'}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="accent-[var(--brand-primary)] cursor-pointer"
                />
                <span className="text-sm">繁體中文 (zh-TW)</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">Traditional Chinese</span>
            </label>

            <label
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                locale === 'zh-CN'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="langOption"
                  value="zh-CN"
                  checked={locale === 'zh-CN'}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="accent-[var(--brand-primary)] cursor-pointer"
                />
                <span className="text-sm">简体中文 (zh-CN)</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">Simplified Chinese</span>
            </label>

            <label
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                locale === 'en-US'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="langOption"
                  value="en-US"
                  checked={locale === 'en-US'}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="accent-[var(--brand-primary)] cursor-pointer"
                />
                <span className="text-sm">English (en-US)</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">US English</span>
            </label>

            <label
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                locale === 'ja-JP'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="langOption"
                  value="ja-JP"
                  checked={locale === 'ja-JP'}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="accent-[var(--brand-primary)] cursor-pointer"
                />
                <span className="text-sm">日本語 (ja-JP)</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">Japanese</span>
            </label>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="enterprise-panel p-5 space-y-4 text-sm">
          <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3 font-bold text-[var(--text-primary)] text-base">
            <Palette className="w-5 h-5 text-[var(--brand-primary)]" />
            <span>{m.preferences.themeSelect}</span>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                theme === 'light'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-sm">{m.preferences.lightTheme}</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{m.preferences.lightDesc}</span>
            </div>

            <div
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-sm">{m.preferences.darkTheme}</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{m.preferences.darkDesc}</span>
            </div>

            <div
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                theme === 'system'
                  ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] font-bold text-[var(--brand-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-sm">{m.preferences.systemTheme}</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{m.preferences.systemDesc}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
