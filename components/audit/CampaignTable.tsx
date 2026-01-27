// Tableau des campagnes pour l'audit
import Table from '@/components/shared/Table';
import Badge from '@/components/shared/Badge';
import type { Campaign } from '@/types';

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const getStatusBadge = (status: Campaign['status']) => {
    const variants: Record<Campaign['status'], 'success' | 'default'> = {
      active: 'success',
      paused: 'default',
      ended: 'default',
    };
    return variants[status];
  };

  const getROASColor = (roas: number) => {
    if (roas >= 4) return 'text-success-600 font-semibold';
    if (roas >= 2) return 'text-gray-900';
    return 'text-danger-600 font-semibold';
  };

  const getCPAColor = (cpa: number) => {
    if (cpa <= 20) return 'text-success-600 font-semibold';
    if (cpa <= 30) return 'text-gray-900';
    return 'text-danger-600 font-semibold';
  };

  const columns = [
    {
      key: 'name',
      header: 'Campagne',
      render: (campaign: Campaign) => (
        <div>
          <div className="font-medium text-gray-900">{campaign.name}</div>
          <div className="mt-1">
            <Badge variant={getStatusBadge(campaign.status)} size="sm">
              {campaign.status}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'spend',
      header: 'Spend',
      render: (campaign: Campaign) => `€${campaign.spend.toLocaleString()}`,
    },
    {
      key: 'conversions',
      header: 'Conversions',
      render: (campaign: Campaign) => campaign.conversions.toLocaleString(),
    },
    {
      key: 'cpa',
      header: 'CPA',
      render: (campaign: Campaign) => (
        <span className={getCPAColor(campaign.cpa)}>
          €{campaign.cpa.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'roas',
      header: 'ROAS',
      render: (campaign: Campaign) => (
        <span className={getROASColor(campaign.roas)}>
          {campaign.roas.toFixed(1)}x
        </span>
      ),
    },
    {
      key: 'clicks',
      header: 'Clicks',
      render: (campaign: Campaign) => campaign.clicks.toLocaleString(),
    },
    {
      key: 'impressions',
      header: 'Impressions',
      render: (campaign: Campaign) => campaign.impressions.toLocaleString(),
    },
  ];

  return <Table data={campaigns} columns={columns} keyExtractor={(c) => c.id} />;
}
