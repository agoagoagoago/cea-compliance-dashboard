import { DocumentVault } from '@/components/documents/DocumentVault';

export function DocumentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Document Retention</h2>
        <p className="text-sm text-gray-500">AML Regulations Reg 13-15 &amp; Estate Agents Act Sec 44C</p>
      </div>
      <DocumentVault />
    </div>
  );
}
