'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { PosPerformancePage } from '../components/PosPerformancePage';
import { DataXEtlPage } from '../components/DataXEtlPage';
import { RolePermissionsPage } from '../components/RolePermissionsPage';
import { UserSettingsPage } from '../components/UserSettingsPage';
import { SystemPreferencesPage } from '../components/SystemPreferencesPage';
import { PageId, AppTheme } from '../types/poc';

export default function Dashboard() {
  const [activePage, setActivePage] = useState<PageId>('kpi-pos');
  const [theme, setTheme] = useState<AppTheme>('light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode check
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex relative w-full">
      {/* 2-Level High-Density Left Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Canvas Area - Full Width Enterprise Layout */}
      <main className="flex-1 p-5 w-full min-w-0 z-10 overflow-x-auto">
        {/* Header Breadcrumb, Theme Switcher & Language Switcher */}
        <Header
          activePage={activePage}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Dynamic Page Routing */}
        {activePage === 'kpi-pos' && <PosPerformancePage />}
        {activePage === 'etl-datax' && <DataXEtlPage />}
        {activePage === 'admin-roles' && <RolePermissionsPage />}
        {activePage === 'admin-users' && <UserSettingsPage />}
        {activePage === 'admin-preferences' && (
          <SystemPreferencesPage
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </main>
    </div>
  );
};
