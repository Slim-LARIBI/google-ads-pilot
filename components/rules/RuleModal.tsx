'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';

export type RuleForm = {
  name: string;
  description: string | null;
  metric: string;
  operator: string;
  threshold: number;
  priority: 'P0' | 'P1' | 'P2';
  action_type: string;
};

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  channel: 'sea' | 'seo' | 'meta';
  initialData?: RuleForm | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: RuleForm) => Promise<void>;
};

const DEFAULT_BY_CHANNEL: Record<'sea' | 'seo' | 'meta', RuleForm> = {
  sea: {
    name: '',
    description: '',
    metric: 'roas',
    operator: '<',
    threshold: 2,
    priority: 'P1',
    action_type: 'pause_campaign',
  },
  seo: {
    name: '',
    description: '',
    metric: 'position',
    operator: '>',
    threshold: 10,
    priority: 'P1',
    action_type: 'send_alert',
  },
  meta: {
    name: '',
    description: '',
    metric: 'cpa',
    operator: '>',
    threshold: 30,
    priority: 'P1',
    action_type: 'reduce_budget',
  },
};

export default function RuleModal({
  open,
  mode,
  channel,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const defaults = useMemo(() => DEFAULT_BY_CHANNEL[channel], [channel]);

  const [form, setForm] = useState<RuleForm>(defaults);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialData) {
      setForm({
        ...defaults,
        ...initialData,
        threshold: Number(initialData.threshold ?? defaults.threshold),
      });
    } else {
      setForm(defaults);
    }
  }, [open, mode, initialData, defaults]);

  if (!open) return null;

  function set<K extends keyof RuleForm>(key: K, value: RuleForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // validation mini
    if (!form.name.trim()) return;

    await onSubmit({
      ...form,
      threshold: Number(form.threshold),
      description: form.description?.trim() ? form.description : null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <div className="text-lg font-semibold">
                {mode === 'create' ? 'Nouvelle règle' : 'Modifier la règle'}
              </div>
              <div className="text-sm text-gray-500">
                Channel: <span className="font-mono">{channel.toUpperCase()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Nom</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="ex: ROAS critique"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2"
                  value={form.description ?? ''}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="ex: Pause les campagnes non rentables"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Metric</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono outline-none focus:ring-2"
                  value={form.metric}
                  onChange={(e) => set('metric', e.target.value)}
                  placeholder="roas / cpa / ctr..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Operator</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2"
                  value={form.operator}
                  onChange={(e) => set('operator', e.target.value)}
                >
                  <option value="<">{'<'}</option>
                  <option value="<=">{'<='}</option>
                  <option value=">">{'>'}</option>
                  <option value=">=">{'>='}</option>
                  <option value="=">{'='}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Threshold</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2"
                  value={form.threshold}
                  onChange={(e) => set('threshold', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priorité</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2"
                  value={form.priority}
                  onChange={(e) => set('priority', e.target.value as RuleForm['priority'])}
                >
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Action (action_type)</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2"
                  value={form.action_type}
                  onChange={(e) => set('action_type', e.target.value)}
                >
                  <option value="pause_campaign">pause_campaign</option>
                  <option value="reduce_budget">reduce_budget</option>
                  <option value="increase_budget">increase_budget</option>
                  <option value="send_alert">send_alert</option>
                </select>
                <div className="mt-1 text-xs text-gray-500">
                  (Obligatoire côté Supabase — sinon erreur NOT NULL)
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
              <Button variant="secondary" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="primary" disabled={loading}>
                {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}