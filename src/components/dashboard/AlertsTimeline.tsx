import { useStore } from '@/stores/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { X } from 'lucide-react';

export function AlertsTimeline() {
  const alerts = useStore((s) => s.alerts);
  const dismissAlert = useStore((s) => s.dismissAlert);
  const active = alerts.filter((a) => !a.dismissed).sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="bg-white rounded-xl border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
        <span className="text-xs text-gray-400">{active.length} items</span>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {active.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No active alerts</p>
        ) : (
          active.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <StatusBadge status={alert.priority} />
              <p className="flex-1 text-sm text-gray-700">{alert.message}</p>
              <button onClick={() => dismissAlert(alert.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
