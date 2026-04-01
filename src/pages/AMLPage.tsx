import { useState } from 'react';
import { CDDChecklist } from '@/components/aml/CDDChecklist';
import { SanctionsScreening } from '@/components/aml/SanctionsScreening';
import { STRForm } from '@/components/aml/STRForm';
import { RiskAssessment } from '@/components/aml/RiskAssessment';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'cdd', label: 'Client CDD' },
  { id: 'sanctions', label: 'Sanctions Screening' },
  { id: 'str', label: 'STR Reports' },
  { id: 'risk', label: 'Risk Assessment' },
];

export function AMLPage() {
  const [activeTab, setActiveTab] = useState('cdd');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AML / CDD Compliance</h2>
        <p className="text-sm text-gray-500">Prevention of Money Laundering, Proliferation Financing and Terrorism Financing Regulations 2021</p>
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

      {activeTab === 'cdd' && <CDDChecklist />}
      {activeTab === 'sanctions' && <SanctionsScreening />}
      {activeTab === 'str' && <STRForm />}
      {activeTab === 'risk' && <RiskAssessment />}
    </div>
  );
}
