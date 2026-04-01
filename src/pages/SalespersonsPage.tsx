import { SalespersonRegistry } from '@/components/licensing/SalespersonRegistry';

export function SalespersonsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Salesperson Management</h2>
        <p className="text-sm text-gray-500">Part 3, Estate Agents Act 2010 — Registration, cards, qualifications &amp; CPE</p>
      </div>
      <SalespersonRegistry />
    </div>
  );
}
