import { useStore } from '@/stores/useStore';
import { getComplianceColor } from '@/lib/utils';

export function ComplianceScore() {
  const score = useStore((s) => s.complianceScore);

  const categories = [
    { label: 'AML / CDD', value: score.amlCdd },
    { label: 'Licensing', value: score.licensing },
    { label: 'Transactions', value: score.transactions },
    { label: 'Documents', value: score.documentRetention },
    { label: 'CPE', value: score.cpe },
  ];

  return (
    <div className="bg-white rounded-xl border border-card-border p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Compliance Score</h3>
      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-28 w-28">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={score.overall >= 90 ? '#16a34a' : score.overall >= 70 ? '#d97706' : '#dc2626'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${score.overall * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getComplianceColor(score.overall)}`}>
              {score.overall}%
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{cat.label}</span>
                <span className={`font-medium ${getComplianceColor(cat.value)}`}>{cat.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.value >= 90 ? 'bg-green-500' : cat.value >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${cat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
