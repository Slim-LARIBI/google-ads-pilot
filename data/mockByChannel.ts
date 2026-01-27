// Données mockées par channel (SEA / SEO / META)
import type { KPI, Channel } from '@/types';

// ============================================
// KPIs par channel
// ============================================

export const mockKPIsByChannel: Record<Channel, KPI[]> = {
  sea: [
    {
      label: 'Total Spend',
      value: '€45,234',
      change: -3.2,
      trend: 'down'
    },
    {
      label: 'Conversions',
      value: 1847,
      change: 8.5,
      trend: 'up'
    },
    {
      label: 'CPA Moyen',
      value: '€24.50',
      change: -12.3,
      trend: 'down'
    },
    {
      label: 'ROAS Moyen',
      value: '4.2x',
      change: 15.7,
      trend: 'up'
    }
  ],
  seo: [
    {
      label: 'Organic Traffic',
      value: '124,567',
      change: 12.4,
      trend: 'up'
    },
    {
      label: 'Avg Position',
      value: '8.3',
      change: -15.2,
      trend: 'down'
    },
    {
      label: 'Indexed Pages',
      value: 2843,
      change: 5.1,
      trend: 'up'
    },
    {
      label: 'Organic CTR',
      value: '3.8%',
      change: 8.9,
      trend: 'up'
    }
  ],
  meta: [
    {
      label: 'Total Spend',
      value: '€32,890',
      change: 5.6,
      trend: 'up'
    },
    {
      label: 'Reach',
      value: '456K',
      change: 18.2,
      trend: 'up'
    },
    {
      label: 'Frequency',
      value: '2.8',
      change: -3.4,
      trend: 'down'
    },
    {
      label: 'CPA',
      value: '€18.75',
      change: -9.1,
      trend: 'down'
    }
  ]
};

// ============================================
// Health Score par channel
// ============================================

export const mockHealthScoreByChannel: Record<Channel, number> = {
  sea: 78,
  seo: 65,
  meta: 82
};

// ============================================
// Descriptions des audits par channel
// ============================================

export const auditTypesByChannel: Record<Channel, { label: string; icon: string; disabled: boolean }[]> = {
  sea: [
    { label: 'Run Full Audit', icon: '▶️', disabled: false },
    { label: 'Check ROAS', icon: '📈', disabled: false },
    { label: 'Find Wasted Spend', icon: '💸', disabled: false }
  ],
  seo: [
    { label: 'Technical Audit', icon: '🔧', disabled: true },
    { label: 'Content Analysis', icon: '📝', disabled: true },
    { label: 'Backlinks Check', icon: '🔗', disabled: true }
  ],
  meta: [
    { label: 'Creative Performance', icon: '🎨', disabled: true },
    { label: 'Audience Analysis', icon: '👥', disabled: true },
    { label: 'Placement Review', icon: '📱', disabled: true }
  ]
};

// ============================================
// Métriques disponibles par channel
// ============================================

export const metricsByChannel: Record<Channel, string[]> = {
  sea: ['ROAS', 'CPA', 'CTR', 'Quality Score', 'Budget', 'Impressions', 'Clicks', 'Conversions'],
  seo: ['Traffic', 'Position', 'CTR', 'Backlinks', 'Index Coverage', 'Page Speed', 'Core Web Vitals'],
  meta: ['CPA', 'CPM', 'CTR', 'Reach', 'Frequency', 'Engagement', 'Video Views', 'Conversions']
};

// ============================================
// Labels des channels
// ============================================

export const channelLabels: Record<Channel, string> = {
  sea: 'Google Ads',
  seo: 'SEO',
  meta: 'Meta Ads'
};

export const CHANNELS = [
  { id: 'sea', label: 'Google Ads (SEA)' },
  { id: 'seo', label: 'SEO' },
  { id: 'meta', label: 'Meta Ads' },
] as const;

export type ChannelId = (typeof CHANNELS)[number]['id'];

