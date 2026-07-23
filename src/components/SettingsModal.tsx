'use client';

import React, { useState } from 'react';
import { Settings, Key, Bell, X, Check, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('AIzaSyD-NexusKey-9942aXk8201');
  const [defaultModel, setDefaultModel] = useState<string>('Gemini 1.5 Flash');
  const [rateLimit, setRateLimit] = useState<number>(120);
  const [enableAlerts, setEnableAlerts] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel bg-white w-full max-w-lg p-6 relative border-sky-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Studio & API Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {/* API Key Config */}
          <div>
            <label className="text-slate-700 block mb-1.5 font-semibold flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-500" /> API Key Authentication
            </label>
            <input
              id="settings-api-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="glass-input w-full font-mono text-xs text-slate-800"
            />
          </div>

          {/* Default Foundation Model */}
          <div>
            <label className="text-slate-700 block mb-1.5 font-semibold">
              Default Foundation Model Target
            </label>
            <select
              id="settings-default-model-select"
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="glass-input w-full font-mono text-xs bg-white text-slate-800"
            >
              <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Recommended - Ultra Fast)</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep Context Reasoning)</option>
              <option value="Gemini 1.5 Flash-Lite">Gemini 1.5 Flash-Lite (Cost Optimized)</option>
            </select>
          </div>

          {/* Rate Limiting */}
          <div>
            <label className="text-slate-700 block mb-1.5 font-semibold flex items-center justify-between">
              <span>Safety Threshold Rate Limit</span>
              <span className="text-sky-700 font-bold">{rateLimit} req/min</span>
            </label>
            <input
              id="settings-rate-limit-range"
              type="range"
              min="30"
              max="300"
              step="10"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Alerts Toggle */}
          <div className="flex items-center justify-between p-3 bg-sky-50 rounded-xl border border-sky-200">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-600" />
              <div>
                <span className="text-slate-900 font-bold block">Latency Spike Webhooks</span>
                <span className="text-[10px] text-slate-500">Notify when latency exceeds 300ms</span>
              </div>
            </div>
            <input
              id="settings-alerts-checkbox"
              type="checkbox"
              checked={enableAlerts}
              onChange={(e) => setEnableAlerts(e.target.checked)}
              className="w-4 h-4 accent-sky-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary px-4 py-2 text-xs">
            Cancel
          </button>
          <button
            id="settings-save-btn"
            onClick={handleSave}
            className="btn-primary px-4 py-2 text-xs"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
