import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { SanctionsScreening as ScreeningType } from '@/types';

const SANCTIONS_LISTS = [
  'Terrorism (Suppression of Financing) Act 2002',
  'UN Act 2001 — Designated Persons',
  'CEA-specified persons list',
];

export function SanctionsScreening() {
  const screenings = useStore((s) => s.sanctionsScreenings);
  const clients = useStore((s) => s.clients);
  const addSanctionsScreening = useStore((s) => s.addSanctionsScreening);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', result: 'clear' as ScreeningType['result'], notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) return;
    addSanctionsScreening({
      id: `ss-${Date.now()}`,
      clientId: formData.clientId,
      screenedBy: 'u1',
      result: formData.result,
      screenedAt: new Date().toISOString(),
      lists: SANCTIONS_LISTS,
      notes: formData.notes,
    });
    setFormData({ clientId: '', result: 'clear', notes: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Targeted Financial Sanctions Screening</h3>
          <p className="text-sm text-gray-500">Reg 11, AML Regulations 2021 — screen BEFORE client enters property agreement</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Screening
        </button>
      </div>

      <AlertBanner type="info" message="All clients must be screened against TSFA 2002, UN Act 2001, and CEA-specified persons lists BEFORE entering any property agreement." className="mb-4" />

      {showForm && (
        <div className="bg-white rounded-xl border border-card-border p-6 mb-4">
          <h4 className="font-medium text-gray-700 mb-4">Conduct Sanctions Screening</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lists Screened</label>
              <div className="space-y-2">
                {SANCTIONS_LISTS.map((list) => (
                  <label key={list} className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked disabled className="rounded" />
                    {list}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
              <select value={formData.result} onChange={(e) => setFormData({ ...formData, result: e.target.value as ScreeningType['result'] })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="clear">Clear — No match</option>
                <option value="potential_match">Potential Match — Requires review</option>
                <option value="match">Match — Do NOT proceed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} />
            </div>
            {formData.result === 'match' && (
              <AlertBanner type="error" message="MATCH FOUND: You MUST NOT carry out any transaction with or for this client. A Suspicious Transaction Report must be filed immediately." />
            )}
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Record Screening</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Client', accessor: (row: ScreeningType) => clients.find((c) => c.id === row.clientId)?.name ?? row.clientId },
            { header: 'Screened By', accessor: 'screenedBy' as keyof ScreeningType },
            { header: 'Date', accessor: (row: ScreeningType) => formatDate(row.screenedAt) },
            { header: 'Result', accessor: (row: ScreeningType) => <StatusBadge status={row.result} /> },
            { header: 'Lists', accessor: (row: ScreeningType) => <span className="text-xs text-gray-500">{row.lists.length} lists checked</span> },
          ]}
          data={screenings}
          emptyMessage="No screenings recorded yet. Screen all clients before property agreements."
        />
      </div>
    </div>
  );
}
