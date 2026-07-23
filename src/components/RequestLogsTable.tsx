'use client';

import React, { useState } from 'react';
import { RequestLog } from '../types/analytics';
import { 
  Terminal, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X, 
  Copy, 
  Check 
} from 'lucide-react';

interface RequestLogsTableProps {
  logs: RequestLog[];
  searchQuery: string;
}

export const RequestLogsTable: React.FC<RequestLogsTableProps> = ({ logs, searchQuery }) => {
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const itemsPerPage = 5;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.promptSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.clientIp.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'success' && log.statusCode === 200) ||
      (statusFilter === 'error' && log.statusCode !== 200);

    const matchesModel =
      modelFilter === 'all' || log.model.toLowerCase().includes(modelFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesModel;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (statusCode: number, status: string) => {
    if (statusCode === 200) {
      return (
        <span className="status-pill status-pill-success">
          <span className="pulse-dot bg-emerald-500" />
          {status}
        </span>
      );
    } else if (statusCode === 429) {
      return (
        <span className="status-pill status-pill-warning">
          <span className="pulse-dot bg-amber-500" />
          {status}
        </span>
      );
    } else {
      return (
        <span className="status-pill status-pill-danger">
          <span className="pulse-dot bg-rose-500" />
          {status}
        </span>
      );
    }
  };

  return (
    <div className="glass-panel p-6 mb-6 border-sky-100">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-600" /> Live Telemetry & Request Logs
          </h3>
          <p className="text-xs text-slate-500">
            Real-time inference logs, latency traces, and payload inspection
          </p>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="success">200 Success</option>
              <option value="error">Errors & Throttle</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-xs">
            <span className="text-slate-500 font-semibold">Model:</span>
            <select
              id="model-filter-select"
              value={modelFilter}
              onChange={(e) => {
                setModelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer"
            >
              <option value="all">All Models</option>
              <option value="flash">Gemini Flash</option>
              <option value="pro">Gemini Pro</option>
              <option value="lite">Flash-Lite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Request ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Model & Endpoint</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Latency</th>
              <th className="py-3 px-4">Tokens</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                  No request logs match your query filters.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-sky-50/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="py-3 px-4 text-sky-700 font-bold">{log.id}</td>
                  <td className="py-3 px-4 text-slate-500">{log.timestamp.split(' ')[1]}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-semibold">{log.model}</span>
                      <span className="text-[10px] text-slate-400">{log.endpoint}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(log.statusCode, log.status)}
                  </td>
                  <td className="py-3 px-4 text-cyan-700 font-bold">{log.latencyMs} ms</td>
                  <td className="py-3 px-4 text-indigo-700">{log.totalTokens} tkn</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white transition-colors text-slate-500"
                      title="Inspect payload detail"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4 text-xs font-mono text-slate-500">
        <span>
          Showing <strong>{paginatedLogs.length}</strong> of <strong>{filteredLogs.length}</strong> logs
        </span>
        <div className="flex items-center gap-2">
          <button
            id="pagination-prev-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors text-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            id="pagination-next-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors text-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative border-sky-200 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-600" />
                <h4 className="text-lg font-bold text-slate-900 font-mono">
                  Request Payload Trace: {selectedLog.id}
                </h4>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Status</span>
                {getStatusBadge(selectedLog.statusCode, selectedLog.status)}
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Latency</span>
                <span className="text-cyan-700 font-bold">{selectedLog.latencyMs} ms</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Total Tokens</span>
                <span className="text-indigo-700 font-bold">{selectedLog.totalTokens}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Est. Cost</span>
                <span className="text-emerald-700 font-bold">{selectedLog.estimatedCost}</span>
              </div>
            </div>

            {/* Prompt & Response Snippets */}
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold flex items-center justify-between">
                  <span>Input Prompt Payload</span>
                  <span className="text-[10px] text-slate-400">{selectedLog.promptTokens} prompt tokens</span>
                </label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-sky-300 overflow-x-auto whitespace-pre-wrap">
                  {selectedLog.promptSnippet}
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold flex items-center justify-between">
                  <span>Model Generated Output</span>
                  <span className="text-[10px] text-slate-400">{selectedLog.completionTokens} completion tokens</span>
                </label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {selectedLog.responseSnippet}
                </div>
              </div>

              {/* JSON Metadata Copy */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Region: <strong>{selectedLog.region}</strong> | IP: <strong>{selectedLog.clientIp}</strong>
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2))}
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
