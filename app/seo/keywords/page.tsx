'use client';

import Card from '@/components/shared/Card';
import { useSEO } from '@/contexts/SEOContext';

function extractTokens(text: string) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9àâçéèêëîïôùûüÿñæœ\s-]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .slice(0, 200);
}

export default function SEOKeywordsPage() {
  const { result } = useSEO();

  if (!result) {
    return (
      <Card title="SEO Keywords">
        <p className="text-sm text-gray-600">
          Aucun scan trouvé. Va sur <b>/seo/overview</b> et lance “Run SEO Scan”.
        </p>
      </Card>
    );
  }

  const freq = new Map<string, number>();
  for (const p of result.pages || []) {
    for (const w of extractTokens(p.title || '')) freq.set(w, (freq.get(w) || 0) + 1);
  }

  const top = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Keywords</h1>
        <p className="text-sm text-gray-500 mt-1">
          MVP: tokens extraits des titles (améliorable ensuite: H1/H2 + Search Console).
        </p>
      </div>

      <Card title="Top tokens">
        {top.length === 0 ? (
          <p className="text-sm text-gray-600">Pas assez de données.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {top.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{k}</p>
                <p className="text-xs text-gray-500">{v} pages</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}