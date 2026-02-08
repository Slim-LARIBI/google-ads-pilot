'use client';

import Card from '@/components/shared/Card';
import { useSEO } from '@/contexts/SEOContext';

export default function SEOPagesPage() {
  const { result } = useSEO();

  if (!result) {
    return (
      <Card title="SEO Pages">
        <p className="text-sm text-gray-600">
          Aucun scan trouvé. Va sur <b>/seo/overview</b> et lance “Run SEO Scan”.
        </p>
      </Card>
    );
  }

  const pages = result.pages ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Détails par page (status, title, meta, H1, vitesse).
        </p>
      </div>

      <Card title={`Crawled pages (${pages.length})`}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">URL</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Meta desc</th>
                <th className="py-2 pr-4">H1</th>
                <th className="py-2 pr-4">Load (ms)</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.url} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 break-all">{p.url}</td>
                  <td className="py-3 pr-4">{p.status}</td>
                  <td className="py-3 pr-4">{p.title || <span className="text-gray-400">—</span>}</td>
                  <td className="py-3 pr-4">{p.meta_description || <span className="text-gray-400">—</span>}</td>
                  <td className="py-3 pr-4">{p.h1_count}</td>
                  <td className="py-3 pr-4">{p.load_ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}