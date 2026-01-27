'use client';

// Page Actions (Validation humaine)
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { Check, X, Pause, DollarSign, Filter, Plus } from 'lucide-react';
import type { Action, ActionType } from '@/types';

import { mockActions } from '@/data/mock';

export default function ActionsPage() {
  const [actions, setActions] = useState(mockActions);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const handleValidate = (actionId: string) => {
    setActions(actions.map(a =>
      a.id === actionId ? { ...a, status: 'validated' as const } : a
    ));
    setSelectedAction(null);
  };

  const handleReject = (actionId: string) => {
    setActions(actions.map(a =>
      a.id === actionId ? { ...a, status: 'rejected' as const } : a
    ));
    setSelectedAction(null);
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'pause_campaign':
        return <Pause size={20} className="text-danger-600" />;
      case 'adjust_budget':
        return <DollarSign size={20} className="text-warning-600" />;
      case 'add_negative_keyword':
        return <Filter size={20} className="text-primary-600" />;
      case 'adjust_bid':
        return <Plus size={20} className="text-success-600" />;
    }
  };

  const getActionLabel = (type: ActionType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

  const pendingActions = actions.filter(a => a.status === 'pending');
  const validatedActions = actions.filter(a => a.status === 'validated');
  const rejectedActions = actions.filter(a => a.status === 'rejected');

  return (
    <div>
      <Header
        title="Actions"
        subtitle="Validez ou refusez les actions proposées"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card padding={true}>
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-3xl font-bold text-warning-600 mt-2">{pendingActions.length}</p>
        </Card>
        <Card padding={true}>
          <p className="text-sm text-gray-600">Validées</p>
          <p className="text-3xl font-bold text-success-600 mt-2">{validatedActions.length}</p>
        </Card>
        <Card padding={true}>
          <p className="text-sm text-gray-600">Refusées</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">{rejectedActions.length}</p>
        </Card>
      </div>

      {/* Liste des actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste principale */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Actions proposées</h2>

          {actions.map((action) => (
            <Card
              key={action.id}
              padding={false}
              className={`cursor-pointer transition-all ${
                selectedAction?.id === action.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedAction(action)}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {getActionIcon(action.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {getActionLabel(action.type)}
                      </h3>
                      <Badge variant={action.priority}>{action.priority}</Badge>
                      <Badge variant={action.status}>{action.status}</Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{action.campaign}</p>
                    <p className="text-sm text-gray-600">{action.reason}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(action.createdAt)}
                      </span>
                      <span className="text-sm font-medium text-success-600">
                        {action.estimatedImpact}
                      </span>
                    </div>
                  </div>
                </div>

                {action.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                      icon={<Check size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValidate(action.id);
                      }}
                    >
                      Valider
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      icon={<X size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(action.id);
                      }}
                    >
                      Refuser
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Détail de l'action sélectionnée */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          {selectedAction ? (
            <Card title="Détail de l'action">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Type d&apos;action</h4>
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedAction.type)}
                    <span className="font-medium text-gray-900">
                      {getActionLabel(selectedAction.type)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Campagne concernée</h4>
                  <p className="text-gray-900">{selectedAction.campaign}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Raison</h4>
                  <p className="text-gray-900">{selectedAction.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Métrique</h4>
                    <p className="text-gray-900">{selectedAction.metric}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Priorité</h4>
                    <Badge variant={selectedAction.priority}>{selectedAction.priority}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Valeur actuelle</h4>
                    <p className="text-danger-600 font-semibold">{selectedAction.currentValue}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Seuil</h4>
                    <p className="text-gray-900 font-semibold">{selectedAction.threshold}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Impact estimé</h4>
                  <p className="text-success-600 font-semibold">{selectedAction.estimatedImpact}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Détails</h4>
                  <p className="text-sm text-gray-900">{selectedAction.details}</p>
                </div>

                {selectedAction.status === 'pending' && (
                  <div className="pt-4 border-t border-gray-200 flex gap-3">
                    <Button
                      variant="success"
                      className="flex-1"
                      icon={<Check size={18} />}
                      onClick={() => handleValidate(selectedAction.id)}
                    >
                      Valider
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
                      icon={<X size={18} />}
                      onClick={() => handleReject(selectedAction.id)}
                    >
                      Refuser
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Check size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Sélectionnez une action pour voir les détails
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
