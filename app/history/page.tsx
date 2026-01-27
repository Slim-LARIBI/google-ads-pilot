// Page History
import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import { Check, X, Search, User, Bot } from 'lucide-react';
import type { HistoryEntry } from '@/types';

import { mockHistory } from '@/data/mock';

export default function HistoryPage() {
  const getIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'audit':
        return <Search size={20} className="text-primary-600" />;
      case 'action_validated':
        return <Check size={20} className="text-success-600" />;
      case 'action_rejected':
        return <X size={20} className="text-danger-600" />;
    }
  };

  const getTypeLabel = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'audit':
        return 'Audit';
      case 'action_validated':
        return 'Action validée';
      case 'action_rejected':
        return 'Action refusée';
    }
  };

  const getTypeBadgeVariant = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'audit':
        return 'default';
      case 'action_validated':
        return 'success';
      case 'action_rejected':
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays}j`;
    }

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
        title="History"
        subtitle="Historique des audits et décisions"
      />

      {/* Timeline */}
      <Card>
        <div className="space-y-6">
          {mockHistory.map((entry, index) => (
            <div key={entry.id} className="flex gap-6">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200">
                  {getIcon(entry.type)}
                </div>
                {index < mockHistory.length - 1 && (
                  <div className="w-0.5 h-full min-h-[60px] bg-gray-200 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                    <Badge variant={getTypeBadgeVariant(entry.type)} size="sm">
                      {getTypeLabel(entry.type)}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                </div>

                <p className="text-gray-700 mb-3">{entry.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  {entry.user && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      {entry.user === 'Système' ? (
                        <Bot size={14} />
                      ) : (
                        <User size={14} />
                      )}
                      <span>{entry.user}</span>
                    </div>
                  )}
                  {entry.campaign && (
                    <div className="text-gray-600">
                      <span className="font-medium">Campagne:</span> {entry.campaign}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding={true}>
          <p className="text-sm text-gray-600">Total d&apos;événements</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mockHistory.length}</p>
        </Card>
        <Card padding={true}>
          <p className="text-sm text-gray-600">Audits lancés</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {mockHistory.filter(h => h.type === 'audit').length}
          </p>
        </Card>
        <Card padding={true}>
          <p className="text-sm text-gray-600">Actions validées</p>
          <p className="text-3xl font-bold text-success-600 mt-2">
            {mockHistory.filter(h => h.type === 'action_validated').length}
          </p>
        </Card>
        <Card padding={true}>
          <p className="text-sm text-gray-600">Actions refusées</p>
          <p className="text-3xl font-bold text-danger-600 mt-2">
            {mockHistory.filter(h => h.type === 'action_rejected').length}
          </p>
        </Card>
      </div>
    </div>
  );
}
