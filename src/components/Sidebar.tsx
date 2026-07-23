'use client';

import React, { useState } from 'react';
import { PageId } from '../types/poc';
import { useI18n } from '../context/I18nContext';
import { 
  BarChart3, 
  Database, 
  ShieldCheck, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal,
  Server,
  Users
} from 'lucide-react';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { m } = useI18n();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    kpi: true,
    etl: true,
    admin: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups = [
    {
      id: 'kpi',
      label: m.nav.kpiGroup,
      icon: BarChart3,
      items: [
        {
          id: 'kpi-pos' as PageId,
          label: m.nav.posPerf,
          icon: BarChart3,
        },
      ],
    },
    {
      id: 'etl',
      label: m.nav.etlGroup,
      icon: Database,
      items: [
        {
          id: 'etl-datax' as PageId,
          label: m.nav.addaxSummary,
          icon: Database,
        },
      ],
    },
    {
      id: 'admin',
      label: m.nav.adminGroup,
      icon: Settings,
      items: [
        {
          id: 'admin-roles' as PageId,
          label: m.nav.roleControl,
          icon: ShieldCheck,
        },
        {
          id: 'admin-users' as PageId,
          label: m.nav.userControl || '使用者與 AD 帳號管理',
          icon: Users,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 enterprise-panel flex flex-col h-screen sticky top-0 z-20 border-r select-none rounded-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-[var(--bg-subtle)]">
        <div className="w-8 h-8 rounded bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
          <Server className="w-5 h-5" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-bold text-sm tracking-tight text-[var(--text-primary)] truncate">
            {m.brand}
          </span>
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            {m.version}
          </span>
        </div>
      </div>

      {/* 2-Level Menu */}
      <nav className="flex flex-col gap-1.5 p-3 flex-1 overflow-y-auto">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = !!openGroups[group.id];
          const hasActiveChild = group.items.some((item) => item.id === activePage);

          return (
            <div key={group.id} className="flex flex-col gap-1">
              {/* LEVEL 1: Category Accordion Header */}
              <button
                id={`level1-group-${group.id}`}
                onClick={() => toggleGroup(group.id)}
                className={`flex items-center justify-between px-3 py-2 rounded font-bold text-xs uppercase tracking-wider transition-colors ${
                  hasActiveChild
                    ? 'text-[var(--brand-primary)] bg-[var(--brand-primary-light)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GroupIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{group.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                )}
              </button>

              {/* LEVEL 2: Sub-page Menu Items */}
              {isOpen && (
                <div className="flex flex-col gap-1 pl-3.5 border-l-2 ml-3 my-0.5 border-[var(--border-muted)]">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => setActivePage(item.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-colors font-medium ${
                          isActive
                            ? 'bg-[var(--brand-primary)] text-white font-semibold'
                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <ItemIcon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-[var(--text-secondary)]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* System Level Preferences (Pinned to Bottom) */}
      <div className="p-3 border-t border-[var(--border-main)] bg-[var(--bg-surface)]">
        <button
          id="nav-item-admin-preferences"
          onClick={() => setActivePage('admin-preferences')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs transition-colors font-semibold ${
            activePage === 'admin-preferences'
              ? 'bg-[var(--brand-primary)] text-white shadow-2xs'
              : 'text-[var(--text-primary)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-active)]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span className="truncate">{m.nav.sysPreferences}</span>
        </button>
      </div>

      {/* Footer Operational Status */}
      <div className="p-3 border-t bg-[var(--bg-subtle)] text-xs flex items-center justify-between">
        <span className="text-[var(--text-secondary)]">{m.env}:</span>
        <span className="font-bold text-[var(--text-primary)]">{m.prodNorth}</span>
      </div>
    </aside>
  );
};
