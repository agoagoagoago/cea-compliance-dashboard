import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { formatDate } from '@/lib/utils';
import { Plus, FileText } from 'lucide-react';
import type { Transaction, ClientRole, TransactionType, PropertyType } from '@/types';

export function TransactionRegister() {
  const transactions = useStore((s) => s.transactions);
  const clients = useStore((s) => s.clients);
  const addTransaction = useStore((s) => s.addTransaction);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '', clientRole: 'purchaser' as ClientRole, transactionType: 'sale' as TransactionType,
    propertyType: 'condominium' as PropertyType, propertyAddress: '', location: '',
    hdbTown: '', uraDistrict: '', agreementForm: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) return;

    // Block if CDD incomplete
    if (!client.cddCompleted) {
      alert('Cannot create transaction: CDD is incomplete for this client. Complete CDD first (Reg 4, AML Regulations 2021).');
      return;
    }

    addTransaction({
      id: `t-${Date.now()}`,
      clientId: formData.clientId,
      clientName: client.name,
      userId: 'u1',
      clientRole: formData.clientRole,
      transactionType: formData.transactionType,
      propertyType: formData.propertyType,
      propertyAddress: formData.propertyAddress,
      location: formData.location,
      hdbTown: formData.propertyType === 'hdb_flat' ? formData.hdbTown : undefined,
      uraDistrict: formData.propertyType !== 'hdb_flat' ? formData.uraDistrict : undefined,
      licenceNumber: 'L3010001A',
      salespersonRegNumbers: [],
      agreementForm: formData.agreementForm,
      agreementStartDate: new Date().toISOString().split('T')[0],
      status: 'active',
      reportedToCea: false,
    });
    setFormData({ clientId: '', clientRole: 'purchaser', transactionType: 'sale', propertyType: 'condominium', propertyAddress: '', location: '', hdbTown: '', uraDistrict: '', agreementForm: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Transaction Register</h3>
          <p className="text-sm text-gray-500">Reg 3-4, Transaction Records Regulations 2021</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Transaction
        </button>
      </div>

      <AlertBanner type="warning" message="Dual representation prohibited (Reg 5): No salesperson shall act for both vendor and purchaser, or both landlord and tenant, for the same property." className="mb-4" />

      {showForm && (
        <div className="bg-white rounded-xl border border-card-border p-6 mb-4">
          <h4 className="font-medium text-gray-700 mb-4">Record New Transaction</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required>
                <option value="">Select client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} {!c.cddCompleted ? '(CDD incomplete)' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Role</label>
              <select value={formData.clientRole} onChange={(e) => setFormData({ ...formData, clientRole: e.target.value as ClientRole })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {['purchaser', 'vendor', 'landlord', 'tenant', 'sub_tenant'].map((r) => <option key={r} value={r}>{r.replace('_', '-')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select value={formData.transactionType} onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as TransactionType })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {['sale', 'sub_sale', 'resale', 'lease', 'sub_lease'].map((t) => <option key={t} value={t}>{t.replace('_', '-')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {['condominium', 'apartment', 'executive_condominium', 'landed', 'strata_landed', 'hdb_flat'].map((p) => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
              <input type="text" value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{formData.propertyType === 'hdb_flat' ? 'HDB Town' : 'URA Postal District'}</label>
              <input type="text" value={formData.propertyType === 'hdb_flat' ? formData.hdbTown : formData.uraDistrict} onChange={(e) => setFormData({ ...formData, ...(formData.propertyType === 'hdb_flat' ? { hdbTown: e.target.value } : { uraDistrict: e.target.value }) })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Form (Residential)</label>
              <select value={formData.agreementForm} onChange={(e) => setFormData({ ...formData, agreementForm: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Not applicable</option>
                {['Form 1 — Sale (non-exclusive)', 'Form 2 — Purchase (non-exclusive)', 'Form 3 — Landlord Lease (non-exclusive)', 'Form 4 — Tenant Lease (non-exclusive)', 'Form 5 — Sale (exclusive)', 'Form 6 — Purchase (exclusive)', 'Form 7 — Landlord Lease (exclusive)', 'Form 8 — Tenant Lease (exclusive)'].map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Create Transaction</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Client', accessor: (row: Transaction) => <span className="font-medium">{row.clientName}</span> },
            { header: 'Role', accessor: (row: Transaction) => <span className="capitalize text-xs">{row.clientRole.replace('_', '-')}</span> },
            { header: 'Type', accessor: (row: Transaction) => <span className="capitalize text-xs">{row.transactionType.replace('_', '-')}</span> },
            { header: 'Property', accessor: (row: Transaction) => <span className="capitalize text-xs">{row.propertyType.replace(/_/g, ' ')}</span> },
            { header: 'Address', accessor: (row: Transaction) => <span className="text-xs text-gray-600 truncate max-w-40 block">{row.propertyAddress}</span> },
            { header: 'Status', accessor: (row: Transaction) => <StatusBadge status={row.status} /> },
            { header: 'CEA Report', accessor: (row: Transaction) => row.reportedToCea ? (
              <div className="flex items-center gap-1 text-green-600">
                <FileText className="h-3.5 w-3.5" />
                <span className="text-xs">{row.ceaReportRef}</span>
              </div>
            ) : <StatusBadge status="pending" /> },
            { header: 'Completed', accessor: (row: Transaction) => row.completedAt ? formatDate(row.completedAt) : '-' },
          ]}
          data={transactions}
        />
      </div>
    </div>
  );
}
