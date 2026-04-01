import { useState } from 'react';
import { LicenceTracker } from '@/components/licensing/LicenceTracker';
import { CPETracker } from '@/components/licensing/CPETracker';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'licence', label: 'Agency Licence' },
  { id: 'cpe', label: 'CPE Training' },
];

export function LicensingPage() {
  const [activeTab, setActiveTab] = useState('licence');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Licensing & CPE</h2>
        <p className="text-sm text-gray-500">Estate Agents Act 2010, Part 3 — Licensing &amp; Registration Regulations</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'licence' && <LicenceTracker />}
      {activeTab === 'cpe' && <CPETracker />}
    </div>
  );
}
