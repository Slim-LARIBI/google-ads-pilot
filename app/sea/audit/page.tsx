import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';

export default function SeaAuditPage() {
  return (
    <div className="p-6">
      <Header title="SEA Audit" subtitle="Module SEA — Coming soon" />
      <Card>
        <p className="text-gray-600">
          Cette page sera connectée aux audits SEA (structure, tracking, campagnes).
        </p>
      </Card>
    </div>
  );
}