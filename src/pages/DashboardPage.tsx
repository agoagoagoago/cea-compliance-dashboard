import { ComplianceScore } from '@/components/dashboard/ComplianceScore';
import { AlertsTimeline } from '@/components/dashboard/AlertsTimeline';
import { ActionItems } from '@/components/dashboard/ActionItems';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useStore } from '@/stores/useStore';

export function DashboardPage() {
  const users = useStore((s) => s.users);
  const clients = useStore((s) => s.clients);
  const transactions = useStore((s) => s.transactions);
  const licence = useStore((s) => s.licence);

  const stats = [
    { label: 'Salespersons', value: users.length },
    { label: 'Active Clients', value: clients.length },
    { label: 'Transactions', value: transactions.length },
    { label: 'Representatives', value: licence?.repCount ?? 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h2>
        <p className="text-sm text-gray-500">Estate Agents Act 2010 — CEA Regulatory Compliance Overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-card-border p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComplianceScore />
        <AlertsTimeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionItems />
        <ActivityFeed />
      </div>
    </div>
  );
}
