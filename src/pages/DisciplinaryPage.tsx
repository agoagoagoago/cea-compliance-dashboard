import { AlertBanner } from '@/components/common/AlertBanner';
import { AlertOctagon, Clock, FileText, Shield } from 'lucide-react';

export function DisciplinaryPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Regulatory Events</h2>
        <p className="text-sm text-gray-500">Sec 43 Notifications, Disciplinary Proceedings Regulations 2011, Appeals Rules 2010</p>
      </div>

      <AlertBanner type="info" message="Track mandatory CEA notifications (Sec 43), disciplinary proceedings, and appeal deadlines. All information from disciplinary proceedings is confidential — disclosure is an offence (fine up to $2,000 and/or 12 months imprisonment)." className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertOctagon className="h-6 w-6 text-amber-500" />
            <h3 className="font-semibold text-gray-800">Section 43 Event Notifications</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Mandatory notifications to CEA for prescribed events:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" /> Changes to agency information</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" /> Cessation of salesperson authority</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" /> Conviction of offences</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" /> Bankruptcy or winding-up</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" /> Other prescribed events</li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">No events recorded</p>
        </div>

        <div className="bg-white rounded-xl border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Key Deadlines</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Response to charge (admit)', deadline: '14 days from notice', ref: 'Reg 5' },
              { label: 'File defence', deadline: '14 days from notice', ref: 'Reg 5-6' },
              { label: 'Council reply to defence', deadline: '14 days from defence', ref: 'Reg 6' },
              { label: 'File rejoinder', deadline: '14 days from reply', ref: 'Reg 6' },
              { label: 'Appeal notice', deadline: '14 days from decision', ref: 'Appeals Rule 3' },
              { label: 'Appeal petition', deadline: '21 days from notice', ref: 'Appeals Rule 3' },
              { label: 'Appeal fee', deadline: 'With notice of appeal', ref: '$1,000 non-refundable' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.ref}</p>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-200 rounded-full px-2.5 py-1">{item.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-gray-500" />
            <h3 className="font-semibold text-gray-800">Disciplinary Cost Schedule</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 border-b border-gray-100">
              <span className="text-gray-600">Base cost</span>
              <span className="font-medium">$2,000</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-100">
              <span className="text-gray-600">Pre-hearing conference (uncontested, after 1st)</span>
              <span className="font-medium">$2,000/day</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-100">
              <span className="text-gray-600">Pre-hearing conference (contested, after 2nd)</span>
              <span className="font-medium">$2,000/day</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="text-gray-600">Hearing day (contested)</span>
              <span className="font-medium">$3,000/day</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-red-500" />
            <h3 className="font-semibold text-gray-800">Confidentiality Obligations</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Information from disciplinary proceedings must NOT be disclosed to any person.</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-1">Penalty for breach:</p>
            <p className="text-sm text-red-700">Fine up to $2,000 AND/OR imprisonment up to 12 months</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Reg 17, Disciplinary Proceedings Regulations 2011</p>
          <div className="mt-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Permitted disclosures:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>- To secretary, committee member, or party's solicitor</li>
              <li>- Required by court or written law</li>
              <li>- For insurance claim support</li>
              <li>- Already in public domain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
