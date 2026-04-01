import { DisputeTracker } from '@/components/disputes/DisputeTracker';

export function DisputesPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution</h2>
        <p className="text-sm text-gray-500">Dispute Resolution Schemes Regulations 2011</p>
      </div>
      <DisputeTracker />
    </div>
  );
}
