import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { AlertBanner } from '@/components/common/AlertBanner';
import { formatDate, daysUntil, getUrgencyColor } from '@/lib/utils';
import type { RiskAssessment as RAType } from '@/types';

export function RiskAssessment() {
  const riskAssessments = useStore((s) => s.riskAssessments);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Risk Assessment & Internal Controls</h3>
        <p className="text-sm text-gray-500">Reg 10, AML Regulations 2021</p>
      </div>

      <AlertBanner type="info" message="Licensed estate agents must identify, assess, and understand ML/PF/TF risks for each property transaction. Risk assessments must be documented, kept up to date, and provided to CEA on request." className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Compliance Officer</p>
          <p className="text-lg font-semibold">Sarah Lim</p>
          <p className="text-xs text-gray-400">Designated under Reg 10</p>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Last Agency-Wide Assessment</p>
          <p className="text-lg font-semibold">{riskAssessments.length > 0 ? formatDate(riskAssessments[0].assessmentDate) : 'None'}</p>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Next Review Due</p>
          {riskAssessments.length > 0 ? (
            <>
              <p className={`text-lg font-semibold ${getUrgencyColor(daysUntil(riskAssessments[0].nextReview))}`}>
                {formatDate(riskAssessments[0].nextReview)}
              </p>
              <p className="text-xs text-gray-400">{daysUntil(riskAssessments[0].nextReview)} days remaining</p>
            </>
          ) : (
            <p className="text-lg font-semibold text-danger">Not scheduled</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-card-border overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="font-medium text-gray-700">Assessment History</h4>
        </div>
        <DataTable
          columns={[
            { header: 'Scope', accessor: (row: RAType) => <span className="capitalize">{row.scope.replace(/_/g, ' ')}</span> },
            { header: 'Date', accessor: (row: RAType) => formatDate(row.assessmentDate) },
            { header: 'Assessed By', accessor: 'assessedBy' as keyof RAType },
            { header: 'Next Review', accessor: (row: RAType) => formatDate(row.nextReview) },
            { header: 'Findings', accessor: (row: RAType) => <span className="text-xs text-gray-600 truncate max-w-64 block">{row.findings}</span> },
          ]}
          data={riskAssessments}
          emptyMessage="No risk assessments recorded."
        />
      </div>

      <div className="bg-white rounded-xl border border-card-border p-6">
        <h4 className="font-medium text-gray-700 mb-4">Required Internal Controls (Reg 10)</h4>
        <div className="space-y-3 text-sm">
          {[
            'Internal policies, procedures, and controls to manage ML/PF/TF risks',
            'Ongoing training programme for salespersons on internal policies',
            'Internal checks and independent audits for compliance',
            'Rectification measures for discovered non-compliance',
            'Designated compliance officer appointed',
            'Risk assessments kept up to date and available to CEA on request',
            'New technology risk assessment before adoption (Reg 16-17)',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium shrink-0">{i + 1}</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
