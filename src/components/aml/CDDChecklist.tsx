import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTable } from '@/components/common/DataTable';
import { AlertBanner } from '@/components/common/AlertBanner';
import { CheckCircle2, Circle, Clock, Plus, User, Building2 } from 'lucide-react';
import type { Client } from '@/types';
import { formatDate } from '@/lib/utils';

const CDD_STEPS_INDIVIDUAL = [
  { key: 'written_agreement', label: 'Written agreement entered with client' },
  { key: 'risk_assessment', label: 'Risk determination documented (ML/PF/TF)' },
  { key: 'identity_collection', label: 'Identifying information collected (name, DOB, nationality, ID, occupation)' },
  { key: 'identity_verification', label: 'Identity verified (NRIC/passport/govt ID)' },
  { key: 'acting_on_behalf', label: 'Determined if acting on behalf of another person' },
  { key: 'authorization_docs', label: 'Authorization documents obtained (if applicable)' },
  { key: 'pep_screening', label: 'Politically Exposed Person (PEP) screening completed' },
  { key: 'sanctions_screening', label: 'Sanctions screening completed (TSFA/UN Act/CEA lists)' },
];

const CDD_STEPS_ENTITY = [
  ...CDD_STEPS_INDIVIDUAL,
  { key: 'entity_legal_form', label: 'Entity legal form and proof of existence obtained' },
  { key: 'entity_directors', label: 'Directors/senior management identified' },
  { key: 'beneficial_owners', label: 'Beneficial owners identified and verified' },
  { key: 'ownership_structure', label: 'Ownership and control structure understood' },
];

export function CDDChecklist() {
  const clients = useStore((s) => s.clients);
  const cddRecords = useStore((s) => s.cddRecords);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const getClientCDDStatus = (clientId: string) => {
    const records = cddRecords.filter((r) => r.clientId === clientId);
    const completed = records.filter((r) => r.status === 'completed').length;
    const total = clients.find((c) => c.id === clientId)?.type === 'entity' ? CDD_STEPS_ENTITY.length : CDD_STEPS_INDIVIDUAL.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  if (selectedClient) {
    const steps = selectedClient.type === 'entity' ? CDD_STEPS_ENTITY : CDD_STEPS_INDIVIDUAL;
    const records = cddRecords.filter((r) => r.clientId === selectedClient.id);
    const completedKeys = records.filter((r) => r.status === 'completed').map((r) => r.checkType);
    const inProgressKeys = records.filter((r) => r.status === 'in_progress').map((r) => r.checkType);

    return (
      <div>
        <button onClick={() => setSelectedClient(null)} className="text-sm text-primary hover:underline mb-4">&larr; Back to clients</button>

        <div className="bg-white rounded-xl border border-card-border p-6 mb-4">
          <div className="flex items-center gap-3 mb-2">
            {selectedClient.type === 'entity' ? <Building2 className="h-5 w-5 text-gray-500" /> : <User className="h-5 w-5 text-gray-500" />}
            <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
            <StatusBadge status={selectedClient.riskLevel} />
            {selectedClient.pepStatus && <StatusBadge status="high" className="!bg-purple-100 !text-purple-800" />}
          </div>
          {selectedClient.pepStatus && (
            <AlertBanner type="warning" message="This client is a Politically Exposed Person (PEP). Enhanced CDD measures are required under Regulation 6." className="mt-3" />
          )}
          {selectedClient.riskLevel === 'high' && (
            <AlertBanner type="error" message="High risk client. Enhanced CDD required — designated officer approval must be obtained before proceeding." className="mt-3" />
          )}
        </div>

        <div className="bg-white rounded-xl border border-card-border p-6">
          <h4 className="font-medium text-gray-700 mb-4">CDD Checklist (Reg 4-5, AML Regulations 2021)</h4>
          <div className="space-y-3">
            {steps.map((step) => {
              const done = completedKeys.includes(step.key);
              const inProg = inProgressKeys.includes(step.key);
              return (
                <div key={step.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  ) : inProg ? (
                    <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{step.label}</span>
                  {done && (
                    <span className="ml-auto text-xs text-gray-400">
                      {formatDate(records.find((r) => r.checkType === step.key)?.completedAt ?? '')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Client CDD Records</h3>
          <p className="text-sm text-gray-500">Customer Due Diligence — Reg 4-5, AML Regulations 2021</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <DataTable
          columns={[
            { header: 'Client', accessor: (row: Client) => (
              <div className="flex items-center gap-2">
                {row.type === 'entity' ? <Building2 className="h-4 w-4 text-gray-400" /> : <User className="h-4 w-4 text-gray-400" />}
                <span className="font-medium">{row.name}</span>
              </div>
            )},
            { header: 'Type', accessor: (row: Client) => <span className="capitalize">{row.type}</span> },
            { header: 'Risk', accessor: (row: Client) => <StatusBadge status={row.riskLevel} /> },
            { header: 'PEP', accessor: (row: Client) => row.pepStatus ? <StatusBadge status="high" className="!bg-purple-100 !text-purple-800" /> : <span className="text-gray-400">No</span> },
            { header: 'CDD Progress', accessor: (row: Client) => {
              const s = getClientCDDStatus(row.id);
              return (
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.percentage === 100 ? 'bg-green-500' : s.percentage > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.percentage}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{s.completed}/{s.total}</span>
                </div>
              );
            }},
            { header: 'CDD Status', accessor: (row: Client) => <StatusBadge status={row.cddCompleted ? 'completed' : 'pending'} /> },
          ]}
          data={clients}
          onRowClick={setSelectedClient}
        />
      </div>
    </div>
  );
}
