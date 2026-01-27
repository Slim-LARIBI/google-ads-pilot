'use client';

// Page Alerts
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { Alert, AlertSeverity } from '@/types';

import { mockAlerts } from '@/data/mock';

export default function AlertsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');

  const filteredAlerts = selectedSeverity === 'all'
    ? mockAlerts
    : mockAlerts.filter(a => a.severity === selectedSeverity);

  const getIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={20} className="text-danger-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-warning-600" />;
      case 'info':
        return <Info size={20} className="text-primary-600" />;
    }
  };

  const getBgColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-danger-50 border-danger-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'info':
        return 'bg-primary-50 border-primary-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Header
        title="Alerts"
        subtitle="Alertes générées par le moteur de règles"
      />

      {/* Filtres */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filtrer par sévérité:</span>
        <div className="flex gap-2">
          <Button
            variant={selectedSeverity === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedSeverity('all')}
          >
            Toutes ({mockAlerts.length})
          </Button>
          <Button
            variant={selectedSeverity === 'critical' ? 'danger' : 'secondary'}
            size="sm"
            onClick={() => setSelectedSeverity('critical')}
          >
            Critique ({mockAlerts.filter(a => a.severity === 'critical').length})
          </Button>
          <Button
            variant={selectedSeverity === 'warning' ? 'secondary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedSeverity('warning')}
          >
            Warning ({mockAlerts.filter(a => a.severity === 'warning').length})
          </Button>
          <Button
            variant={selectedSeverity === 'info' ? 'secondary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedSeverity('info')}
          >
            Info ({mockAlerts.filter(a => a.severity === 'info').length})
          </Button>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} padding={false}>
            <div className={`p-6 border-l-4 ${getBgColor(alert.severity)}`}>
              <div className="flex items-start gap-4">
                {getIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    <Badge variant={alert.priority}>{alert.priority}</Badge>
                    <Badge variant={alert.severity}>{alert.severity}</Badge>
                  </div>

                  <p className="text-gray-700 mb-4">{alert.message}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Campagne</p>
                      <p className="text-sm font-medium text-gray-900">{alert.campaign}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Métrique</p>
                      <p className="text-sm font-medium text-gray-900">{alert.metric}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valeur actuelle</p>
                      <p className="text-sm font-medium text-danger-600">
                        {alert.currentValue}
                        {alert.metric === 'ROAS' && 'x'}
                        {alert.metric === 'CPA' && '€'}
                        {alert.metric === 'Budget' && '%'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seuil</p>
                      <p className="text-sm font-medium text-gray-900">
                        {alert.threshold}
                        {alert.metric === 'ROAS' && 'x'}
                        {alert.metric === 'CPA' && '€'}
                        {alert.metric === 'Budget' && '%'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Recommandation</p>
                    <p className="text-sm text-gray-900">{alert.recommendation}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Créée le {formatDate(alert.createdAt)}
                    </span>
                    <Button variant="primary" size="sm">
                      Créer une action
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune alerte pour ce filtre</p>
        </div>
      )}
    </div>
  );
}
