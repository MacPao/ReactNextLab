import { EtlJob } from '../types/poc';
import { mockEtlJobs } from '../data/pocData';

let inMemoryEtlJobs: EtlJob[] = [...mockEtlJobs];

export const etlService = {
  /**
   * GET /api/v1/etl/jobs
   * Fetches all configured Addax / DataX ETL pipeline jobs
   */
  async getJobs(): Promise<EtlJob[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...inMemoryEtlJobs];
  },

  /**
   * GET /api/v1/etl/engine/health
   * Probes Addax ETL standalone runner & cluster node heartbeat status
   */
  async getEngineHealth(): Promise<{ status: 'ONLINE' | 'DEGRADED' | 'OFFLINE'; activeNodes: number; version: string; uptimeSec: number }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      status: 'ONLINE',
      activeNodes: 3,
      version: 'Addax v4.2.8',
      uptimeSec: 864200,
    };
  },

  /**
   * POST /api/v1/etl/jobs/:jobId/trigger
   * Triggers execution of a specific Addax ETL pipeline
   */
  async triggerJob(jobId: string): Promise<{ success: boolean; executionId: string; startTime: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    inMemoryEtlJobs = inMemoryEtlJobs.map((j) => {
      if (j.jobId === jobId || jobId === 'job_addax_03') {
        return {
          ...j,
          executionStatus: 'SUCCESS',
          lastExecutionTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
      }
      return j;
    });

    return {
      success: true,
      executionId: `exec_addax_${Date.now()}`,
      startTime: new Date().toISOString(),
    };
  },
};

/**
 * Addax / DataX Technical Pipeline & Database DDL Schema Spec
 */
export const etlSqlSchemaDdl = `-- Addax / DataX ETL Pipeline Database Schema (PostgreSQL / MySQL)

-- 1. ETL Pipeline Master Table
CREATE TABLE etl_jobs (
    job_id VARCHAR(64) PRIMARY KEY,
    job_name VARCHAR(128) NOT NULL UNIQUE,
    pipeline_topology VARCHAR(255) NOT NULL, -- e.g. 'MySQL (POS-DB) -> ClickHouse (OLAP)'
    execution_engine VARCHAR(64) NOT NULL,    -- e.g. 'Addax Engine v4.2.8'
    environment VARCHAR(64) NOT NULL,         -- e.g. 'DEV-CLUSTER-01'
    host_node VARCHAR(128) NOT NULL,
    reader_plugin VARCHAR(64) NOT NULL,       -- e.g. 'mysqlreader'
    writer_plugin VARCHAR(64) NOT NULL,       -- e.g. 'clickhousewriter'
    cron_expression VARCHAR(64),
    status VARCHAR(32) DEFAULT 'ACTIVE'
);

-- 2. ETL Job Execution Telemetry Logs Table
CREATE TABLE etl_execution_logs (
    execution_id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) REFERENCES etl_jobs(job_id) ON DELETE CASCADE,
    execution_status VARCHAR(32) NOT NULL CHECK (execution_status IN ('SUCCESS', 'RUNNING', 'FAILED', 'PENDING')),
    records_processed BIGINT DEFAULT 0,
    throughput_mb_per_sec DECIMAL(10, 2),
    records_per_sec BIGINT,
    total_bytes_transferred BIGINT,
    error_count INT DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE INDEX idx_etl_exec_job_id ON etl_execution_logs(job_id);
`;
