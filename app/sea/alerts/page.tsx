import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';

export default function SeaAlertsPage() {
  return (
    <div className="p-6">
      <Header title="SEA Alerts" subtitle="Module SEA — Coming soon" />
      <Card>
        <p className="text-gray-600">
          Ici tu verras les alertes générées par les règles (P0/P1/P2).
        </p>
      </Card>
    </div>
  );
}