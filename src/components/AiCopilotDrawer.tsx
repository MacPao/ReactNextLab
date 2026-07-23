'use client';

import React, { useState } from 'react';
import { ChatMessage } from '../types/analytics';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  RefreshCw 
} from 'lucide-react';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: 'Hello! I am your Gemini Analytics Copilot. I continually monitor your API telemetry, latency anomalies, token expenditures, and model performance.',
      timestamp: 'Just now',
      actionableInsights: [
        'Gemini 1.5 Flash accounts for 58% of volume with under 100ms average latency.',
        'Token spending decreased by 4.2% following prompt caching implementation.',
        '1 error spike detected on Gemini 1.5 Pro due to 12.4k token prompt limits.',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const samplePrompts = [
    'Analyze latency bottleneck during peak hours',
    'How can I optimize token spend on Gemini Pro?',
    'Summarize recent 500 error root causes',
    'Compare cost efficiency: Flash vs Pro',
  ];

  const handleSend = (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponseText = '';
      let insights: string[] = [];

      if (promptText.toLowerCase().includes('latency') || promptText.toLowerCase().includes('bottleneck')) {
        aiResponseText =
          'I analyzed latency across us-central1 and europe-west1. The minor latency bump at 12:00 was caused by payload sizes exceeding 10k tokens on Gemini Pro. Routing non-critical summarization tasks to Gemini 1.5 Flash drops p95 latency from 210ms to 88ms.';
        insights = [
          'Enable Prompt Caching for static system instructions to save ~120ms per call.',
          'Use Gemini 1.5 Flash-Lite for short embedding and classification tasks.',
        ];
      } else if (promptText.toLowerCase().includes('spend') || promptText.toLowerCase().includes('cost') || promptText.toLowerCase().includes('optimize')) {
        aiResponseText =
          'Your current projected monthly spend is $530.70. By switching classification queries from Gemini Pro ($0.0028/req) to Gemini Flash-Lite ($0.00002/req), you can reduce monthly costs by up to 38%.';
        insights = [
          '32% of Gemini Pro calls are under 500 tokens and suitable for Flash.',
          'Set rate limits on key `req_` endpoints to prevent runaway loop scripts.',
        ];
      } else if (promptText.toLowerCase().includes('error') || promptText.toLowerCase().includes('500')) {
        aiResponseText =
          'Recent error logs indicate a single 500 internal error (`req_55f11a88`) due to an oversized 12.4k token un-chunked context window. All other endpoints maintain a 99.94% success SLA.';
        insights = [
          'Add client-side payload truncation before sending prompts > 10,000 tokens.',
          'Configure automated retry with exponential backoff on 429 status codes.',
        ];
      } else {
        aiResponseText = `Analysis complete for "${promptText}". Telemetry registers optimal operational health with 1.84M total requests and 99.94% SLA uptime over the past 24 hours.`;
        insights = [
          'Throughput peaked at 14.1k req/hr at 15:00 UTC.',
          'All regional edge endpoints are currently responding under 150ms.',
        ];
      }

      const aiMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableInsights: insights,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white/95 backdrop-blur-xl border-l border-sky-200 shadow-2xl flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              Gemini Analytics Copilot
            </h3>
            <p className="text-[10px] text-sky-700 font-mono font-semibold">Real-time Telemetry Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-sky-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-100 text-sky-700 border border-sky-200'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            <div
              className={`flex flex-col max-w-[82%] space-y-2 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Actionable Insights Box */}
              {msg.actionableInsights && msg.actionableInsights.length > 0 && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 w-full text-slate-700 text-[11px] space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-sky-800">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Key Insights & Suggestions:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {msg.actionableInsights.map((insight, idx) => (
                      <li key={idx} className="leading-tight">{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-sky-600 font-mono animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Gemini AI is analyzing real-time metrics...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-sky-100 bg-sky-50/50 space-y-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
          Suggested Copilot Queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-white hover:bg-sky-100 text-slate-700 border border-sky-200 px-2.5 py-1 rounded-lg transition-colors truncate max-w-full text-left shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-sky-100 bg-white flex items-center gap-2">
        <input
          id="copilot-input-field"
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Gemini about latency, tokens, or cost..."
          className="glass-input flex-1 text-xs py-2"
        />
        <button
          id="copilot-send-btn"
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isGenerating}
          className="btn-primary p-2 rounded-xl text-xs disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
