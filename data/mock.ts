// Données mockées pour l'application Google Ads Pilot
import type {
  Campaign,
  Alert,
  Action,
  Rule,
  HistoryEntry,
  Finding,
  KPI
} from '@/types';

// KPIs Dashboard
export const mockKPIs: KPI[] = [
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
];

// Health Score (0-100)
export const mockHealthScore = 78;

// Campagnes
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Black Friday - Search',
    channel: 'sea',
    status: 'active',
    spend: 12450,
    conversions: 487,
    cpa: 25.56,
    roas: 5.2,
    clicks: 3421,
    impressions: 45234
  },
  {
    id: 'camp-002',
    name: 'Brand - Display',
    channel: 'sea',
    status: 'active',
    spend: 8900,
    conversions: 234,
    cpa: 38.03,
    roas: 3.1,
    clicks: 2134,
    impressions: 67890
  },
  {
    id: 'camp-003',
    name: 'Product Launch - YouTube',
    channel: 'sea',
    status: 'active',
    spend: 15600,
    conversions: 89,
    cpa: 175.28,
    roas: 0.8,
    clicks: 987,
    impressions: 123456
  },
  {
    id: 'camp-004',
    name: 'Retargeting - Search',
    channel: 'sea',
    status: 'active',
    spend: 5234,
    conversions: 678,
    cpa: 7.72,
    roas: 8.9,
    clicks: 1567,
    impressions: 23456
  },
  {
    id: 'camp-005',
    name: 'Competitors - Search',
    channel: 'sea',
    status: 'paused',
    spend: 3050,
    conversions: 45,
    cpa: 67.78,
    roas: 1.2,
    clicks: 456,
    impressions: 12345
  }
];

// Alertes
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    channel: 'sea',
    severity: 'critical',
    priority: 'P0',
    title: 'ROAS critique sur YouTube',
    message: 'Le ROAS de la campagne Product Launch est tombé à 0.8x (seuil : 2.0x)',
    campaign: 'Product Launch - YouTube',
    metric: 'ROAS',
    currentValue: 0.8,
    threshold: 2.0,
    createdAt: '2024-01-26T10:30:00Z',
    recommendation: 'Suspendre temporairement la campagne et analyser les audiences'
  },
  {
    id: 'alert-002',
    channel: 'sea',
    severity: 'critical',
    priority: 'P0',
    title: 'CPA trop élevé sur Display',
    message: 'Le CPA de Brand Display dépasse le seuil de 30€ (actuel : 38.03€)',
    campaign: 'Brand - Display',
    metric: 'CPA',
    currentValue: 38.03,
    threshold: 30.0,
    createdAt: '2024-01-26T09:15:00Z',
    recommendation: 'Ajuster les enchères ou exclure les placements peu performants'
  },
  {
    id: 'alert-003',
    channel: 'sea',
    severity: 'warning',
    priority: 'P1',
    title: 'Budget bientôt épuisé',
    message: 'Black Friday Search va épuiser son budget quotidien dans 2h',
    campaign: 'Black Friday - Search',
    metric: 'Budget',
    currentValue: 92,
    threshold: 100,
    createdAt: '2024-01-26T11:00:00Z',
    recommendation: 'Augmenter le budget quotidien de 20% si performance maintenue'
  },
  {
    id: 'alert-004',
    channel: 'sea',
    severity: 'warning',
    priority: 'P1',
    title: 'Baisse de conversions',
    message: 'Les conversions ont chuté de 15% sur les 3 derniers jours',
    campaign: 'Competitors - Search',
    metric: 'Conversions',
    currentValue: 45,
    threshold: 60,
    createdAt: '2024-01-26T08:45:00Z',
    recommendation: 'Vérifier les enchères et la qualité du trafic'
  },
  {
    id: 'alert-005',
    channel: 'sea',
    severity: 'info',
    priority: 'P2',
    title: 'Opportunité d\'optimisation',
    message: 'Retargeting Search performe très bien, budget peut être augmenté',
    campaign: 'Retargeting - Search',
    metric: 'ROAS',
    currentValue: 8.9,
    threshold: 4.0,
    createdAt: '2024-01-26T07:30:00Z',
    recommendation: 'Augmenter le budget de 30% pour capitaliser sur la performance'
  }
];

