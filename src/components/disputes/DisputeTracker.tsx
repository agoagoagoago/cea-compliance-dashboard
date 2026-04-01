import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';
import type { Dispute } from '@/types';

export function DisputeTracker() {
  const disputes = useStore((s) => s.disputes);
  const clients = useStore((s) => s.clients);
  const users = useStore((s) => s.users);
  const addDispute = useStore((s) => s.addDispute);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', salespersonId: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) return;
    const now = new Date();
    const mediationDeadline = new Date(now);
    mediationDeadline.setDate(mediationDeadline.getDate() + 28); // 4 weeks for centre selection

    addDispute({
      id: `disp-${Date.now()}`,
      clientId: formData.clientId,
      clientName: client.name,
      stage: 'pending',
      startedAt: now.toISOString(),
      mediationDeadline: mediationDeadline.toISOString(),
      salespersonId: formData.salespersonId,
      notes: formData.notes,
    });
    setFormData({ clientId: '', salespersonId: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Dispute Resolution</h3>
          <p className="text-sm text-gray-500">Dispute Resolution Schemes Regulations 2011</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Record Dispute
        </button>
      </div>

      <AlertBanner type="info" message="Licensed estate agents MUST participate in the CEA Mediation-Arbitration Scheme. Cost split: 50/50 for mediation fees and arbitration deposit. Salespersons must attend all hearings." className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Approved Mediation Centres</p>
          <ul className="text-sm space-y-1">
            <li>CASE (Consumers Association)</li>
            <li>SISV (Surveyors &amp; Valuers)</li>
            <li>SMC (Mediation Centre)</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Approved Arbitration Centres</p>
          <ul className="text-sm space-y-1">
            <li>SIArb (Institute of Arbitrators)</li>
            <li>SISV (Surveyors &amp; Valuers)</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Key Timelines</p>
          <ul className="text-sm space-y-1">
            <li>Centre selection: 4 weeks</li>
            <li>Mediation: 6 weeks max</li>
            <li>Arbitration start: 3 weeks</li>
          </ul>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-card-border p-6 mb-4">
          <h4 className="font-medium text-gray-700 mb-4">Record New Dispute</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client (Complainant)</label>
              <select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson Involved</label>
              <select value={formData.salespersonId} onChange={(e) => setFormData({ ...formData, salespersonId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select salesperson...</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Record Dispute</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Client', accessor: 'clientName' as keyof Dispute },
            { header: 'Stage', accessor: (row: Dispute) => <StatusBadge status={row.stage} /> },
            { header: 'Mediation Centre', accessor: (row: Dispute) => row.mediationCentre ?? <span className="text-gray-400">Not selected</span> },
            { header: 'Started', accessor: (row: Dispute) => formatDate(row.startedAt) },
            { header: 'Deadline', accessor: (row: Dispute) => row.mediationDeadline ? formatDate(row.mediationDeadline) : '-' },
            { header: 'Salesperson', accessor: (row: Dispute) => users.find((u) => u.id === row.salespersonId)?.name ?? row.salespersonId },
          ]}
          data={disputes}
          emptyMessage="No disputes recorded."
        />
      </div>
    </div>
  );
}
