'use client';

import React, { useState, useEffect } from 'react';
import { UserAccount, RoleDefinition, AccountType } from '../types/poc';
import { useI18n } from '../context/I18nContext';
import { userService, userSqlSchemaDdl } from '../services/userService';
import { roleService } from '../services/roleService';
import { dateFormatter } from '../utils/dateFormatter';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Key, 
  Database, 
  Code2, 
  Terminal, 
  Grid,
  Lock,
  X
} from 'lucide-react';

export const UserSettingsPage: React.FC = () => {
  const { locale, m } = useI18n();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdSyncing, setIsAdSyncing] = useState<boolean>(false);
  const [syncToastMsg, setSyncToastMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setAccountTypeFilter] = useState<'ALL' | AccountType>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newDept, setNewDept] = useState<string>('Operations');
  const [newTitle, setNewTitle] = useState<string>('Operations Specialist');
  const [newRoleId, setNewRoleId] = useState<string>('role_pos_operator');

  // View Switcher
  const [activeTab, setActiveTab] = useState<'list' | 'spec'>('list');

  useEffect(() => {
    let isMounted = true;
    Promise.all([userService.getUsers(), roleService.getRoles()]).then(
      ([userData, roleData]) => {
        if (isMounted) {
          setUsers(userData);
          setRoles(roleData);
          setIsLoading(false);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const getRoleName = (roleId: string) => {
    const r = roles.find((role) => role.roleId === roleId);
    if (!r) return roleId;
    if (locale === 'zh-TW') return r.roleNameZh;
    if (locale === 'zh-CN') return r.roleNameZhCn;
    if (locale === 'ja-JP') return r.roleNameJa;
    return r.roleNameEn;
  };

  const handleSyncAd = async () => {
    setIsAdSyncing(true);
    const result = await userService.syncActiveDirectory();
    setIsAdSyncing(false);
    setSyncToastMsg(`Active Directory Sync Complete! ${result.syncedCount} AD objects reconciled at ${dateFormatter.formatDateTime(result.timestamp, locale)}.`);
    setTimeout(() => setSyncToastMsg(null), 3000);
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    await userService.updateUserRole(userId, newRoleId);
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, roleId: newRoleId } : u))
    );
  };

  const handleToggleStatus = async (userId: string) => {
    await userService.toggleUserStatus(userId);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.userId === userId) {
          return {
            ...u,
            status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE',
          };
        }
        return u;
      })
    );
  };

  const handleCreateLocalUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newDisplayName || !newEmail) return;

    const created = await userService.createLocalUser({
      username: newUsername,
      displayName: newDisplayName,
      email: newEmail,
      accountType: 'LOCAL',
      department: newDept,
      title: newTitle,
      roleId: newRoleId,
      status: 'ACTIVE',
    });

    setUsers((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewUsername('');
    setNewDisplayName('');
    setNewEmail('');
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.upn && u.upn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || u.accountType === typeFilter;
    const matchesRole = roleFilter === 'ALL' || u.roleId === roleFilter;

    return matchesSearch && matchesType && matchesRole;
  });

  const totalUsersCount = users.length;
  const adUsersCount = users.filter((u) => u.accountType === 'AD').length;
  const localUsersCount = users.filter((u) => u.accountType === 'LOCAL').length;
  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;

  if (isLoading) {
    return (
      <div className="p-8 enterprise-panel flex items-center justify-center text-sm text-[var(--text-secondary)] font-medium">
        Loading User Accounts & Directory Info...
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-main)] pb-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--brand-primary)]" />
            {locale === 'zh-TW' ? '使用者與 AD 目錄整合管理' :
             locale === 'zh-CN' ? '用户与 AD 目录集成管理' :
             locale === 'ja-JP' ? 'ユーザー＆ AD ディレクトリ統合管理' :
             'User Accounts & Active Directory Management'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {locale === 'zh-TW' ? '管理企業 Active Directory (AD/LDAP) 同步帳號與本地 (Local) 緊急/服務帳號之角色存取權限。' :
             locale === 'zh-CN' ? '管理企业 Active Directory (AD/LDAP) 同步账号与本地 (Local) 紧急/服务账号之角色访问权限。' :
             locale === 'ja-JP' ? '企業 Active Directory (AD) 同期アカウントおよびローカル緊急アカウントの権限管理。' :
             'Manage Enterprise Active Directory (AD) synced directory accounts and local service credentials with assigned RBAC roles.'}
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-[var(--border-main)] rounded-md p-1 bg-[var(--bg-subtle)]">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'list'
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{locale === 'zh-TW' ? '使用者列表' : locale === 'zh-CN' ? '用户列表' : locale === 'ja-JP' ? 'ユーザー一覧' : 'User Directory'}</span>
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'spec'
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>AD & API Spec</span>
            </button>
          </div>

          <button
            onClick={handleSyncAd}
            disabled={isAdSyncing}
            className="btn-enterprise-secondary text-sm flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isAdSyncing ? 'animate-spin text-[var(--brand-primary)]' : ''}`} />
            <span>{isAdSyncing ? 'Syncing AD...' : 'Sync AD Directory'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-enterprise-primary text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'zh-TW' ? '新增本地帳號' : locale === 'zh-CN' ? '新建本地账号' : locale === 'ja-JP' ? 'ローカルアカウント追加' : 'Add Local User'}</span>
          </button>
        </div>
      </div>

      {syncToastMsg && (
        <div className="p-3 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success-text)] border border-[var(--status-success-border)] text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {syncToastMsg}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="enterprise-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">
              {locale === 'zh-TW' ? '總使用者數' : 'Total Accounts'}
            </span>
            <span className="text-xl font-bold text-[var(--text-primary)]">{totalUsersCount}</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="enterprise-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">
              Active Directory (AD)
            </span>
            <span className="text-xl font-bold text-[var(--brand-primary)]">{adUsersCount} Synced</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="enterprise-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">
              {locale === 'zh-TW' ? '本地 (Local) 帳號' : 'Local Capacity'}
            </span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{localUsersCount} Local</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-amber-600 border border-[var(--border-main)]">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="enterprise-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">
              {locale === 'zh-TW' ? '啟用中帳號' : 'Active Status'}
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount} / {totalUsersCount}</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-emerald-600 border border-[var(--border-main)]">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="enterprise-panel p-5 space-y-4 w-full">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-subtle)] p-3 rounded-lg border border-[var(--border-main)]">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
              <input
                type="text"
                placeholder={locale === 'zh-TW' ? '搜尋姓名, Username, Email 或 UPN...' : 'Search by Name, Username, Email, or UPN...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="enterprise-input text-xs w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter by Type */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <span>{locale === 'zh-TW' ? '帳號類型:' : 'Type:'}</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value as 'ALL' | AccountType)}
                  className="enterprise-input text-xs py-1"
                >
                  <option value="ALL">All Types</option>
                  <option value="AD">Active Directory (AD)</option>
                  <option value="LOCAL">Local Account</option>
                </select>
              </div>

              {/* Filter by Role */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <span>{locale === 'zh-TW' ? '指派角色:' : 'Role:'}</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="enterprise-input text-xs py-1"
                >
                  <option value="ALL">All Roles</option>
                  {roles.map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {getRoleName(r.roleId)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-md border border-[var(--border-main)] w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-b border-[var(--border-main)] uppercase text-xs tracking-wider whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4">{locale === 'zh-TW' ? '使用者 / 顯示名稱' : 'User / Display Name'}</th>
                  <th className="py-3 px-4">{locale === 'zh-TW' ? '帳號類型 / UPN' : 'Account Type / UPN'}</th>
                  <th className="py-3 px-4">{locale === 'zh-TW' ? '部門與職稱' : 'Dept & Title'}</th>
                  <th className="py-3 px-4">{locale === 'zh-TW' ? '指派角色 (RBAC)' : 'Assigned Role'}</th>
                  <th className="py-3 px-4">{locale === 'zh-TW' ? '狀態' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{locale === 'zh-TW' ? '最後登入' : 'Last Login'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-muted)] text-[var(--text-primary)] whitespace-nowrap">
                {filteredUsers.map((usr) => (
                  <tr key={usr.userId} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    {/* User / Display Name */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--text-primary)]">{usr.displayName}</span>
                        <span className="text-xs text-[var(--text-secondary)]">@{usr.username}</span>
                      </div>
                    </td>

                    {/* Account Type / UPN */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {usr.accountType === 'AD' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> AD Synced
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Key className="w-3 h-3" /> Local Capacity
                          </span>
                        )}
                        <span className="text-xs text-[var(--text-secondary)]">{usr.upn || usr.email}</span>
                      </div>
                    </td>

                    {/* Dept & Title */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--text-primary)]">{usr.department}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{usr.title}</span>
                      </div>
                    </td>

                    {/* Assigned Role */}
                    <td className="py-3 px-4">
                      <select
                        value={usr.roleId}
                        onChange={(e) => handleRoleChange(usr.userId, e.target.value)}
                        className="enterprise-input text-xs font-semibold py-1 cursor-pointer text-[var(--brand-primary)]"
                      >
                        {roles.map((r) => (
                          <option key={r.roleId} value={r.roleId}>
                            {getRoleName(r.roleId)}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(usr.userId)}
                        className={`badge-status cursor-pointer ${
                          usr.status === 'ACTIVE'
                            ? 'badge-status-success'
                            : 'badge-status-warning'
                        }`}
                      >
                        {usr.status === 'ACTIVE' ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>

                    {/* Last Login */}
                    <td className="py-3 px-4 text-right text-xs text-[var(--text-secondary)]">
                      {dateFormatter.formatDateTime(usr.lastLogin, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BACKEND API & DATA SPEC VIEW */}
      {activeTab === 'spec' && (
        <div className="space-y-5 w-full">
          {/* Active Directory Integration Architecture */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Building2 className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Active Directory (AD / LDAP / Azure AD) Integration Architecture
              </h3>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The platform connects to Enterprise Active Directory / Azure AD via LDAP / SAML / OIDC protocols. User credentials and organizational metadata (Department, Title, UPN) are periodically synced from AD, while functional rights are dynamically evaluated based on local RBAC role mappings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-2">
                <span className="font-bold text-[var(--brand-primary)] block">AD / OAuth Directory Sync</span>
                <p className="text-[var(--text-secondary)]">
                  Endpoint: <code className="text-emerald-600 dark:text-emerald-400">POST /api/v1/ad-directory/sync</code>
                </p>
                <div className="text-[11px] text-[var(--text-tertiary)]">
                  Queries LDAP / Microsoft Graph API for updated user groups and UPN definitions.
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-2">
                <span className="font-bold text-[var(--brand-primary)] block">Local User Account Capacity</span>
                <p className="text-[var(--text-secondary)]">
                  Endpoint: <code className="text-emerald-600 dark:text-emerald-400">POST /api/v1/users</code>
                </p>
                <div className="text-[11px] text-[var(--text-tertiary)]">
                  Reserves offline breakglass operator accounts and automated service accounts.
                </div>
              </div>
            </div>
          </div>

          {/* Database DDL Section */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Database className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                User Directory Database DDL Schema (PostgreSQL / MySQL)
              </h3>
            </div>

            <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs overflow-x-auto">
              {userSqlSchemaDdl}
            </pre>
          </div>
        </div>
      )}

      {/* ADD LOCAL USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="enterprise-panel bg-[var(--bg-surface)] w-full max-w-lg p-6 relative shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                {locale === 'zh-TW' ? '新增本地緊急 / 服務帳號' : 'Add Local Service Account'}
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLocalUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">Username (ID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. local_ops_admin"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="enterprise-input w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local Emergency Ops Admin"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="enterprise-input w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ops@platform.local"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="enterprise-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="enterprise-input w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="enterprise-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-secondary)] mb-1">Assign Initial Role</label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  className="enterprise-input w-full"
                >
                  {roles.map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {getRoleName(r.roleId)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[var(--border-main)] mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-enterprise-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-enterprise-primary text-xs">
                  Create Local Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
