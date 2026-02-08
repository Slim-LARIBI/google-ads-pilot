'use client';

import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';

export default function SeoPlaceholderPage() {
  return (
    <div className="p-6">
      <Header title="rules" subtitle="rules" />
      <Card>
        <div className="text-center text-gray-600 py-10">
          <div className="text-lg font-semibold">Coming soon</div>
          <div className="text-sm text-gray-500 mt-2">
            Page prête (route + layout). On branchera les données après.
          </div>
        </div>
      </Card>
    </div>
  );
}