// Actions proposées (en attente de validation)
export const mockActions: Action[] = [
  {
    id: 'action-001',
    channel: 'sea',
    type: 'pause_campaign',
    campaign: 'Product Launch - YouTube',
    reason: 'ROAS critique sous le seuil',
    metric: 'ROAS',
    currentValue: 0.8,
    threshold: 2.0,
    estimatedImpact: 'Économie de €500/jour',
    priority: 'P0',
    status: 'pending',
    createdAt: '2024-01-26T10:30:00Z',
    details: 'La campagne génère des dépenses importantes sans retour sur investissement suffisant. Pause recommandée pour analyse approfondie des audiences et créatifs.'
  },
  {
    id: 'action-002',
    channel: 'sea',
    type: 'adjust_budget',
    campaign: 'Brand - Display',
    reason: 'CPA supérieur à l\'objectif',
    metric: 'CPA',
    currentValue: 38.03,
    threshold: 30.0,
    estimatedImpact: 'Réduction CPA de 15%',
    priority: 'P0',
    status: 'pending',
    createdAt: '2024-01-26T09:15:00Z',
    details: 'Réduire le budget quotidien de 30% (de €300 à €210) pour limiter les dépenses sur cette campagne peu rentable.'
  },
  {
    id: 'action-003',
    channel: 'sea',
    type: 'add_negative_keyword',
    campaign: 'Competitors - Search',
    reason: 'Détection de termes générant du wasted spend',
    metric: 'CTR',
    currentValue: 1.2,
    threshold: 3.0,
    estimatedImpact: 'Économie de €150/mois',
    priority: 'P1',
    status: 'pending',
    createdAt: '2024-01-26T08:45:00Z',
    details: 'Ajouter les mots-clés négatifs : "gratuit", "free", "crack", "télécharger" qui génèrent des clics non qualifiés.'
  },
  {
    id: 'action-004',
    channel: 'sea',
    type: 'adjust_budget',
    campaign: 'Retargeting - Search',
    reason: 'Performance exceptionnelle, opportunité de scale',
    metric: 'ROAS',
    currentValue: 8.9,
    threshold: 4.0,
    estimatedImpact: 'Gain potentiel de €800/jour',
    priority: 'P2',
    status: 'pending',
    createdAt: '2024-01-26T07:30:00Z',
    details: 'Augmenter le budget quotidien de 30% (de €200 à €260) pour capitaliser sur l\'excellente performance.'
  }
];

// Règles configurées
export const mockRules: Rule[] = [
  {
    id: 'rule-001',
    channel: 'sea',
    name: 'ROAS Critique',
    objective: 'Prévenir les campagnes non rentables',
    metric: 'ROAS',
    operator: '<',
    threshold: 2.0,
    action: 'Pause campagne',
    priority: 'P0',
    isActive: true
  },
  {
    id: 'rule-002',
    channel: 'sea',
    name: 'CPA Dépassé',
    objective: 'Contrôler le coût d\'acquisition',
    metric: 'CPA',
    operator: '>',
    threshold: 30.0,
    action: 'Réduire budget',
    priority: 'P0',
    isActive: true
  },
  {
    id: 'rule-003',
    channel: 'sea',
    name: 'Budget Quotidien Épuisé',
    objective: 'Éviter les interruptions de diffusion',
    metric: 'Budget consommé',
    operator: '>',
    threshold: 90.0,
    action: 'Alerte + proposition d\'augmentation',
    priority: 'P1',
    isActive: true
  },
  {
    id: 'rule-004',
    channel: 'sea',
    name: 'CTR Faible',
    objective: 'Détecter les annonces peu pertinentes',
    metric: 'CTR',
    operator: '<',
    threshold: 2.0,
    action: 'Suggérer mots-clés négatifs',
    priority: 'P1',
    isActive: true
  },
  {
    id: 'rule-005',
    channel: 'sea',
    name: 'Opportunité de Scale',
    objective: 'Capitaliser sur les campagnes performantes',
    metric: 'ROAS',
    operator: '>',
    threshold: 6.0,
    action: 'Proposer augmentation budget',
    priority: 'P2',
    isActive: true
  },
  {
    id: 'rule-006',
    channel: 'sea',
    name: 'Wasted Spend Detection',
    objective: 'Identifier les dépenses inutiles',
    metric: 'Conversions',
    operator: '=',
    threshold: 0.0,
    action: 'Alerte + analyse mots-clés',
    priority: 'P1',
    isActive: true
  }
];

