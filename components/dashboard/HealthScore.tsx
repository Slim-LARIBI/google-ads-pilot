// Composant Health Score avec indicateur visuel
interface HealthScoreProps {
  score: number;
}

export default function HealthScore({ score }: HealthScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Moyen';
    return 'Critique';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-success-500';
    if (score >= 60) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-4">Health Score</h3>

      <div className="flex items-end gap-4">
        <div>
          <div className={`text-5xl font-bold ${getScoreColor()}`}>
            {score}
          </div>
          <p className="text-sm text-gray-500 mt-1">/100</p>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${getScoreColor()}`}>
              {getScoreLabel()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Campagnes actives</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">5</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Alertes P0</p>
          <p className="text-lg font-semibold text-danger-600 mt-1">2</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Actions en attente</p>
          <p className="text-lg font-semibold text-warning-600 mt-1">4</p>
        </div>
      </div>
    </div>
  );
}
