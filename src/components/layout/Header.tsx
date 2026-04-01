import { Bell, User } from 'lucide-react';
import { useStore } from '@/stores/useStore';

export function Header() {
  const currentUser = useStore((s) => s.currentUser);
  const alerts = useStore((s) => s.alerts);
  const activeAlerts = alerts.filter((a) => !a.dismissed).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Singapore Real Estate Compliance
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          {activeAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {activeAlerts}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser?.role.replace('_', ' ')}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
