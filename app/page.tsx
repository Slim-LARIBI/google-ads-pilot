'use client';

// Page Dashboard (Overview) - Multi-channel
import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import HealthScore from '@/components/dashboard/HealthScore';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import ChannelSelector from '@/components/shared/ChannelSelector';
import ComingSoon from '@/components/shared/ComingSoon';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';


import { useChannel } from '@/contexts/ChannelContext';
import { mockAlerts, mockActions } from '@/data/mock';
import {
  mockKPIsByChannel,
  mockHealthScoreByChannel,
  CHANNELS,
} from '@/data/mockByChannel';

export default function DashboardPage() {
  const { selectedChannel } = useChannel();
  const safeChannel = (selectedChannel ?? 'sea') as keyof typeof CHANNELS;

  // ✅ filets de sécurité si les objets ne sont pas prêts / incomplets
  const channelInfo =
    (CHANNELS as any)?.[safeChannel] ?? {
      label: 'SEA (Google Ads)',
      isActive: true,
    };

  const kpis = (mockKPIsByChannel as any)?.[safeChannel] ?? [];

  const healthScore = (mockHealthScoreByChannel as any)?.[safeChannel] ?? 0;

  // Filtrer les données par channel sélectionné
  const criticalAlerts = (mockAlerts ?? [])
    .filter((a: any) => a.channel === safeChannel && a.priority === 'P0')
    .slice(0, 3);

  const pendingActions = (mockActions ?? [])
    .filter((a: any) => a.channel === safeChannel && a.status === 'pending')
    .slice(0, 3);

  return (
    <div>
      <ChannelSelector />

      <Header
        title="Overview"
        subtitle={`Vue d'ensemble des performances ${channelInfo.label}`}
      />

      {/* Si channel inactif, afficher Coming Soon */}
      {!channelInfo.isActive ? (
        <ComingSoon
          channel={channelInfo.label}
          message={`Le dashboard ${channelInfo.label} sera disponible prochainement avec des KPIs et métriques spécifiques au canal.`}
        />
      ) : (
        <>
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi: any, index: number) => (
              <KPICard key={index} kpi={kpi} />
            ))}
          </div>

          {/* Health Score + Alertes critiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <HealthScore score={healthScore} />
            </div>

            <div className="lg:col-span-2">
              <Card
                title="Alertes Critiques (P0)"
                actions={
                  <Link href="/alerts">
                    <Button variant="ghost" size="sm">
                      Voir tout <ArrowRight size={16} />
                    </Button>
                  </Link>
                }
              >
                {criticalAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {criticalAlerts.map((alert: any) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-4 p-4 bg-danger-50 border border-danger-200 rounded-lg"
                      >
                        <AlertTriangle
                          size={20}
                          className="text-danger-600 flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {alert.title}
                            </h4>
                            <Badge variant="P0">P0</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Campagne: {alert.campaign}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune alerte critique pour ce channel
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Actions en attente de validation */}
          <Card
            title="Actions en attente de validation"
            actions={
              <Link href="/actions">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight size={16} />
                </Button>
              </Link>
            }
          >
            {pendingActions.length > 0 ? (
              <div className="space-y-3">
                {pendingActions.map((action: any) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        size={20}
                        className="text-warning-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {String(action.type)
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h4>
                          <Badge variant={action.priority}>
                            {action.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{action.campaign}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {action.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success-600">
                        {action.estimatedImpact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune action en attente pour ce channel
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
