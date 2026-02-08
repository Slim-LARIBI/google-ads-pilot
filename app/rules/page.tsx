'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Table from '@/components/shared/Table';
import Button from '@/components/shared/Button';
import { Plus, Power, PowerOff, Trash2, Pencil } from 'lucide-react';
import { useChannel } from '@/contexts/ChannelContext';
import { Rule, RulePayload, useRules } from '@/hooks/useRules';
import RuleModal, { RuleForm } from '@/components/rules/RuleModal';

type Banner = { type: 'success' | 'error'; text: string } | null;

export default function RulesPage() {
  const { selectedChannel } = useChannel();
  const channel = (selectedChannel ?? 'sea') as 'sea' | 'seo' | 'meta';

  const { rules, loading, error, createRule, updateRule, toggleActive, deleteRule } =
    useRules(channel);

  const [banner, setBanner] = useState<Banner>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalLoading, setModalLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingInitial, setEditingInitial] = useState<RuleForm | null>(null);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setEditingInitial(null);
  }

  function openCreate() {
    setBanner(null);
    setModalMode('create');
    setEditingId(null);
    setEditingInitial(null);
    setModalOpen(true);
  }

  function openEdit(rule: Rule) {
    setBanner(null);
    setModalMode('edit');
    setEditingId(rule.id);
    setEditingInitial({
      name: rule.name,
      description: rule.description,
      metric: rule.metric,
      operator: rule.operator,
      threshold: rule.threshold,
      priority: rule.priority,
      action_type: rule.action_type,
    });
    setModalOpen(true);
  }

  async function onSubmitModal(data: RuleForm) {
    setModalLoading(true);
    setBanner(null);

    const payload: RulePayload = {
      name: data.name,
      description: data.description,
      metric: data.metric,
      operator: data.operator,
      threshold: Number(data.threshold),
      priority: data.priority,
      action_type: data.action_type,
    };

    const ok =
      modalMode === 'create'
        ? await createRule(payload)
        : editingId
          ? await updateRule(editingId, payload)
          : false;

    setModalLoading(false);

    if (ok) {
      setBanner({ type: 'success', text: modalMode === 'create' ? 'Règle créée ✅' : 'Règle modifiée ✅' });
      closeModal();
    } else {
      setBanner({ type: 'error', text: 'Erreur Supabase ❌ (vérifie RLS / champs requis)' });
    }
  }

  async function onToggle(rule: Rule) {
    setBanner(null);
    const ok = await toggleActive(rule.id, !rule.is_active);
    setBanner(ok
      ? { type: 'success', text: rule.is_active ? 'Règle désactivée ✅' : 'Règle activée ✅' }
      : { type: 'error', text: 'Erreur Supabase ❌' }
    );
  }

  async function onDelete(rule: Rule) {
    setBanner(null);
    const ok = await deleteRule(rule.id);
    setBanner(ok
      ? { type: 'success', text: 'Règle supprimée ✅' }
      : { type: 'error', text: 'Erreur Supabase ❌' }
    );
  }

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Nom',
        render: (r: Rule) => (
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-gray-500">{r.description}</div>
          </div>
        ),
      },
      {
        key: 'condition',
        header: 'Condition',
        render: (r: Rule) => (
          <span className="font-mono text-sm">
            {r.metric} {r.operator} {r.threshold}
          </span>
        ),
      },
      {
        key: 'priority',
        header: 'Priorité',
        render: (r: Rule) => <Badge variant={r.priority}>{r.priority}</Badge>,
      },
      {
        key: 'status',
        header: 'Statut',
        render: (r: Rule) =>
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
      {
        key: 'actions',
        header: 'Actions',
        render: (r: Rule) => (
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<Pencil size={16} />} onClick={() => openEdit(r)}>
              Modifier
            </Button>
            <Button
              variant="secondary"
              icon={r.is_active ? <PowerOff size={16} /> : <Power size={16} />}
              onClick={() => onToggle(r)}
            >
              {r.is_active ? 'Désactiver' : 'Activer'}
            </Button>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => onDelete(r)}>
              Supprimer
            </Button>
          </div>
        ),
      },
    ],
    [channel]
  );

  return (
    <div className="p-6">
      <Header
        title="Rules"
        subtitle={`Règles automatiques configurées — ${channel.toUpperCase()}`}
        actions={
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreate}>
            Nouvelle règle
          </Button>
        }
      />

      {banner && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            banner.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {banner.text}
        </div>
      )}

      {loading ? (
        <Card>
          <p className="text-center text-gray-500">Chargement des règles...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-center text-danger-600">Erreur Supabase : {error}</p>
        </Card>
      ) : !rules || rules.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            Aucune règle trouvée pour {channel.toUpperCase()}.
          </p>
        </Card>
      ) : (
        <Card title="Configuration des règles">
          <Table data={rules} columns={columns} keyExtractor={(r: Rule) => r.id} />
        </Card>
      )}

      <RuleModal
        open={modalOpen}
        mode={modalMode}
        channel={channel}
        initialData={editingInitial}
        loading={modalLoading}
        onClose={closeModal}
        onSubmit={onSubmitModal}
      />
    </div>
  );
}