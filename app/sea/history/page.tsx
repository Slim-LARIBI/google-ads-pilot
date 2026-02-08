import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';

export default function SeaHistoryPage() {
  return (
    <div className="p-6">
      <Header title="SEA History" subtitle="Module SEA — Coming soon" />
      <Card>
        <p className="text-gray-600">
          Historique des règles, exécutions, actions, et changements.
        </p>
      </Card>
    </div>
  );
}