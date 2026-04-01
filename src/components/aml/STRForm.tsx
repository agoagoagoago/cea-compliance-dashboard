import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { STRReport } from '@/types';

export function STRForm() {
  const strReports = useStore((s) => s.strReports);
  const clients = useStore((s) => s.clients);
  const addSTRReport = useStore((s) => s.addSTRReport);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', reason: '', stroReference: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) return;
    addSTRReport({
      id: `str-${Date.now()}`,
      clientId: formData.clientId,
      clientName: client.name,
      filedBy: 'u1',
      reason: formData.reason,
      filedAt: new Date().toISOString(),
      stroReference: formData.stroReference || undefined,
      status: formData.stroReference ? 'filed' : 'draft',
    });
    setFormData({ clientId: '', reason: '', stroReference: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Suspicious Transaction Reports</h3>
          <p className="text-sm text-gray-500">Reg 11(4), AML Regulations 2021</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
          <Plus className="h-4 w-4" /> File STR
        </button>
      </div>

      <AlertBanner type="warning" message="TIPPING-OFF PROHIBITION (Reg 12): Do NOT inform the client or any other person that an STR has been or will be filed. Violation may result in criminal liability." className="mb-4" />

      {showForm && (
        <div className="bg-white rounded-xl border border-red-200 p-6 mb-4">
          <h4 className="font-medium text-gray-700 mb-4">File Suspicious Transaction Report</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client / Subject</label>
              <select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Suspicion</label>
              <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={4} required placeholder="Describe the suspicious activity, unusual patterns, or reasons for filing..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">STRO Reference (if already filed)</label>
              <input type="text" value={formData.stroReference} onChange={(e) => setFormData({ ...formData, stroReference: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Enter STRO reference number" />
            </div>
            <AlertBanner type="info" message="File via the Suspicious Transaction Reporting Office (STRO) electronic system. Record the reference number here after filing." />
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Record STR</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Client', accessor: 'clientName' as keyof STRReport },
            { header: 'Filed By', accessor: 'filedBy' as keyof STRReport },
            { header: 'Date Filed', accessor: (row: STRReport) => formatDate(row.filedAt) },
            { header: 'Status', accessor: (row: STRReport) => <StatusBadge status={row.status} /> },
            { header: 'STRO Ref', accessor: (row: STRReport) => row.stroReference ?? <span className="text-gray-400">Pending</span> },
            { header: 'Reason', accessor: (row: STRReport) => <span className="text-xs text-gray-600 truncate max-w-48 block">{row.reason}</span> },
          ]}
          data={strReports}
          emptyMessage="No STR reports filed."
        />
      </div>
    </div>
  );
}
