'use client';

// Page Audit
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import CampaignTable from '@/components/audit/CampaignTable';
import Findings from '@/components/audit/Findings';
import ActionPlan from '@/components/audit/ActionPlan';
import { Play, DollarSign, TrendingUp } from 'lucide-react';

import { mockCampaigns, mockFindings } from '@/data/mock';

export default function AuditPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const runAudit = (type: string) => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div>
      <Header
        title="Audit"
        subtitle="Lancez des audits pour identifier les problèmes et opportunités"
        actions={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={<TrendingUp size={18} />}
              onClick={() => runAudit('roas')}
              disabled={isRunning}
            >
              Check ROAS
            </Button>
            <Button
              variant="secondary"
              icon={<DollarSign size={18} />}
              onClick={() => runAudit('wasted')}
              disabled={isRunning}
            >
              Find Wasted Spend
            </Button>
            <Button
              variant="primary"
              icon={<Play size={18} />}
              onClick={() => runAudit('full')}
              disabled={isRunning}
            >
              {isRunning ? 'Audit en cours...' : 'Run Full Audit'}
            </Button>
          </div>
        }
      />

      {/* État de l'audit */}
      {isRunning && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600" />
            <p className="text-sm font-medium text-primary-900">
              Analyse en cours des campagnes Google Ads...
            </p>
          </div>
        </div>
      )}

      {/* Tableau des campagnes */}
      <Card title="Campagnes" className="mb-6">
        <CampaignTable campaigns={mockCampaigns} />
      </Card>

      {/* Résultats de l'audit */}
      {showResults && (
        <>
          <Card title="Findings" className="mb-6">
            <Findings findings={mockFindings} />
          </Card>

          <Card>
            <ActionPlan findings={mockFindings} />
          </Card>
        </>
      )}

      {!showResults && !isRunning && (
        <div className="text-center py-12">
          <Play size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            Lancez un audit pour analyser vos campagnes et générer des recommandations
          </p>
        </div>
      )}
    </div>
  );
}
