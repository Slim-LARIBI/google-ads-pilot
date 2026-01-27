'use client';

import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Table from '@/components/shared/Table';
import Button from '@/components/shared/Button';
import { Plus, Power, PowerOff } from 'lucide-react';
import { useChannel } from '@/contexts/ChannelContext';
import { useRules } from '@/hooks/useRules';

export default function RulesPage() {
  const { selectedChannel } = useChannel();
  const channel = selectedChannel ?? 'sea';

  const { rules, loading, error } = useRules(channel);

  // 🟡 1. LOADING
  if (loading) {
    return (
      <div className="p-6">
        <Header
          title="Rules"
          subtitle={`Règles automatiques configurées — ${channel.toUpperCase()}`}
        />
        <Card>
          <p className="text-center text-gray-500">
            Chargement des règles...
          </p>
        </Card>
      </div>
    );
  }

  // 🔴 2. ERROR
  if (error) {
    return (
      <div className="p-6">
        <Header
          title="Rules"
          subtitle={`Règles automatiques configurées — ${channel.toUpperCase()}`}
        />
        <Card>
          <p className="text-center text-danger-600">
            Erreur Supabase : {error}
          </p>
        </Card>
      </div>
    );
  }

  // ⚪ 3. NO RULES
  if (!rules || rules.length === 0) {
    return (
      <div className="p-6">
        <Header
          title="Rules"
          subtitle={`Règles automatiques configurées — Google Ads (SEA)`}
          actions={
            <Button variant="primary" icon={<Plus size={18} />} disabled>
              Nouvelle règle (V2)
            </Button>
          }
        />
        <Card>
          <p className="text-center text-gray-500">
            Aucune règle trouvée pour {channel.toUpperCase()}.
          </p>
        </Card>
      </div>
    );
  }

  // 🟢 4. DATA OK
  const columns = [
    {
      key: 'name',
      header: 'Nom',
      render: (r: any) => (
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-xs text-gray-500">{r.description}</div>
        </div>
      ),
    },
    {
      key: 'condition',
      header: 'Condition',
      render: (r: any) => (
        <span className="font-mono text-sm">
          {r.metric} {r.operator} {r.threshold}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priorité',
      render: (r: any) => <Badge variant={r.priority}>{r.priority}</Badge>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (r: any) =>
        r.is_active ? (
          <span className="flex items-center gap-1 text-success-600">
            <Power size={14} /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400">
            <PowerOff size={14} /> Inactive
          </span>
        ),
    },
  ];

  return (
    <div className="p-6">
      <Header
        title="Rules"
        subtitle="Règles automatiques configurées — Google Ads (SEA)"
        actions={
          <Button variant="primary" icon={<Plus size={18} />} disabled>
            Nouvelle règle (V2)
          </Button>
        }
      />

      <Card title="Configuration des règles">
        <Table
          data={rules}
          columns={columns}
          keyExtractor={(r) => r.id}
        />
      </Card>
    </div>
  );
}
