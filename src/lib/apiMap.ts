import { apiConfig } from './config';

/**
 * Centralized API Route Mapping Registry
 * Maps local frontend route paths (/api/*) to internal/remote PostgREST & ETL endpoints.
 */
export interface ApiRouteMapping {
  id: string;
  localPath: string;
  remoteEndpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  targetUrl: (baseUrl?: string) => string;
}

export const API_ROUTE_MAPPINGS: Record<string, ApiRouteMapping> = {
  getOrderToday: {
    id: 'get_order_today',
    localPath: '/api/get_order_today',
    remoteEndpoint: '/rpc/get_order_today',
    method: 'GET',
    description: 'Fetches today revenue and transaction summary via PostgREST RPC function',
    targetUrl: (baseUrl = apiConfig.postgrest.internalUrl) => `${baseUrl}/rpc/get_order_today`,
  },
  posProducts: {
    id: 'pos_products',
    localPath: '/api/kpi/pos-products',
    remoteEndpoint: '/pos_products?select=*&order=daily_revenue.desc',
    method: 'GET',
    description: 'Fetches POS products fleet metrics sorted by daily revenue',
    targetUrl: (baseUrl = apiConfig.postgrest.internalUrl) => `${baseUrl}/pos_products?select=*&order=daily_revenue.desc`,
  },
  etlJobs: {
    id: 'etl_jobs',
    localPath: '/api/etl/jobs',
    remoteEndpoint: '/etl_jobs?select=*',
    method: 'GET',
    description: 'Retrieves configured Addax ETL pipeline topologies & execution status',
    targetUrl: (baseUrl = apiConfig.postgrest.internalUrl) => `${baseUrl}/etl_jobs?select=*`,
  },
  etlEngineHealth: {
    id: 'etl_engine_health',
    localPath: '/api/etl/engine/health',
    remoteEndpoint: '/api/v1/etl/health',
    method: 'GET',
    description: 'Heartbeat probe for Addax ETL runner and active worker nodes',
    targetUrl: (baseUrl = apiConfig.addax.engineUrl) => `${baseUrl}/health`,
  },
};
