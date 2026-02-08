import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';

export default function SeaActionsPage() {
  return (
    <div className="p-6">
      <Header title="SEA Actions" subtitle="Module SEA — Coming soon" />
      <Card>
        <p className="text-gray-600">
          Actions recommandées et validation humaine avant exécution automatique.
        </p>
      </Card>
    </div>
  );
}