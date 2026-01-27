// Carte KPI pour le dashboard
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '@/types';

interface KPICardProps {
  kpi: KPI;
}

export default function KPICard({ kpi }: KPICardProps) {
  const getTrendIcon = () => {
    if (!kpi.trend) return null;

    switch (kpi.trend) {
      case 'up':
        return <TrendingUp size={16} className="text-success-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-danger-600" />;
      case 'stable':
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    if (!kpi.change) return 'text-gray-500';

    // Pour certaines métriques, une baisse est positive (CPA, Spend)
    const isNegativeGood = kpi.label.includes('CPA') || kpi.label.includes('Spend');

    if (isNegativeGood) {
      return kpi.change < 0 ? 'text-success-600' : 'text-danger-600';
    }

    return kpi.change > 0 ? 'text-success-600' : 'text-danger-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{kpi.value}</p>
        </div>
        {getTrendIcon()}
      </div>

      {kpi.change !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {kpi.change > 0 ? '+' : ''}{kpi.change}%
          </span>
          <span className="text-sm text-gray-500">vs période précédente</span>
        </div>
      )}
    </div>
  );
}
