export type Timeframe = '24h' | '7d' | '30d' | '90d';

export type ActiveTab = 'overview' | 'analytics' | 'logs' | 'ai-assistant' | 'performance' | 'settings';

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  subValue: string;
  change: string;
  isPositive: boolean;
  category: string;
}

export interface ChartPoint {
  timestamp: string;
  requests: number;
  latency: number;
  tokens: number;
  errors: number;
}

export interface ModelUsage {
  name: string;
  color: string;
  share: number;
  requestCount: number;
  totalTokens: string;
  avgLatency: number;
  cost: string;
}

export interface RequestLog {
  id: string;
  timestamp: string;
  model: string;
  endpoint: string;
  status: '200 OK' | '429 Rate Limit' | '500 Error' | '503 Unavailable';
  statusCode: number;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: string;
  region: string;
  clientIp: string;
  promptSnippet: string;
  responseSnippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chartSuggestion?: string;
  actionableInsights?: string[];
}
