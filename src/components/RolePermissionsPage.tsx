'use client';

import React, { useState, useEffect } from 'react';
import { RoleDefinition } from '../types/poc';
import { useI18n } from '../context/I18nContext';
import { roleService, sqlSchemaDdl } from '../services/roleService';
import { mockFunctionPermissions } from '../data/pocData';
import { 
  ShieldCheck, 
  Plus, 
  Check, 
  UserCheck, 
  Lock, 
  Users, 
  Save, 
  KeyRound,
  CheckCircle2,
  XCircle,
  Code2,
  Database,
  Terminal,
  Grid
} from 'lucide-react';

export const RolePermissionsPage: React.FC = () => {
  const { locale, m } = useI18n();
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role_super_admin');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'spec'>('matrix');

  // Load roles on mount via roleService
  useEffect(() => {
    let isMounted = true;
    roleService.getRoles().then((data) => {
      if (isMounted) {
        setRoles(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentRole = roles.find((r) => r.roleId === selectedRoleId) || roles[0] || {
    roleId: 'role_super_admin',
    roleNameEn: 'Super Administrator',
    roleNameZh: '超級系統管理員',
    roleNameZhCn: '超级系统管理员',
    roleNameJa: 'スーパー管理者',
    descriptionEn: 'Full system privileges.',
    descriptionZh: '擁有全系統完整存取權限。',
    descriptionZhCn: '拥有全系统完整访问权限。',
    descriptionJa: 'システム全体に対する完全な権限。',
    assignedUserCount: 3,
    isSystemRole: true,
    permissions: {},
  };

  const getRoleName = (role: RoleDefinition) => {
    if (locale === 'zh-TW') return role.roleNameZh;
    if (locale === 'zh-CN') return role.roleNameZhCn;
    if (locale === 'ja-JP') return role.roleNameJa;
    return role.roleNameEn;
  };

  const getRoleDescription = (role: RoleDefinition) => {
    if (locale === 'zh-TW') return role.descriptionZh;
    if (locale === 'zh-CN') return role.descriptionZhCn;
    if (locale === 'ja-JP') return role.descriptionJa;
    return role.descriptionEn;
  };

  const getPermLabel = (permKey: string) => {
    const item = mockFunctionPermissions.find((p) => p.key === permKey);
    if (!item) return permKey;
    if (locale === 'zh-TW') return item.labelZh;
    if (locale === 'zh-CN') return item.labelZhCn;
    if (locale === 'ja-JP') return item.labelJa;
    return item.labelEn;
  };

  const togglePermission = (permKey: string) => {
    if (currentRole.isSystemRole && permKey === 'admin_roles') {
      return;
    }

    setRoles((prev) =>
      prev.map((role) => {
        if (role.roleId === selectedRoleId) {
          const currentVal = !!role.permissions[permKey];
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permKey]: !currentVal,
            },
          };
        }
        return role;
      })
    );
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    await roleService.updateRolePermissions(selectedRoleId, currentRole.permissions);
    setIsSaving(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleAddRole = async () => {
    const newRoleId = `role_custom_${Date.now()}`;
    const newRole: RoleDefinition = {
      roleId: newRoleId,
      roleNameEn: m.roles.customRoleName,
      roleNameZh: m.roles.customRoleName,
      roleNameZhCn: m.roles.customRoleName,
      roleNameJa: m.roles.customRoleName,
      descriptionEn: m.roles.customRoleDesc,
      descriptionZh: m.roles.customRoleDesc,
      descriptionZhCn: m.roles.customRoleDesc,
      descriptionJa: m.roles.customRoleDesc,
      assignedUserCount: 1,
      isSystemRole: false,
      permissions: {
        kpi_view: true,
        kpi_export: true,
        etl_view: true,
        etl_trigger: false,
        etl_manage_engine: false,
        admin_roles: false,
        admin_preferences: true,
      },
    };

    const created = await roleService.createRole(newRole);
    setRoles((prev) => [...prev, created]);
    setSelectedRoleId(created.roleId);
  };

  const categories = Array.from(
    new Set(mockFunctionPermissions.map((p) => p.category))
  );

  // Construct active role's active permission keys for REST payload demonstration
  const grantedPermissionKeys = Object.entries(currentRole?.permissions || {})
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);

  const sampleRestPayload = {
    roleId: currentRole?.roleId,
    updatedBy: 'admin_user_01',
    permissions: grantedPermissionKeys,
  };

  const sampleCurlCmd = `curl -X PUT "https://api.datacenter.internal/v1/roles/${currentRole?.roleId}/permissions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <jwt_access_token>" \\
  -d '${JSON.stringify(sampleRestPayload)}'`;

  if (isLoading) {
    return (
      <div className="p-8 enterprise-panel flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">
        Loading Role Authorization Matrix...
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-main)] pb-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)]" />
            {m.roles.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {m.roles.subtitle}
          </p>
        </div>

        {/* View Switcher Tabs & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-[var(--border-main)] rounded-md p-1 bg-[var(--bg-subtle)]">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{m.roles.matrixTab}</span>
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
              <span>{m.roles.specTab}</span>
            </button>
          </div>

          <button id="add-role-btn" onClick={handleAddRole} className="btn-enterprise-secondary text-sm">
            <Plus className="w-4 h-4" />
            <span>{m.roles.addRole}</span>
          </button>

          <button
            id="save-permissions-btn"
            onClick={handleSavePermissions}
            disabled={isSaving}
            className="btn-enterprise-primary text-sm"
          >
            {showSaveToast ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Syncing...' : showSaveToast ? m.roles.permissionsUpdated : m.roles.savePermissions}</span>
          </button>
        </div>
      </div>

      {showSaveToast && (
        <div className="p-3 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success-text)] border border-[var(--status-success-border)] text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {m.roles.syncSuccessMsg}
        </div>
      )}

      {/* MATRIX VIEW */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
          {/* Left Column: Role List Selector */}
          <div className="enterprise-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2 text-xs uppercase font-bold text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[var(--brand-primary)]" /> {m.roles.systemRoles}
              </span>
              <span>{roles.length}</span>
            </div>

            <div className="space-y-2">
              {roles.map((role) => {
                const isSelected = role.roleId === selectedRoleId;
                const activePermsCount = Object.values(role.permissions).filter(Boolean).length;

                return (
                  <button
                    key={role.roleId}
                    onClick={() => setSelectedRoleId(role.roleId)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[var(--brand-primary-light)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                        : 'bg-[var(--bg-surface)] border-[var(--border-main)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[var(--text-primary)]">
                        {getRoleName(role)}
                      </span>
                      {role.isSystemRole && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
                          {m.roles.systemBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {getRoleDescription(role)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-1">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> {role.assignedUserCount} {m.roles.assignedUsers}
                      </span>
                      <span className="font-semibold text-[var(--brand-primary)]">
                        {activePermsCount} / {mockFunctionPermissions.length} {m.roles.rightsCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Function Usage Right Authorization Matrix */}
          <div className="lg:col-span-2 enterprise-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[var(--brand-primary)]" />
                  {getRoleName(currentRole)} — {m.roles.rightsConfig}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {m.roles.toggleHint}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {categories.map((cat) => {
                const permsInCat = mockFunctionPermissions.filter((p) => p.category === cat);

                return (
                  <div key={cat} className="space-y-3">
                    <div className="bg-[var(--bg-subtle)] px-3 py-1.5 rounded border border-[var(--border-main)] text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                      {cat}
                    </div>

                    <div className="divide-y divide-[var(--border-muted)] border border-[var(--border-main)] rounded-lg overflow-hidden">
                      {permsInCat.map((perm) => {
                        const isEnabled = !!currentRole.permissions[perm.key];
                        const isLocked = currentRole.isSystemRole && perm.key === 'admin_roles';

                        return (
                          <div
                            key={perm.key}
                            className="p-3.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              {isEnabled ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <XCircle className="w-5 h-5 text-[var(--text-tertiary)] shrink-0" />
                              )}
                              <div>
                                <span className="font-bold text-sm text-[var(--text-primary)] block">
                                  {getPermLabel(perm.key)}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)]">
                                  {m.roles.functionalKey}: <code className="text-[var(--brand-primary)] bg-[var(--bg-subtle)] px-1 py-0.5 rounded">{perm.key}</code>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isLocked ? (
                                <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" /> {m.roles.mandated}
                                </span>
                              ) : (
                                <button
                                  onClick={() => togglePermission(perm.key)}
                                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                                    isEnabled ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-main)]'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                      isEnabled ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BACKEND API & DATA SPEC VIEW */}
      {activeTab === 'spec' && (
        <div className="space-y-5 w-full">
          {/* RESTful API Section */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Code2 className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {m.roles.restApiTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-2">
                <span className="font-bold text-[var(--brand-primary)] block">1. GET /api/v1/roles</span>
                <p className="text-[var(--text-secondary)]">
                  Fetches all roles, user counts, system status, and authorized permission keys.
                </p>
                <div className="p-2 bg-[var(--bg-surface)] rounded border border-[var(--border-main)] text-[11px]">
                  Response: <code className="text-emerald-600 dark:text-emerald-400">200 OK Array&lt;RoleDto&gt;</code>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-2">
                <span className="font-bold text-[var(--brand-primary)] block">2. PUT /api/v1/roles/:roleId/permissions</span>
                <p className="text-[var(--text-secondary)]">
                  Updates authorized function keys array for target role ID.
                </p>
                <div className="p-2 bg-[var(--bg-surface)] rounded border border-[var(--border-main)] text-[11px]">
                  Response: <code className="text-emerald-600 dark:text-emerald-400">200 OK &#123; success: true, updatedAt &#125;</code>
                </div>
              </div>
            </div>

            {/* Live JSON Payload Inspector */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[var(--brand-primary)]" />
                Live Payload for Role: <code className="text-[var(--brand-primary)]">{currentRole?.roleId}</code>
              </span>
              <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs overflow-x-auto">
                {JSON.stringify(sampleRestPayload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Database DDL Section */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Database className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {m.roles.dbSchemaTitle}
              </h3>
            </div>

            <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs overflow-x-auto">
              {sqlSchemaDdl}
            </pre>
          </div>

          {/* cURL Example Section */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Terminal className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {m.roles.curlExampleTitle}
              </h3>
            </div>

            <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs overflow-x-auto">
              {sampleCurlCmd}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
