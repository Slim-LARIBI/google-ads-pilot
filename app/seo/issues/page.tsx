'use client';

import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import { useSEO } from '@/contexts/SEOContext';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function SEOIssuesPage() {
  const { result } = useSEO();

  if (!result) {
    return (
      <Card title="SEO Issues">
        <p className="text-sm text-gray-600">
          Aucun scan trouvé. Va sur <b>/seo/overview</b> et lance “Run SEO Scan”.
        </p>
      </Card>
    );
  }

  const issues = result.issues ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
        <p className="text-sm text-gray-500 mt-1">
          Issues détectées sur {result.kpis.pages_crawled} pages.
        </p>
      </div>

      <Card title="All Issues">
        <div className="space-y-3">
          {issues.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune issue détectée ✅</p>
          ) : (
            issues.map((issue) => {
              const isCritical = issue.priority === 'P0';
              const Icon = isCritical ? AlertTriangle : AlertCircle;

              return (
                <div
                  key={issue.key}
                  className={`
                    flex items-start gap-4 p-4 rounded-lg border
                    ${isCritical ? 'bg-danger-50 border-danger-200' : 'bg-warning-50 border-warning-200'}
                  `}
                >
                  <Icon size={20} className={`mt-0.5 ${isCritical ? 'text-danger-600' : 'text-warning-600'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                      <Badge variant={issue.priority}>{issue.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{issue.description}</p>

                    {issue.sampleUrls?.length ? (
                      <div className="mt-3 text-xs text-gray-600">
                        <p className="font-medium mb-1">Examples:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {issue.sampleUrls.map((u) => (
                            <li key={u} className="break-all">{u}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">{issue.affectedPages}</p>
                    <p className="text-xs text-gray-500">pages</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}