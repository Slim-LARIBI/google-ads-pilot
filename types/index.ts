// Types pour l'application Google Ads Pilot - Multi-channel

// Channels supportés
export type Channel = 'sea' | 'seo' | 'meta';

export const CHANNELS: Record<Channel, { label: string; icon: string; isActive: boolean }> = {
  sea: { label: 'Google Ads (SEA)', icon: '🎯', isActive: true },
  seo: { label: 'SEO', icon: '🔍', isActive: false },
  meta: { label: 'Meta Ads', icon: '📱', isActive: false },
};

export type Priority = 'P0' | 'P1' | 'P2';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type ActionStatus = 'pending' | 'validated' | 'rejected';

// Types d'actions étendus pour multi-channel
export type ActionType =
  // SEA
  | 'pause_campaign'
  | 'adjust_budget'
  | 'add_negative_keyword'
  | 'adjust_bid'
  // SEO (futur)
  | 'fix_technical_issue'
  | 'optimize_content'
  | 'add_backlinks'
  // META (futur)
  | 'refresh_creative'
  | 'adjust_audience'
  | 'change_placement';

export interface KPI {
  label: string;
  value: string | number;
  change?: number; // Pourcentage de changement
  trend?: 'up' | 'down' | 'stable';
}

// Campaign étendu pour multi-channel
export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  status: 'active' | 'paused' | 'ended';
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
  clicks: number;
  impressions: number;
  // Métriques spécifiques SEO
  traffic?: number;
  keywords?: number;
  // Métriques spécifiques META
  reach?: number;
  frequency?: number;
}

export interface Alert {
  id: string;
  channel: Channel;
  severity: AlertSeverity;
  priority: Priority;
  title: string;
  message: string;
  campaign: string;
  metric: string;
  currentValue: number;
  threshold: number;
  createdAt: string;
  recommendation: string;
}

export interface Action {
  id: string;
  channel: Channel;
  type: ActionType;
  campaign: string;
  reason: string;
  metric: string;
  currentValue: number;
  threshold: number;
  estimatedImpact: string;
  priority: Priority;
  status: ActionStatus;
  createdAt: string;
  details: string;
}

export interface Rule {
  id: string;
  channel: Channel;
  name: string;
  objective: string;
  metric: string;
  operator: string;
  threshold: number;
  action: string;
  priority: Priority;
  isActive: boolean;
}

export interface HistoryEntry {
  id: string;
  channel: Channel;
  type: 'audit' | 'action_validated' | 'action_rejected';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  campaign?: string;
}

export interface Finding {
  id: string;
  channel: Channel;
  priority: Priority;
  title: string;
  description: string;
  affectedCampaigns: string[];
  estimatedSavings?: number;
  recommendation: string;
}

export interface AuditResult {
  timestamp: string;
  healthScore: number;
  findings: Finding[];
  campaigns: Campaign[];
}
