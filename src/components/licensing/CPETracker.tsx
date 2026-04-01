import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { formatDate } from '@/lib/utils';
import type { CPERecord } from '@/types';

export function CPETracker() {
  const users = useStore((s) => s.users);
  const cpeRecords = useStore((s) => s.cpeRecords);

  const getUserCPE = (userId: string) => cpeRecords.filter((r) => r.userId === userId);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">CPE Training Hours</h3>
        <p className="text-sm text-gray-500">Reg 15, Estate Agency Work Regulations — 16 hours per calendar year</p>
      </div>

      <AlertBanner type="info" message="Every CPE-liable individual must accumulate at least 16 CPE training hours per calendar year. Records must be kept for 5 years after completion (Reg 15(4))." className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {users.map((user) => {
          const records = getUserCPE(user.id);
          const totalHours = records.reduce((sum, r) => sum + r.hours, 0);
          const accreditedHours = records.filter((r) => r.accredited).reduce((sum, r) => sum + r.hours, 0);
          const pct = Math.min(100, (totalHours / 16) * 100);
          const met = totalHours >= 16;

          return (
            <div key={user.id} className="bg-white rounded-xl border border-card-border p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-800">{user.name}</p>
                <StatusBadge status={met ? 'completed' : totalHours >= 8 ? 'in_progress' : 'pending'} />
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{totalHours} / 16 hours</span>
                  <span className={met ? 'text-green-600' : 'text-amber-600'}>{pct.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${met ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Accredited: {accreditedHours}h</span>
                <span>Activities: {records.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="font-medium text-gray-700">All CPE Records</h4>
        </div>
        <DataTable
          columns={[
            { header: 'Person', accessor: (row: CPERecord) => users.find((u) => u.id === row.userId)?.name ?? row.userId },
            { header: 'Activity', accessor: 'activityName' as keyof CPERecord },
            { header: 'Class', accessor: (row: CPERecord) => row.activityClass ?? '-' },
            { header: 'Hours', accessor: (row: CPERecord) => <span className="font-medium">{row.hours}h</span> },
            { header: 'Accredited', accessor: (row: CPERecord) => row.accredited ? <StatusBadge status="completed" /> : <span className="text-xs text-gray-400">No</span> },
            { header: 'Completed', accessor: (row: CPERecord) => formatDate(row.completedAt) },
            { header: 'Verified', accessor: (row: CPERecord) => row.verified ? <StatusBadge status="completed" /> : <StatusBadge status="pending" /> },
          ]}
          data={cpeRecords}
        />
      </div>
    </div>
  );
}
