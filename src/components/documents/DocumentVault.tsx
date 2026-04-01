import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AlertBanner } from '@/components/common/AlertBanner';
import { formatDate, daysUntil } from '@/lib/utils';
import { Upload, Lock, FileText } from 'lucide-react';
import type { Document, DocumentCategory } from '@/types';

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: 'cdd', label: 'CDD Documents' },
  { value: 'training', label: 'Training Records' },
  { value: 'investigation', label: 'Investigation / STR' },
  { value: 'risk_assessment', label: 'Risk Assessments' },
  { value: 'compliance_audit', label: 'Compliance Audits' },
  { value: 'estate_agency_agreement', label: 'Agency Agreements' },
  { value: 'insurance', label: 'Insurance Policies' },
  { value: 'cpe', label: 'CPE Records' },
  { value: 'other', label: 'Other' },
];

export function DocumentVault() {
  const documents = useStore((s) => s.documents);
  const addDocument = useStore((s) => s.addDocument);
  const [filter, setFilter] = useState<DocumentCategory | 'all'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({ category: 'cdd' as DocumentCategory, fileName: '', description: '', entityType: 'agency' as Document['entityType'], entityId: 'agency' });

  const filtered = filter === 'all' ? documents : documents.filter((d) => d.category === filter);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const retentionYears = 5;
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + retentionYears);

    addDocument({
      id: `doc-${Date.now()}`,
      entityType: formData.entityType,
      entityId: formData.entityId,
      category: formData.category,
      fileName: formData.fileName,
      filePath: `/docs/${formData.fileName}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'u1',
      retentionExpiry: expiry.toISOString(),
      description: formData.description,
    });
    setFormData({ category: 'cdd', fileName: '', description: '', entityType: 'agency', entityId: 'agency' });
    setShowUpload(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Document Vault</h3>
          <p className="text-sm text-gray-500">5-year retention — Reg 14, AML Regulations 2021 &amp; Sec 44C</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>

      <AlertBanner type="info" message="CDD/transaction documents: 5 years after estate agency work completed. Training/compliance records: 5 years after record made. Documents cannot be deleted before retention expiry." className="mb-4" />

      {showUpload && (
        <div className="bg-white rounded-xl border border-card-border p-6 mb-4">
          <h4 className="font-medium text-gray-700 mb-4">Upload Document</h4>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
              <input type="text" value={formData.fileName} onChange={(e) => setFormData({ ...formData, fileName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required placeholder="document_name.pdf" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Brief description of the document" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Upload</button>
              <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === 'all' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          All ({documents.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = documents.filter((d) => d.category === cat.value).length;
          return (
            <button key={cat.value} onClick={() => setFilter(cat.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === cat.value ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Document', accessor: (row: Document) => (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-sm">{row.fileName}</span>
              </div>
            )},
            { header: 'Category', accessor: (row: Document) => {
              const cat = CATEGORIES.find((c) => c.value === row.category);
              return <span className="text-xs">{cat?.label ?? row.category}</span>;
            }},
            { header: 'Description', accessor: (row: Document) => <span className="text-xs text-gray-500 truncate max-w-48 block">{row.description}</span> },
            { header: 'Uploaded', accessor: (row: Document) => formatDate(row.uploadedAt) },
            { header: 'Retention Expiry', accessor: (row: Document) => {
              const days = daysUntil(row.retentionExpiry);
              return (
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs">{formatDate(row.retentionExpiry)}</span>
                  <span className="text-xs text-gray-400">({days}d)</span>
                </div>
              );
            }},
            { header: 'Status', accessor: (row: Document) => {
              const days = daysUntil(row.retentionExpiry);
              return days > 365 ? <StatusBadge status="active" /> : days > 0 ? <StatusBadge status="in_progress" /> : <StatusBadge status="expired" />;
            }},
          ]}
          data={filtered}
          emptyMessage="No documents in this category."
        />
      </div>
    </div>
  );
}
