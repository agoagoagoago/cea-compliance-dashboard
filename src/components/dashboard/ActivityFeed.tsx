import { useStore } from '@/stores/useStore';
import { formatDate } from '@/lib/utils';

export function ActivityFeed() {
  const auditLog = useStore((s) => s.auditLog);
  const recent = auditLog.slice(0, 10);

  return (
    <div className="bg-white rounded-xl border border-card-border p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recent.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 text-sm">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-blue-700">
                {entry.userName.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700">{entry.details}</p>
              <p className="text-xs text-gray-400 mt-0.5">{entry.userName} &middot; {formatDate(entry.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
