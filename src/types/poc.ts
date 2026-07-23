export type PageId = 'kpi-pos' | 'etl-datax' | 'admin-roles' | 'admin-users' | 'admin-preferences';
export type Language = 'zh-TW' | 'zh-CN' | 'en-US' | 'ja-JP';
export type AppTheme = 'light' | 'dark' | 'system';

export interface NavGroup {
  id: string;
  title: string;
  iconName: string;
  items: {
    id: PageId;
    title: string;
    description: string;
  }[];
}

export interface PosProduct {
  id: string;
  name: string;
  code: string;
  dailyRevenue: string;
  transactions: number;
  avgTicket: string;
  uptime: string;
  status: 'Online' | 'Warning' | 'Maintenance';
  growth: string;
}

export interface EtlJob {
  jobId: string;
  jobName: string;
  pipeline: string;
  executionEngine: string;
  environment: string;
  host: string;
  recordsProcessed: string;
  throughputMb: string;
  duration: string;
  executionStatus: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'PENDING';
  lastExecutionTime: string;
  statistics: {
    recordsPerSec: string;
    errorCount: number;
    totalBytes: string;
  };
}

export interface FunctionPermissionItem {
  key: string;
  labelEn: string;
  labelZh: string;
  labelZhCn: string;
  labelJa: string;
  category: 'KPI Dashboard' | 'ETL Console' | 'Admin Console';
}

export interface RoleDefinition {
  roleId: string;
  roleNameEn: string;
  roleNameZh: string;
  roleNameZhCn: string;
  roleNameJa: string;
  descriptionEn: string;
  descriptionZh: string;
  descriptionZhCn: string;
  descriptionJa: string;
  assignedUserCount: number;
  isSystemRole: boolean;
  permissions: Record<string, boolean>; // key -> boolean
}

export type AccountType = 'AD' | 'LOCAL';

export interface UserAccount {
  userId: string;
  username: string; // e.g. "j.smith"
  displayName: string;
  email: string;
  accountType: AccountType;
  upn?: string; // e.g. "john.smith@corp.domain"
  department: string;
  title: string;
  roleId: string; // references RoleDefinition.roleId
  status: 'ACTIVE' | 'DISABLED';
  lastLogin: string;
}
