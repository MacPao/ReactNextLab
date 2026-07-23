'use client';

import React from 'react';
import { PageId, AppTheme } from '../types/poc';
import { useI18n, SupportedLocale } from '../context/I18nContext';
import { 
  ChevronRight, 
  Globe, 
  Home, 
  Sun, 
  Moon, 
  Monitor 
} from 'lucide-react';

interface HeaderProps {
  activePage: PageId;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  theme,
  setTheme,
}) => {
  const { locale, setLocale, m } = useI18n();

  const getBreadcrumbs = () => {
    switch (activePage) {
      case 'kpi-pos':
        return [m.nav.kpiGroup, m.nav.posPerf];
      case 'etl-datax':
        return [m.nav.etlGroup, m.nav.addaxSummary];
      case 'admin-roles':
        return [m.nav.adminGroup, m.nav.roleControl];
      case 'admin-preferences':
        return [m.nav.adminGroup, m.nav.sysPreferences];
      default:
        return [m.header.console, m.header.overview];
    }
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="enterprise-panel mb-4 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs rounded-lg">
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Home className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" />
        <span>{crumbs[0]}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" />
        <span className="font-bold text-[var(--text-primary)] text-sm">{crumbs[1]}</span>
      </div>

      {/* Control Tools */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Theme Switcher Toggle */}
        <div className="flex items-center border border-[var(--border-main)] rounded-md p-1 bg-[var(--bg-subtle)]">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded transition-colors ${
              theme === 'light'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] font-bold shadow-2xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={m.header.themeLight}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded transition-colors ${
              theme === 'dark'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] font-bold shadow-2xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={m.header.themeDark}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded transition-colors ${
              theme === 'system'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] font-bold shadow-2xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={m.header.themeSystem}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* BCP 47 Language Selector */}
        <div className="flex items-center gap-2 border border-[var(--border-main)] rounded-md px-2.5 py-1.5 bg-[var(--bg-surface)]">
          <Globe className="w-4 h-4 text-[var(--text-secondary)]" />
          <select
            id="global-language-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as SupportedLocale)}
            className="bg-transparent text-[var(--text-primary)] text-xs outline-none cursor-pointer font-medium"
          >
            <option value="zh-TW">繁體中文</option>
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
            <option value="ja-JP">日本語</option>
          </select>
        </div>
      </div>
    </header>
  );
};
