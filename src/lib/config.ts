/**
 * Centralized Multi-Environment (DEV / UAT / PRD) Configuration Module
 */

export type EnvironmentProfile = 'DEV' | 'UAT' | 'PRD';

export interface EnvConfig {
  appEnv: EnvironmentProfile;
  postgrestUrl: string;
  addaxEngineUrl: string;
  enableLivePostgrest: boolean;
  internalSecret: string;
  dbHost: string;
  dbName: string;
  badgeLabel: string;
  badgeStyle: string;
}

export const ENV_PROFILES: Record<EnvironmentProfile, EnvConfig> = {
  DEV: {
    appEnv: 'DEV',
    postgrestUrl: process.env.POSTGREST_DEV_URL || process.env.POSTGREST_INTERNAL_URL || 'http://127.0.0.1:3000',
    addaxEngineUrl: process.env.ADDAX_DEV_URL || process.env.ADDAX_ENGINE_URL || 'http://127.0.0.1:8080/api/v1/etl',
    enableLivePostgrest: process.env.ENABLE_LIVE_POSTGREST === 'true',
    internalSecret: process.env.INTERNAL_API_SECRET || 'dev-bff-secret-key-2026',
    dbHost: process.env.POSTGRES_HOST || '127.0.0.1:5432',
    dbName: 'ops_platform_dev',
    badgeLabel: 'DEV (Development)',
    badgeStyle: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  },
  UAT: {
    appEnv: 'UAT',
    postgrestUrl: process.env.POSTGREST_UAT_URL || 'http://uat-db.corp.internal:3000',
    addaxEngineUrl: process.env.ADDAX_UAT_URL || 'http://uat-etl.corp.internal:8080/api/v1/etl',
    enableLivePostgrest: true,
    internalSecret: process.env.UAT_INTERNAL_SECRET || 'uat-bff-secret-key-2026',
    dbHost: 'uat-pg-cluster.corp.internal:5432',
    dbName: 'ops_platform_uat',
    badgeLabel: 'UAT (Staging)',
    badgeStyle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  },
  PRD: {
    appEnv: 'PRD',
    postgrestUrl: process.env.POSTGREST_PRD_URL || 'http://prd-db.corp.internal:3000',
    addaxEngineUrl: process.env.ADDAX_PRD_URL || 'http://prd-etl.corp.internal:8080/api/v1/etl',
    enableLivePostgrest: true,
    internalSecret: process.env.PRD_INTERNAL_SECRET || 'prd-bff-secret-key-2026',
    dbHost: 'prd-pg-cluster.corp.internal:5432',
    dbName: 'ops_platform_prd',
    badgeLabel: 'PRD (Production)',
    badgeStyle: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  },
};

/**
 * Gets the active environment profile configuration based on process.env.NEXT_PUBLIC_APP_ENV or param override
 */
export function getActiveEnvConfig(overrideEnv?: string): EnvConfig {
  const envKey = (overrideEnv || process.env.NEXT_PUBLIC_APP_ENV || 'DEV').toUpperCase() as EnvironmentProfile;
  return ENV_PROFILES[envKey] || ENV_PROFILES.DEV;
}

export const apiConfig = {
  activeEnv: getActiveEnvConfig(),
  appEnv: getActiveEnvConfig().appEnv,
  postgrest: {
    internalUrl: getActiveEnvConfig().postgrestUrl,
    internalSecret: getActiveEnvConfig().internalSecret,
    timeoutMs: parseInt(process.env.POSTGREST_TIMEOUT_MS || '5000', 10),
  },
  addax: {
    engineUrl: getActiveEnvConfig().addaxEngineUrl,
    timeoutMs: parseInt(process.env.ADDAX_ENGINE_TIMEOUT_MS || '5000', 10),
  },
};
