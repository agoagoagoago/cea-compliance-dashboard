import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate, daysUntil, getUrgencyColor } from '@/lib/utils';
import { AlertBanner } from '@/components/common/AlertBanner';
import type { User } from '@/types';

export function SalespersonRegistry() {
  const users = useStore((s) => s.users);

  const missingCards = users.filter((u) => !u.agentCardIssued && u.status === 'active');

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Salesperson Registry</h3>
        <p className="text-sm text-gray-500">Part 3, Estate Agents Act 2010 &amp; Licensing Regulations</p>
      </div>

      {missingCards.length > 0 && (
        <AlertBanner type="warning" message={`${missingCards.length} salesperson(s) without estate agent card issued — Reg 9 requires display at all times when carrying out estate agency work.`} className="mb-4" />
      )}

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Name', accessor: (row: User) => <span className="font-medium">{row.name}</span> },
            { header: 'Reg No.', accessor: (row: User) => <span className="font-mono text-xs">{row.registrationNumber}</span> },
            { header: 'Role', accessor: (row: User) => <span className="capitalize text-xs">{row.role.replace('_', ' ')}</span> },
            { header: 'Status', accessor: (row: User) => <StatusBadge status={row.status} /> },
            { header: 'Agent Card', accessor: (row: User) => row.agentCardIssued ? <StatusBadge status="completed" /> : <StatusBadge status="pending" /> },
            { header: 'Reg Expiry', accessor: (row: User) => {
              if (!row.registrationExpiry) return <span className="text-gray-400">N/A</span>;
              const days = daysUntil(row.registrationExpiry);
              return <span className={getUrgencyColor(days)}>{formatDate(row.registrationExpiry)}</span>;
            }},
            { header: 'CPE', accessor: (row: User) => (
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.cpeHoursCompleted >= row.cpeHoursRequired ? 'bg-green-500' : row.cpeHoursCompleted >= row.cpeHoursRequired / 2 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (row.cpeHoursCompleted / row.cpeHoursRequired) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{row.cpeHoursCompleted}/{row.cpeHoursRequired}h</span>
              </div>
            )},
            { header: 'Qualifications', accessor: (row: User) => <span className="text-xs text-gray-500">{row.qualifications}</span> },
          ]}
          data={users}
        />
      </div>
    </div>
  );
}
