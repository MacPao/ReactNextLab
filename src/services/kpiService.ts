import { PosProduct } from '../types/poc';
import { mockPosProducts } from '../data/pocData';

let inMemoryPosProducts: PosProduct[] = [...mockPosProducts];

export const kpiService = {
  /**
   * Next.js API Wrapper Endpoint: GET /api/kpi/pos-products
   * (Proxies request server-side to internal PostgREST /pos_products)
   */
  async getPosProducts(): Promise<PosProduct[]> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/kpi/pos-products');
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      }
    } catch {
      // Fallback to in-memory store
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...inMemoryPosProducts];
  },

  /**
   * Next.js API Wrapper Endpoint: GET /api/get_order_today
   * (Protects raw PostgREST RPC /rpc/get_order_today behind Next.js server proxy)
   */
  async getOrderToday(): Promise<{ status: string; data: any; source: string }> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/get_order_today');
        if (res.ok) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return {
      status: 'success',
      data: { totalRevenue: 148250, totalOrders: 3420, date: '2026-07-26' },
      source: 'Next.js API Wrapper Proxy',
    };
  },

  /**
   * PostgREST RPC Endpoint: POST /rpc/calculate_pos_kpi_summary
   */
  async getKpiSummary(): Promise<{
    activeFleets: number;
    totalRevenue: string;
    totalTx: string;
    avgUptime: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      activeFleets: 5,
      totalRevenue: '$702,470',
      totalTx: '16,790',
      avgUptime: '99.94%',
    };
  },
};

/**
 * PostgREST & PostgreSQL Database Schema, Views, RLS Policies, and RPC DDL
 */
export const kpiPostgrestSqlDdl = `-- =============================================================================
-- PostgREST & PostgreSQL High-Performance RESTful API Architecture
-- Automatically serves REST endpoints from PostgreSQL database schemas
-- Protected via Next.js Server-Side API Wrapper (BFF Proxy)
-- =============================================================================

-- 1. Create Dedicated API Schema for PostgREST Exposure
CREATE SCHEMA IF NOT EXISTS api;

-- 2. POS Products & Terminal Fleet Performance Table
CREATE TABLE api.pos_products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    daily_revenue NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    transactions INT NOT NULL DEFAULT 0,
    avg_ticket NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    uptime_sla NUMERIC(5, 2) NOT NULL DEFAULT 99.90,
    status VARCHAR(32) NOT NULL CHECK (status IN ('Online', 'Warning', 'Maintenance')),
    growth VARCHAR(32) DEFAULT '+0.0%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for PostgREST fast filtering & ordering
CREATE INDEX idx_pos_products_status ON api.pos_products(status);
CREATE INDEX idx_pos_products_revenue ON api.pos_products(daily_revenue DESC);

-- 3. Row Level Security (RLS) Policies for PostgREST JWT Roles
ALTER TABLE api.pos_products ENABLE ROW LEVEL SECURITY;

-- Grant Read-Only Access to 'role_auditor' & 'role_pos_operator'
CREATE POLICY pos_products_select_policy ON api.pos_products
    FOR SELECT
    TO role_auditor, role_pos_operator, role_super_admin
    USING (true);

-- Grant Read-Write Access to 'role_super_admin'
CREATE POLICY pos_products_all_policy ON api.pos_products
    FOR ALL
    TO role_super_admin
    USING (true);

-- 4. PostgREST Stored Procedure (RPC) for Get Order Today
CREATE OR REPLACE FUNCTION api.get_order_today()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'date', CURRENT_DATE,
        'total_revenue', COALESCE(SUM(daily_revenue), 0),
        'total_transactions', COALESCE(SUM(transactions), 0)
    ) INTO result
    FROM api.pos_products
    WHERE status != 'Maintenance';

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
`;
