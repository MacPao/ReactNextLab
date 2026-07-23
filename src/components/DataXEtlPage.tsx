'use client';

import React, { useState, useEffect } from 'react';
import { EtlJob } from '../types/poc';
import { useI18n } from '../context/I18nContext';
import { etlService, etlSqlSchemaDdl } from '../services/etlService';
import { 
  Database, 
  Play, 
  RefreshCw, 
  ArrowRight, 
  Server, 
  Cpu, 
  BarChart2, 
  HardDrive,
  Eye,
  X,
  Code2,
  Grid,
  Terminal,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export const DataXEtlPage: React.FC = () => {
  const { locale, m } = useI18n();
  const [jobs, setJobs] = useState<EtlJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<EtlJob | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'spec'>('overview');
  const [selectedSpecJobId, setSelectedSpecJobId] = useState<string>('job_addax_01');
  const [copiedSample, setCopiedSample] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    etlService.getJobs().then((data) => {
      if (isMounted) {
        setJobs(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    await etlService.triggerJob('job_addax_03');
    const updated = await etlService.getJobs();
    setJobs(updated);
    setIsSyncing(false);
  };

  const currentSpecJob = jobs.find((j) => j.jobId === selectedSpecJobId) || jobs[0];

  const getAddaxJsonConfig = (job?: EtlJob) => {
    const jobName = job ? job.jobName : 'addax_pos_tx_sync';
    return JSON.stringify(
      {
        job: {
          setting: {
            speed: {
              channel: 8,
              byte: 104857600
            },
            errorLimit: {
              record: 0,
              percentage: 0.02
            }
          },
          content: [
            {
              reader: {
                name: "mysqlreader",
                parameter: {
                  username: "pos_etl_reader",
                  password: "****************",
                  column: ["id", "pos_id", "amount", "transactions", "tx_timestamp"],
                  connection: [
                    {
                      jdbcUrl: ["jdbc:mysql://10.240.12.8:3306/pos_transactions_db"],
                      table: [jobName.replace('addax_', '')]
                    }
                  ]
                }
              },
              writer: {
                name: "clickhousewriter",
                parameter: {
                  jdbcUrl: "jdbc:clickhouse://10.240.12.20:8123/olap_analytics",
                  table: `fact_${jobName}`,
                  column: ["id", "pos_id", "amount", "transactions", "tx_timestamp"],
                  batchSize: 65536
                }
              }
            }
          ]
        }
      },
      null,
      2
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSample(label);
    setTimeout(() => setCopiedSample(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-8 enterprise-panel flex items-center justify-center text-sm text-[var(--text-secondary)] font-medium">
        Loading Addax ETL Engine & Pipeline Jobs...
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-main)] pb-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--brand-primary)]" />
            {m.etl.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {m.etl.subtitle}
          </p>
        </div>

        {/* View Switcher & Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-[var(--border-main)] rounded-md p-1 bg-[var(--bg-subtle)]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{m.etl.overviewTab || 'Pipeline Overview'}</span>
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
              <span>{m.etl.specTab || 'Engine JSON & API Spec'}</span>
            </button>
          </div>

          <button
            id="trigger-datax-btn"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="btn-enterprise-primary"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isSyncing ? m.etl.executingJob : m.etl.triggerJob}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="enterprise-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">{m.etl.jobsConfigured}</span>
            <span className="text-base font-bold text-[var(--text-primary)]">{jobs.length} Addax Jobs</span>
          </div>
        </div>

        <div className="enterprise-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">{m.etl.executionEngine}</span>
            <span className="text-base font-bold text-[var(--text-primary)]">Addax v4.2.8</span>
          </div>
        </div>

        <div className="enterprise-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">{m.etl.hostCluster}</span>
            <span className="text-base font-bold text-[var(--text-primary)]">DEV-CLUSTER</span>
          </div>
        </div>

        <div className="enterprise-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-[var(--bg-subtle)] text-emerald-600 border border-[var(--border-main)]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] block">{m.etl.avgThroughput}</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">28.4 MB/s</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="enterprise-panel p-5 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[var(--brand-primary)]" />
              {m.etl.tableTitle}
            </h3>
            <span className="badge-status badge-status-success">
              {m.etl.engineOnline}
            </span>
          </div>

          <div className="overflow-x-auto rounded-md border border-[var(--border-main)] w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-b border-[var(--border-main)] uppercase text-xs tracking-wider whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4">{m.etl.table.jobName}</th>
                  <th className="py-3 px-4">{m.etl.table.pipeline}</th>
                  <th className="py-3 px-4">{m.etl.table.engineHost}</th>
                  <th className="py-3 px-4">{m.etl.table.environment}</th>
                  <th className="py-3 px-4">{m.etl.table.statistics}</th>
                  <th className="py-3 px-4">{m.etl.table.status}</th>
                  <th className="py-3 px-4 text-right">{m.etl.table.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-muted)] text-[var(--text-primary)] whitespace-nowrap">
                {jobs.map((job) => (
                  <tr key={job.jobId} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--text-primary)]">{job.jobName}</span>
                        <span className="text-xs text-[var(--brand-primary)]">{job.jobId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                        <span>{job.pipeline.split(' → ')[0]}</span>
                        <ArrowRight className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                        <span>{job.pipeline.split(' → ')[1]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--text-primary)]">{job.executionEngine}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{job.host}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-main)] text-xs font-bold text-[var(--text-secondary)]">
                        {job.environment}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--brand-primary)]">{job.recordsProcessed} rec</span>
                        <span className="text-xs text-[var(--text-secondary)]">{job.throughputMb}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge-status ${
                          job.executionStatus === 'SUCCESS'
                            ? 'badge-status-success'
                            : 'badge-status-warning'
                        }`}
                      >
                        {job.executionStatus === 'SUCCESS' ? m.etl.statusSuccess : m.etl.statusRunning}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="btn-enterprise-secondary p-1.5"
                        title={m.etl.inspectJob}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SPEC TAB VIEW */}
      {activeTab === 'spec' && (
        <div className="space-y-5 w-full">
          {/* Select Job JSON Config Inspector */}
          <div className="enterprise-panel p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-main)] pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[var(--brand-primary)]" />
                <h3 className="font-bold text-base text-[var(--text-primary)]">
                  {m.etl.jsonConfigTitle || 'Addax Reader / Writer JSON Configuration Spec'}
                </h3>
              </div>

              {/* Select Job Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Select Pipeline:</span>
                <select
                  value={selectedSpecJobId}
                  onChange={(e) => setSelectedSpecJobId(e.target.value)}
                  className="enterprise-input text-xs py-1"
                >
                  {jobs.map((j) => (
                    <option key={j.jobId} value={j.jobId}>
                      {j.jobName} ({j.jobId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              This JSON specification defines the Readers (MySQL, PostgreSQL, Oracle, Kafka) and Writers (ClickHouse, BigQuery, Elasticsearch) configured for the standalone Addax / DataX engine executor.
            </p>

            <div className="relative">
              <button
                onClick={() => copyToClipboard(getAddaxJsonConfig(currentSpecJob), 'json')}
                className="absolute top-3 right-3 btn-enterprise-secondary text-xs py-1 px-2 flex items-center gap-1 z-10"
              >
                {copiedSample === 'json' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{copiedSample === 'json' ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="p-4 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs font-mono overflow-x-auto max-h-[360px]">
                {getAddaxJsonConfig(currentSpecJob)}
              </pre>
            </div>
          </div>

          {/* REST API & CLI Execution Spec */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div className="enterprise-panel p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
                <Terminal className="w-5 h-5 text-[var(--brand-primary)]" />
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {m.etl.restApiTitle || 'ETL Control Console Backend API Service Contract'}
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">GET</span> /api/v1/etl/jobs
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    Fetches all registered pipeline topologies and status statistics.
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">POST</span> /api/v1/etl/jobs/:jobId/trigger
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    Triggers asynchronous execution of Addax engine with target JSON payload.
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">GET</span> /api/v1/etl/engine/health
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    Engine cluster heartbeat probe returning node health, version, and active worker node status.
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-amber-600 dark:text-amber-400">GET</span> /api/v1/etl/jobs/:jobId/logs
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    Streams execution telemetry, record counts, and byte transfer metrics.
                  </div>
                </div>
              </div>
            </div>

            <div className="enterprise-panel p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
                <Cpu className="w-5 h-5 text-[var(--brand-primary)]" />
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {m.etl.cliCmdTitle || 'Addax Standalone Engine CLI Execution Sample'}
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono text-[var(--text-primary)] leading-relaxed">
                  # Execute Addax Engine via Standalone Runner<br/>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    bin/addax.sh -p ./jobs/{currentSpecJob ? currentSpecJob.jobId : 'job_01'}.json
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono text-[var(--text-primary)] leading-relaxed">
                  # Execute with JVM Heap Overrides<br/>
                  <span className="text-blue-600 dark:text-blue-400">
                    PYTHON_PATH/python bin/addax.sh -j "-Xms4g -Xmx8g" ./jobs/{currentSpecJob ? currentSpecJob.jobId : 'job_01'}.json
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database DDL Section */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Database className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {m.etl.dbSchemaTitle || 'ETL Pipeline & Execution Telemetry Database Schema (DDL)'}
              </h3>
            </div>

            <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs overflow-x-auto">
              {etlSqlSchemaDdl}
            </pre>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="enterprise-panel bg-[var(--bg-surface)] w-full max-w-xl p-6 relative shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)] mb-4">
              <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Database className="w-5 h-5 text-[var(--brand-primary)]" />
                {m.etl.modalTitle}: {selectedJob.jobName}
              </h4>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-[var(--bg-subtle)] p-3 rounded border border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)] text-xs block">{m.etl.jobId}</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{selectedJob.jobId}</span>
              </div>
              <div className="bg-[var(--bg-subtle)] p-3 rounded border border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)] text-xs block">{m.etl.executionEngine}</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{selectedJob.executionEngine}</span>
              </div>
              <div className="bg-[var(--bg-subtle)] p-3 rounded border border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)] text-xs block">{m.etl.hostNode}</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{selectedJob.host}</span>
              </div>
              <div className="bg-[var(--bg-subtle)] p-3 rounded border border-[var(--border-main)]">
                <span className="text-[var(--text-secondary)] text-xs block">{m.etl.table.environment}</span>
                <span className="font-bold text-[var(--brand-primary)] text-sm">{selectedJob.environment}</span>
              </div>
            </div>

            <div className="bg-[var(--bg-subtle)] p-4 rounded border border-[var(--border-main)] space-y-2 text-sm mb-5">
              <div className="font-bold text-[var(--text-primary)] border-b border-[var(--border-main)] pb-1.5 text-xs">
                {m.etl.execStats}
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{m.etl.recordsProcessed}:</span>
                <strong className="text-[var(--text-primary)]">{selectedJob.recordsProcessed}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{m.etl.syncThroughput}:</span>
                <strong className="text-[var(--brand-primary)]">{selectedJob.throughputMb} ({selectedJob.statistics.recordsPerSec})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{m.etl.totalBytes}:</span>
                <strong className="text-[var(--text-primary)]">{selectedJob.statistics.totalBytes}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{m.etl.errorCount}:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{selectedJob.statistics.errorCount}</strong>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setSelectedJob(null)} className="btn-enterprise-secondary text-sm">
                {m.etl.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
