// Section Findings (résultats d'audit)
import Badge from '@/components/shared/Badge';
import { AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';
import type { Finding } from '@/types';

interface FindingsProps {
  findings: Finding[];
}

export default function Findings({ findings }: FindingsProps) {
  const getIcon = (priority: Finding['priority']) => {
    switch (priority) {
      case 'P0':
        return <AlertTriangle size={20} className="text-danger-600" />;
      case 'P1':
        return <AlertCircle size={20} className="text-warning-600" />;
      case 'P2':
        return <TrendingUp size={20} className="text-primary-600" />;
    }
  };

  const getBorderColor = (priority: Finding['priority']) => {
    switch (priority) {
      case 'P0':
        return 'border-danger-200 bg-danger-50';
      case 'P1':
        return 'border-warning-200 bg-warning-50';
      case 'P2':
        return 'border-primary-200 bg-primary-50';
    }
  };

  return (
    <div className="space-y-4">
      {findings.map((finding) => (
        <div
          key={finding.id}
          className={`p-5 border rounded-lg ${getBorderColor(finding.priority)}`}
        >
          <div className="flex items-start gap-4">
            {getIcon(finding.priority)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                <Badge variant={finding.priority}>{finding.priority}</Badge>
              </div>

              <p className="text-sm text-gray-700 mb-3">{finding.description}</p>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Campagnes affectées:</span>
                  <span className="text-gray-600 ml-2">
                    {finding.affectedCampaigns.join(', ')}
                  </span>
                </div>

                {finding.estimatedSavings && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Impact estimé:</span>
                    <span className={`ml-2 font-semibold ${
                      finding.estimatedSavings > 0 ? 'text-success-600' : 'text-primary-600'
                    }`}>
                      {finding.estimatedSavings > 0 ? '+' : ''}
                      €{Math.abs(finding.estimatedSavings)}/jour
                    </span>
                  </div>
                )}

                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Recommandation:</span>
                    <span className="text-gray-600 ml-2">{finding.recommendation}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