// Historique
export const mockHistory: HistoryEntry[] = [
  {
    id: 'hist-001',
    channel: 'sea',
    type: 'action_validated',
    title: 'Budget augmenté',
    description: 'Budget quotidien de "Retargeting - Search" augmenté de €200 à €260',
    timestamp: '2024-01-26T09:00:00Z',
    user: 'Marie Dupont',
    campaign: 'Retargeting - Search'
  },
  {
    id: 'hist-002',
    channel: 'sea',
    type: 'action_rejected',
    title: 'Pause refusée',
    description: 'Demande de pause de "Brand - Display" rejetée - En observation',
    timestamp: '2024-01-26T08:30:00Z',
    user: 'Jean Martin',
    campaign: 'Brand - Display'
  },
  {
    id: 'hist-003',
    channel: 'sea',
    type: 'audit',
    title: 'Audit ROAS exécuté',
    description: 'Audit ROAS lancé sur 12 campagnes - 3 alertes P0 générées',
    timestamp: '2024-01-26T08:00:00Z',
    user: 'Système'
  },
  {
    id: 'hist-004',
    channel: 'sea',
    type: 'action_validated',
    title: 'Mots-clés négatifs ajoutés',
    description: '8 mots-clés négatifs ajoutés sur "Competitors - Search"',
    timestamp: '2024-01-25T16:45:00Z',
    user: 'Marie Dupont',
    campaign: 'Competitors - Search'
  },
  {
    id: 'hist-005',
    channel: 'sea',
    type: 'audit',
    title: 'Audit Wasted Spend',
    description: 'Détection de €1,234 de dépenses gaspillées sur 7 jours',
    timestamp: '2024-01-25T14:00:00Z',
    user: 'Système'
  },
  {
    id: 'hist-006',
    channel: 'sea',
    type: 'action_validated',
    title: 'Campagne mise en pause',
    description: '"Summer Sale - Display" mise en pause (ROAS 0.6x)',
    timestamp: '2024-01-25T11:20:00Z',
    user: 'Jean Martin',
    campaign: 'Summer Sale - Display'
  }
];

// Findings d'audit
export const mockFindings: Finding[] = [
  {
    id: 'find-001',
    channel: 'sea',
    priority: 'P0',
    title: 'Campagne YouTube non rentable',
    description: 'Product Launch - YouTube génère un ROAS de 0.8x, bien en dessous du seuil de rentabilité (2.0x)',
    affectedCampaigns: ['Product Launch - YouTube'],
    estimatedSavings: 500,
    recommendation: 'Mettre en pause immédiatement et retravailler le ciblage audience + créatifs'
  },
  {
    id: 'find-002',
    channel: 'sea',
    priority: 'P0',
    title: 'CPA élevé sur Display',
    description: 'Brand - Display a un CPA de 38€, dépassant l\'objectif de 30€',
    affectedCampaigns: ['Brand - Display'],
    estimatedSavings: 240,
    recommendation: 'Réduire le budget de 30% et exclure les placements avec CPA > 50€'
  },
  {
    id: 'find-003',
    channel: 'sea',
    priority: 'P1',
    title: 'Wasted spend sur mots-clés génériques',
    description: '€450/mois dépensés sur des termes de recherche sans conversion',
    affectedCampaigns: ['Competitors - Search', 'Black Friday - Search'],
    estimatedSavings: 450,
    recommendation: 'Ajouter 15 mots-clés négatifs identifiés (liste disponible)'
  },
  {
    id: 'find-004',
    channel: 'sea',
    priority: 'P2',
    title: 'Opportunité de scale sur Retargeting',
    description: 'Retargeting - Search performe à 8.9x ROAS, largement au-dessus de l\'objectif',
    affectedCampaigns: ['Retargeting - Search'],
    estimatedSavings: -800, // Négatif = gain potentiel
    recommendation: 'Augmenter le budget de 30% pour maximiser les conversions'
  }
];
