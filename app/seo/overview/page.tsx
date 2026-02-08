'use client';

import { useMemo } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import KPICard from '@/components/dashboard/KPICard';
import { AlertTriangle, AlertCircle, PlayCircle, FileText } from 'lucide-react';
import { useSeoScan } from '@/hooks/useSeoScan';

function ProgressBar({
  value,
  label,
  done,
}: {
  value: number;
  label?: string;
  done?: boolean;
}) {
  if (!value) return null;

  const isDone = done || value >= 100;

  return (
    <div className="mb-4">
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isDone ? 'bg-success-600' : 'bg-primary-600'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-1 text-xs text-gray-600 flex items-center justify-between">
        <span>
          {isDone ? 'Scan terminé ✅' : label ? label : 'Analyse en cours…'}
        </span>
        <span className="tabular-nums">{value}%</span>
      </div>
    </div>
  );
}

export default function SEOOverviewPage() {
  // Hook (SSE) — expects: progress + progressLabel + data
  const {
    url,
    setUrl,
    loading,
    progress,
    progressLabel,
    data,
    error,
    runScan,
  } = useSeoScan('');

  const kpis = data?.kpis;
  const issues = data?.issues;
  const health = data?.health;

  const seoKPIs = useMemo(() => {
    if (!kpis) return [];
    return [
      {
        label: 'Pages Crawled',
        value: String(kpis.pages_crawled ?? 0),
        change: 0,
        trend: 'up' as const,
      },
      {
        label: 'Critical Issues',
        value: String(kpis.critical_issues ?? 0),
        change: 0,
        trend: 'down' as const,
      },
      {
        label: 'Missing Meta Desc',
        value: String(kpis.missing_meta_descriptions ?? 0),
        change: 0,
        trend: 'up' as const,
      },
      {
        label: 'Thin Pages',
        value: String(kpis.thin_pages ?? 0),
        change: 0,
        trend: 'down' as const,
      },
    ];
  }, [kpis]);

  const topIssues = useMemo(() => {
    const missingMetaCount = issues?.missing_meta_descriptions?.length ?? 0;
    const brokenLinksCount = issues?.broken_links?.length ?? 0;
    const duplicateTitlesCount = Object.keys(issues?.duplicate_titles || {}).length ?? 0;
    const thinPagesCount = issues?.thin_pages?.length ?? 0;

    return [
      {
        severity: missingMetaCount ? 'critical' : 'warning',
        title: 'Missing Meta Descriptions',
        description: 'Pages sans meta description',
        affected: missingMetaCount,
        priority: (missingMetaCount ? 'P0' : 'P1') as 'P0' | 'P1' | 'P2',
      },
      {
        severity: brokenLinksCount ? 'critical' : 'warning',
        title: 'Broken Internal Links',
        description: 'Liens internes en erreur (404/0)',
        affected: brokenLinksCount,
        priority: (brokenLinksCount ? 'P0' : 'P1') as 'P0' | 'P1' | 'P2',
      },
      {
        severity: 'warning',
        title: 'Duplicate Titles',
        description: 'Titres identiques sur plusieurs pages',
        affected: duplicateTitlesCount,
        priority: 'P1' as const,
      },
      {
        severity: 'warning',
        title: 'Thin Content',
        description: 'Pages avec faible contenu (< 250 mots)',
        affected: thinPagesCount,
        priority: 'P2' as const,
      },
    ];
  }, [issues]);

  const handleExportReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'seo-scan-report.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const subtitle = useMemo(() => {
    if (loading) return 'Scan en cours…';
    if (data) return `Scan terminé — Score: ${health?.score ?? 0}/100`;
    return 'Lance un scan SEO sur une URL';
  }, [loading, data, health?.score]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO Overview</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              icon={<FileText size={16} />}
              onClick={handleExportReport}
              disabled={!data}
            >
              Export Report
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<PlayCircle size={16} />}
              onClick={() => runScan()}
              disabled={loading}
            >
              {loading ? 'Scanning…' : 'Run SEO Scan'}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={progress}
        label={progressLabel}
        done={!loading && progress >= 100}
      />

      {/* URL input */}
      <Card title="Target URL">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ex: https://www.decathlon.tn"
            className="w-full md:flex-1 rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-200"
          />
          <Button variant="primary" onClick={() => runScan()} disabled={loading}>
            Scan this URL
          </Button>
        </div>

        {error && <p className="mt-3 text-sm text-danger-600">Erreur: {error}</p>}
      </Card>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {seoKPIs.length ? (
          seoKPIs.map((kpi, i) => <KPICard key={i} kpi={kpi} />)
        ) : (
          <div className="col-span-full text-sm text-gray-500">
            Lance un scan pour remplir les KPI.
          </div>
        )}
      </div>

      {/* Health + Top Issues */}
      {data && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm lg:col-span-1">
            <h3 className="text-sm font-medium text-gray-600 mb-4">SEO Health Score</h3>

            <div className="flex items-end gap-4">
              <div>
                <div className="text-5xl font-bold text-primary-600">
                  {health?.score ?? 0}
                </div>
                <p className="text-sm text-gray-500 mt-1">/100</p>
              </div>

              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${health?.score ?? 0}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-700">
                  <span className="text-xs text-gray-500 block">Main issue</span>
                  <span className="font-medium">{health?.main_issue ?? '-'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Issues */}
          <div className="lg:col-span-2">
            <Card title="Top SEO Issues">
              <div className="space-y-3">
                {topIssues.map((issue, idx) => {
                  const isCritical = issue.severity === 'critical';
                  const Icon = isCritical ? AlertTriangle : AlertCircle;

                  return (
                    <div
                      key={idx}
                      className={`
                        flex items-start gap-4 p-4 rounded-lg border
                        ${
                          isCritical
                            ? 'bg-danger-50 border-danger-200'
                            : 'bg-warning-50 border-warning-200'
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={`mt-0.5 ${
                          isCritical ? 'text-danger-600' : 'text-warning-600'
                        }`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                          <Badge variant={issue.priority}>{issue.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{issue.description}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{issue.affected}</p>
                        <p className="text-xs text-gray-500">items</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}