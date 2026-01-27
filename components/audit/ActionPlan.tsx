// Plan d'action généré par l'audit
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { CheckCircle } from 'lucide-react';
import type { Finding } from '@/types';

interface ActionPlanProps {
  findings: Finding[];
}

export default function ActionPlan({ findings }: ActionPlanProps) {
  const p0Findings = findings.filter(f => f.priority === 'P0');
  const p1Findings = findings.filter(f => f.priority === 'P1');
  const p2Findings = findings.filter(f => f.priority === 'P2');

  const PrioritySection = ({
    priority,
    items,
    title
  }: {
    priority: 'P0' | 'P1' | 'P2';
    items: Finding[];
    title: string;
  }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={priority}>{priority}</Badge>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <span className="text-sm text-gray-500">({items.length})</span>
        </div>

        <div className="space-y-2 ml-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <CheckCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.recommendation}</p>
              </div>
              {item.estimatedSavings && (
                <span className="text-xs font-medium text-success-600">
                  +€{item.estimatedSavings}/j
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Plan d&apos;action</h3>
          <p className="text-sm text-gray-600 mt-1">
            {findings.length} action{findings.length > 1 ? 's' : ''} recommandée{findings.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" size="sm">
          Générer les actions
        </Button>
      </div>

      <PrioritySection
        priority="P0"
        items={p0Findings}
        title="Critique - Action immédiate requise"
      />
      <PrioritySection
        priority="P1"
        items={p1Findings}
        title="Important - À traiter rapidement"
      />
      <PrioritySection
        priority="P2"
        items={p2Findings}
        title="Optimisation - Opportunité"
      />
    </div>
  );
}
