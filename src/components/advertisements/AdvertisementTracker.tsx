import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { formatDate } from '@/lib/utils';
import { Plus, CheckCircle, XCircle, Paperclip, Upload } from 'lucide-react';
import type { Advertisement, AdvertisementMedium } from '@/types';

const mediumLabels: Record<AdvertisementMedium, string> = {
  online_portal: 'Online Portal',
  social_media: 'Social Media',
  newspaper: 'Newspaper',
  flyer_brochure: 'Flyer / Brochure',
  signboard: 'Signboard',
  other: 'Other',
};

function ComplianceIcon({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle className="h-4 w-4 text-green-600" />
    : <XCircle className="h-4 w-4 text-red-500" />;
}

export function AdvertisementTracker() {
  const advertisements = useStore((s) => s.advertisements);
  const users = useStore((s) => s.users);
  const addAdvertisement = useStore((s) => s.addAdvertisement);
  const [showForm, setShowForm] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; url: string } | null>(null);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    salespersonId: '',
    medium: 'online_portal' as AdvertisementMedium,
    description: '',
    clientApproval: false,
    agentNameDisplayed: true,
    agentContactDisplayed: true,
    agentLicenceDisplayed: true,
    salespersonNameDisplayed: true,
    salespersonRegDisplayed: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachment({ name: file.name, url });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salesperson = users.find((u) => u.id === formData.salespersonId);
    if (!salesperson) return;

    addAdvertisement({
      id: `ad-${Date.now()}`,
      propertyAddress: formData.propertyAddress,
      salespersonId: formData.salespersonId,
      salespersonName: salesperson.name,
      medium: formData.medium,
      description: formData.description,
      clientApproval: formData.clientApproval,
      clientApprovalDate: formData.clientApproval ? new Date().toISOString().split('T')[0] : undefined,
      vettingStatus: 'pending_vetting',
      agentNameDisplayed: formData.agentNameDisplayed,
      agentContactDisplayed: formData.agentContactDisplayed,
      agentLicenceDisplayed: formData.agentLicenceDisplayed,
      salespersonNameDisplayed: formData.salespersonNameDisplayed,
      salespersonRegDisplayed: formData.salespersonRegDisplayed,
      attachmentName: attachment?.name,
      attachmentUrl: attachment?.url,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setFormData({
      propertyAddress: '', salespersonId: '', medium: 'online_portal', description: '',
      clientApproval: false, agentNameDisplayed: true, agentContactDisplayed: true,
      agentLicenceDisplayed: true, salespersonNameDisplayed: true, salespersonRegDisplayed: true,
    });
    setAttachment(null);
    setShowForm(false);
  };

  const pendingCount = advertisements.filter((a) => a.vettingStatus === 'pending_vetting').length;
  const publishedCount = advertisements.filter((a) => a.vettingStatus === 'published').length;
  const rejectedCount = advertisements.filter((a) => a.vettingStatus === 'rejected').length;
  const noClientApproval = advertisements.filter((a) => !a.clientApproval && a.vettingStatus !== 'removed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Advertisement Register</h3>
          <p className="text-sm text-gray-500">Pre-publication vetting &amp; compliance tracking</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Advertisement
        </button>
      </div>

      <AlertBanner type="info" message="Estate agents SHALL vet all publicity and advertising materials of their salespersons PRIOR to publication (Code of Practice, Section 4(3)). All advertisements must display agent name, contact, licence number, salesperson name, and registration number (Code of Ethics, Section 12)." className="mb-4" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Pending Vetting</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Published</p>
          <p className="text-2xl font-bold text-blue-600">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-card-border p-5">
          <p className="text-sm text-gray-500 mb-1">Missing Client Approval</p>
          <p className="text-2xl font-bold text-orange-600">{noClientApproval}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-card-border p-6 mb-4">
          <h4 className="font-medium text-gray-700 mb-4">Submit Advertisement for Vetting</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
              <input type="text" value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
              <select value={formData.salespersonId} onChange={(e) => setFormData({ ...formData, salespersonId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select salesperson...</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
              <select value={formData.medium} onChange={(e) => setFormData({ ...formData, medium: e.target.value as AdvertisementMedium })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {Object.entries(mediumLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="clientApproval" checked={formData.clientApproval} onChange={(e) => setFormData({ ...formData, clientApproval: e.target.checked })} className="rounded" />
              <label htmlFor="clientApproval" className="text-sm text-gray-700">Client has given prior written approval</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Content Summary</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Advertisement</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  {attachment ? 'Change File' : 'Upload File'}
                  <input type="file" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" className="hidden" />
                </label>
                {attachment && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Paperclip className="h-4 w-4" />
                    <span>{attachment.name}</span>
                    <button type="button" onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700 text-xs ml-1">&times;</button>
                  </div>
                )}
                {!attachment && <span className="text-xs text-gray-400">Images, PDF, or Word documents</span>}
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Identification Checklist (Section 12)</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'agentNameDisplayed', label: 'Agent Name' },
                  { key: 'agentContactDisplayed', label: 'Agent Contact' },
                  { key: 'agentLicenceDisplayed', label: 'Agent Licence No.' },
                  { key: 'salespersonNameDisplayed', label: 'Salesperson Name' },
                  { key: 'salespersonRegDisplayed', label: 'Salesperson Reg No.' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={formData[key as keyof typeof formData] as boolean} onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })} className="rounded" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Submit for Vetting</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Property', accessor: (row: Advertisement) => (
              <div>
                <p className="font-medium text-gray-900 truncate max-w-[200px]">{row.propertyAddress}</p>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{row.description}</p>
              </div>
            )},
            { header: 'Salesperson', accessor: 'salespersonName' as keyof Advertisement },
            { header: 'Medium', accessor: (row: Advertisement) => mediumLabels[row.medium] },
            { header: 'Sample', accessor: (row: Advertisement) => row.attachmentName ? (
              <a href={row.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs">
                <Paperclip className="h-3.5 w-3.5" />
                <span className="truncate max-w-[100px]">{row.attachmentName}</span>
              </a>
            ) : <span className="text-gray-400 text-xs">None</span> },
            { header: 'Status', accessor: (row: Advertisement) => <StatusBadge status={row.vettingStatus} /> },
            { header: 'Client OK', accessor: (row: Advertisement) => <ComplianceIcon ok={row.clientApproval} /> },
            { header: 'IDs Complete', accessor: (row: Advertisement) => {
              const allOk = row.agentNameDisplayed && row.agentContactDisplayed && row.agentLicenceDisplayed && row.salespersonNameDisplayed && row.salespersonRegDisplayed;
              return <ComplianceIcon ok={allOk} />;
            }},
            { header: 'Submitted', accessor: (row: Advertisement) => formatDate(row.createdAt) },
            { header: 'Vetted', accessor: (row: Advertisement) => row.vettedAt ? formatDate(row.vettedAt) : <span className="text-gray-400">-</span> },
          ]}
          data={advertisements}
          emptyMessage="No advertisements recorded."
        />
      </div>
    </div>
  );
}
