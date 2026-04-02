import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  active: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800',
  suspended: 'bg-orange-100 text-orange-800',
  cancelled: 'bg-gray-200 text-gray-600',
  clear: 'bg-green-100 text-green-800',
  match: 'bg-red-100 text-red-800',
  potential_match: 'bg-yellow-100 text-yellow-800',
  draft: 'bg-gray-100 text-gray-600',
  filed: 'bg-blue-100 text-blue-800',
  acknowledged: 'bg-green-100 text-green-800',
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  critical: 'bg-red-200 text-red-900',
  mediation: 'bg-blue-100 text-blue-800',
  arbitration: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  withdrawn: 'bg-gray-200 text-gray-600',
  pending_vetting: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  published: 'bg-blue-100 text-blue-800',
  removed: 'bg-gray-200 text-gray-600',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusStyles[status] ?? 'bg-gray-100 text-gray-800', className)}>
      {label}
    </span>
  );
}
