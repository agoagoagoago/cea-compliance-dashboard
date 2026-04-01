import { useStore } from '@/stores/useStore';
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react';

interface ActionItem {
  id: string;
  label: string;
  urgent: boolean;
  done: boolean;
}

export function ActionItems() {
  const clients = useStore((s) => s.clients);
  const users = useStore((s) => s.users);

  const items: ActionItem[] = [];

  // CDD incomplete clients
  clients.filter((c) => !c.cddCompleted).forEach((c) => {
    items.push({ id: `cdd-${c.id}`, label: `Complete CDD for ${c.name}`, urgent: c.riskLevel === 'high', done: false });
  });

  // Agent cards not issued
  users.filter((u) => !u.agentCardIssued && u.status === 'active').forEach((u) => {
    items.push({ id: `card-${u.id}`, label: `Issue estate agent card for ${u.name}`, urgent: false, done: false });
  });

  // CPE behind schedule
  users.filter((u) => u.cpeHoursCompleted < u.cpeHoursRequired * 0.5).forEach((u) => {
    items.push({ id: `cpe-${u.id}`, label: `${u.name}: ${u.cpeHoursCompleted}/${u.cpeHoursRequired} CPE hours`, urgent: true, done: false });
  });

  return (
    <div className="bg-white rounded-xl border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Action Items</h3>
        <span className="text-xs text-gray-400">{items.length} pending</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">All caught up!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
              {item.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : item.urgent ? (
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 shrink-0" />
              )}
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
