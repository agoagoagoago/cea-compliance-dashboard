import { create } from 'zustand';
import type {
  User, Client, CDDRecord, Transaction, Document, CPERecord,
  Licence, Dispute, Alert, SanctionsScreening, STRReport,
  RiskAssessment, AuditLogEntry, ComplianceScore, Advertisement
} from '@/types';

interface AppState {
  currentUser: User | null;
  users: User[];
  clients: Client[];
  cddRecords: CDDRecord[];
  transactions: Transaction[];
  documents: Document[];
  cpeRecords: CPERecord[];
  licence: Licence | null;
  disputes: Dispute[];
  alerts: Alert[];
  sanctionsScreenings: SanctionsScreening[];
  strReports: STRReport[];
  riskAssessments: RiskAssessment[];
  advertisements: Advertisement[];
  auditLog: AuditLogEntry[];
  complianceScore: ComplianceScore;

  // Actions
  setCurrentUser: (user: User) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addTransaction: (txn: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  addDocument: (doc: Document) => void;
  addCPERecord: (record: CPERecord) => void;
  addAlert: (alert: Alert) => void;
  dismissAlert: (id: string) => void;
  addAuditEntry: (entry: AuditLogEntry) => void;
  addCDDRecord: (record: CDDRecord) => void;
  updateCDDRecord: (id: string, updates: Partial<CDDRecord>) => void;
  addSTRReport: (report: STRReport) => void;
  addSanctionsScreening: (screening: SanctionsScreening) => void;
  addDispute: (dispute: Dispute) => void;
  updateDispute: (id: string, updates: Partial<Dispute>) => void;
  addRiskAssessment: (ra: RiskAssessment) => void;
  updateLicence: (updates: Partial<Licence>) => void;
  addAdvertisement: (ad: Advertisement) => void;
  updateAdvertisement: (id: string, updates: Partial<Advertisement>) => void;
}

// Demo data
const demoUsers: User[] = [
  {
    id: 'u1', name: 'Tan Wei Ming', email: 'weiming@example.com', role: 'admin',
    registrationNumber: 'R012345A', licenceNumber: 'L3010001A', status: 'active',
    agentCardIssued: true, joinDate: '2020-03-15', registrationExpiry: '2026-12-31',
    qualifications: 'RES Exam (2019), Real Estate Agency Exam (2020)', cpeHoursCompleted: 12, cpeHoursRequired: 16,
  },
  {
    id: 'u2', name: 'Sarah Lim', email: 'sarah@example.com', role: 'compliance_officer',
    registrationNumber: 'R012346B', status: 'active',
    agentCardIssued: true, joinDate: '2021-06-01', registrationExpiry: '2026-12-31',
    qualifications: 'RES Exam (2021)', cpeHoursCompleted: 16, cpeHoursRequired: 16,
  },
  {
    id: 'u3', name: 'Ahmad bin Hassan', email: 'ahmad@example.com', role: 'salesperson',
    registrationNumber: 'R012347C', status: 'active',
    agentCardIssued: true, joinDate: '2022-01-10', registrationExpiry: '2026-12-31',
    qualifications: 'RES Exam (2021)', cpeHoursCompleted: 8, cpeHoursRequired: 16,
  },
  {
    id: 'u4', name: 'Priya Nair', email: 'priya@example.com', role: 'salesperson',
    registrationNumber: 'R012348D', status: 'active',
    agentCardIssued: false, joinDate: '2023-03-20', registrationExpiry: '2026-12-31',
    qualifications: 'RES Exam (2022)', cpeHoursCompleted: 4, cpeHoursRequired: 16,
  },
  {
    id: 'u5', name: 'Jason Ong', email: 'jason@example.com', role: 'salesperson',
    registrationNumber: 'R012349E', status: 'active',
    agentCardIssued: true, joinDate: '2021-09-05', registrationExpiry: '2026-12-31',
    qualifications: 'RES Exam (2021)', cpeHoursCompleted: 14, cpeHoursRequired: 16,
  },
];

const demoClients: Client[] = [
  {
    id: 'c1', name: 'David Chen', type: 'individual', riskLevel: 'low', pepStatus: false,
    cddCompleted: true, createdAt: '2025-11-10', assignedTo: 'u3',
    nationality: 'Singaporean', idNumber: 'S8012345A', dateOfBirth: '1980-05-15', occupation: 'Engineer',
    actingOnBehalf: false,
  },
  {
    id: 'c2', name: 'Golden Dragon Pte Ltd', type: 'entity', riskLevel: 'medium', pepStatus: false,
    cddCompleted: false, createdAt: '2026-02-01', assignedTo: 'u5',
    actingOnBehalf: false,
    entityDetails: { legalForm: 'Private Limited Company', registeredAddress: '123 Robinson Rd, Singapore 068902', principalBusinessAddress: '123 Robinson Rd, Singapore 068902', beneficialOwners: ['Lee Kah Wai', 'Ng Mei Ling'] },
  },
  {
    id: 'c3', name: 'Amir Abdullah', type: 'individual', riskLevel: 'high', pepStatus: true,
    cddCompleted: false, createdAt: '2026-03-15', assignedTo: 'u3',
    nationality: 'Malaysian', idNumber: 'A12345678', dateOfBirth: '1975-08-22', occupation: 'Government Official',
    actingOnBehalf: true,
  },
];

const demoCDDRecords: CDDRecord[] = [
  { id: 'cdd1', clientId: 'c1', userId: 'u3', checkType: 'identity_verification', status: 'completed', completedAt: '2025-11-10', nextReview: '2026-05-10' },
  { id: 'cdd2', clientId: 'c1', userId: 'u3', checkType: 'risk_assessment', status: 'completed', completedAt: '2025-11-10', nextReview: '2026-05-10' },
  { id: 'cdd3', clientId: 'c1', userId: 'u3', checkType: 'pep_screening', status: 'completed', completedAt: '2025-11-10', nextReview: '2026-05-10' },
  { id: 'cdd4', clientId: 'c2', userId: 'u5', checkType: 'identity_verification', status: 'in_progress' },
  { id: 'cdd5', clientId: 'c2', userId: 'u5', checkType: 'beneficial_owner_identification', status: 'pending' },
  { id: 'cdd6', clientId: 'c3', userId: 'u3', checkType: 'enhanced_cdd', status: 'pending', notes: 'PEP — requires designated officer approval' },
];

const demoTransactions: Transaction[] = [
  {
    id: 't1', clientId: 'c1', clientName: 'David Chen', userId: 'u3', clientRole: 'purchaser',
    transactionType: 'resale', propertyType: 'condominium', propertyAddress: '10 Bayfront Ave, #12-05, Marina Bay Residences',
    location: 'Marina Bay', uraDistrict: '01', completedAt: '2026-01-20', reportedToCea: true,
    ceaReportDate: '2026-01-25', ceaReportRef: 'CEA-2026-00123',
    licenceNumber: 'L3010001A', salespersonRegNumbers: ['R012347C'],
    agreementForm: 'Form 2', agreementStartDate: '2025-11-15', agreementEndDate: '2026-02-15',
    status: 'completed',
  },
  {
    id: 't2', clientId: 'c2', clientName: 'Golden Dragon Pte Ltd', userId: 'u5', clientRole: 'purchaser',
    transactionType: 'sale', propertyType: 'condominium', propertyAddress: '8 Shenton Way, #25-01',
    location: 'Shenton Way', uraDistrict: '01',
    licenceNumber: 'L3010001A', salespersonRegNumbers: ['R012349E'],
    agreementForm: 'Form 2', agreementStartDate: '2026-02-01',
    status: 'active',
    reportedToCea: false,
  },
];

const demoDocuments: Document[] = [
  { id: 'd1', entityType: 'client', entityId: 'c1', category: 'cdd', fileName: 'david_chen_nric.pdf', filePath: '/docs/c1/nric.pdf', uploadedAt: '2025-11-10', uploadedBy: 'u3', retentionExpiry: '2031-01-20', description: 'NRIC copy for identity verification' },
  { id: 'd2', entityType: 'client', entityId: 'c1', category: 'cdd', fileName: 'david_chen_risk_assessment.pdf', filePath: '/docs/c1/risk.pdf', uploadedAt: '2025-11-10', uploadedBy: 'u3', retentionExpiry: '2031-01-20', description: 'Risk assessment document' },
  { id: 'd3', entityType: 'agency', entityId: 'agency', category: 'insurance', fileName: 'pi_insurance_2026.pdf', filePath: '/docs/agency/insurance.pdf', uploadedAt: '2026-01-05', uploadedBy: 'u1', retentionExpiry: '2031-12-31', description: 'Professional indemnity insurance certificate 2026' },
  { id: 'd4', entityType: 'agency', entityId: 'agency', category: 'risk_assessment', fileName: 'aml_risk_assessment_2026.pdf', filePath: '/docs/agency/aml_risk.pdf', uploadedAt: '2026-01-15', uploadedBy: 'u2', retentionExpiry: '2031-01-15', description: 'Annual AML/CFT risk assessment' },
];

const demoCPERecords: CPERecord[] = [
  { id: 'cpe1', userId: 'u1', activityName: 'AML/CFT Compliance for Estate Agents', accredited: true, hours: 4, completedAt: '2026-02-10', activityClass: 'Ethics & Compliance', verified: true },
  { id: 'cpe2', userId: 'u1', activityName: 'Property Law Updates 2026', accredited: true, hours: 4, completedAt: '2026-01-20', activityClass: 'Professional Knowledge', verified: true },
  { id: 'cpe3', userId: 'u1', activityName: 'HDB Resale Procedures Workshop', accredited: true, hours: 4, completedAt: '2026-03-05', activityClass: 'Professional Knowledge', verified: true },
  { id: 'cpe4', userId: 'u2', activityName: 'AML/CFT Compliance for Estate Agents', accredited: true, hours: 4, completedAt: '2026-01-15', activityClass: 'Ethics & Compliance', verified: true },
  { id: 'cpe5', userId: 'u2', activityName: 'Advanced Property Valuation', accredited: true, hours: 4, completedAt: '2026-02-20', activityClass: 'Professional Knowledge', verified: true },
  { id: 'cpe6', userId: 'u2', activityName: 'Digital Marketing for Agents', accredited: false, hours: 4, completedAt: '2026-03-10', activityClass: 'Business Skills', verified: true },
  { id: 'cpe7', userId: 'u2', activityName: 'CEA Ethics Refresher', accredited: true, hours: 4, completedAt: '2026-03-25', activityClass: 'Ethics & Compliance', verified: true },
  { id: 'cpe8', userId: 'u3', activityName: 'AML/CFT Compliance for Estate Agents', accredited: true, hours: 4, completedAt: '2026-02-10', activityClass: 'Ethics & Compliance', verified: true },
  { id: 'cpe9', userId: 'u3', activityName: 'Condominium Sales Masterclass', accredited: true, hours: 4, completedAt: '2026-03-01', activityClass: 'Professional Knowledge', verified: true },
  { id: 'cpe10', userId: 'u4', activityName: 'AML/CFT Compliance for Estate Agents', accredited: true, hours: 4, completedAt: '2026-03-15', activityClass: 'Ethics & Compliance', verified: true },
  { id: 'cpe11', userId: 'u5', activityName: 'AML/CFT Compliance for Estate Agents', accredited: true, hours: 4, completedAt: '2026-01-20', activityClass: 'Ethics & Compliance', verified: true },
  { id: 'cpe12', userId: 'u5', activityName: 'Commercial Property Transactions', accredited: true, hours: 4, completedAt: '2026-02-15', activityClass: 'Professional Knowledge', verified: true },
  { id: 'cpe13', userId: 'u5', activityName: 'Negotiation Skills for Agents', accredited: false, hours: 2, completedAt: '2026-03-05', activityClass: 'Business Skills', verified: true },
  { id: 'cpe14', userId: 'u5', activityName: 'Property Law Updates 2026', accredited: true, hours: 4, completedAt: '2026-03-20', activityClass: 'Professional Knowledge', verified: true },
];

const demoAlerts: Alert[] = [
  { id: 'a1', type: 'cpe_deadline', priority: 'high', message: 'Priya Nair has only 4/16 CPE hours — 9 months remaining', dueDate: '2026-12-31', entityId: 'u4', entityType: 'user', dismissed: false, createdAt: '2026-04-01' },
  { id: 'a2', type: 'cpe_deadline', priority: 'medium', message: 'Ahmad bin Hassan has 8/16 CPE hours — 9 months remaining', dueDate: '2026-12-31', entityId: 'u3', entityType: 'user', dismissed: false, createdAt: '2026-04-01' },
  { id: 'a3', type: 'general', priority: 'critical', message: 'CDD incomplete for Golden Dragon Pte Ltd — cannot proceed with transaction', entityId: 'c2', entityType: 'client', dismissed: false, createdAt: '2026-03-28' },
  { id: 'a4', type: 'general', priority: 'critical', message: 'Enhanced CDD required for Amir Abdullah (PEP) — designated officer approval needed', entityId: 'c3', entityType: 'client', dismissed: false, createdAt: '2026-03-15' },
  { id: 'a5', type: 'general', priority: 'medium', message: 'Priya Nair — estate agent card not yet issued', entityId: 'u4', entityType: 'user', dismissed: false, createdAt: '2026-03-20' },
  { id: 'a6', type: 'cdd_review', priority: 'medium', message: 'David Chen CDD periodic review due', dueDate: '2026-05-10', entityId: 'c1', entityType: 'client', dismissed: false, createdAt: '2026-04-01' },
  { id: 'a7', type: 'insurance_expiry', priority: 'low', message: 'PI Insurance renewal due', dueDate: '2026-12-31', dismissed: false, createdAt: '2026-04-01' },
];

const demoLicence: Licence = {
  id: 'lic1', licenceNumber: 'L3010001A', grantedAt: '2020-03-15', expiresAt: '2026-12-31',
  insuranceAmount: 300000, insuranceExpiry: '2026-12-31', insuranceProvider: 'AIG Singapore',
  securityAmount: 0, registeredAddress: '1 Raffles Place, #20-01, One Raffles Place, Singapore 048616',
  keoName: 'Tan Wei Ming', keoAppointmentDate: '2020-03-15', repCount: 15,
};

const demoAuditLog: AuditLogEntry[] = [
  { id: 'al1', userId: 'u3', userName: 'Ahmad bin Hassan', action: 'created_client', entityType: 'client', entityId: 'c3', details: 'Created client: Amir Abdullah', timestamp: '2026-03-15T10:30:00Z' },
  { id: 'al2', userId: 'u3', userName: 'Ahmad bin Hassan', action: 'uploaded_document', entityType: 'document', entityId: 'd1', details: 'Uploaded NRIC for David Chen', timestamp: '2025-11-10T09:15:00Z' },
  { id: 'al3', userId: 'u2', userName: 'Sarah Lim', action: 'uploaded_document', entityType: 'document', entityId: 'd4', details: 'Uploaded AML risk assessment', timestamp: '2026-01-15T14:00:00Z' },
  { id: 'al4', userId: 'u1', userName: 'Tan Wei Ming', action: 'completed_transaction', entityType: 'transaction', entityId: 't1', details: 'Completed transaction for David Chen — Marina Bay Residences', timestamp: '2026-01-20T16:30:00Z' },
  { id: 'al5', userId: 'u5', userName: 'Jason Ong', action: 'created_client', entityType: 'client', entityId: 'c2', details: 'Created client: Golden Dragon Pte Ltd', timestamp: '2026-02-01T11:00:00Z' },
];

const demoAdvertisements: Advertisement[] = [
  {
    id: 'ad1', propertyAddress: '10 Bayfront Ave, #12-05, Marina Bay Residences',
    salespersonId: 'u3', salespersonName: 'Ahmad bin Hassan', medium: 'online_portal',
    description: 'PropertyGuru listing — 3BR condo, Marina Bay view, 1,200 sqft',
    clientApproval: true, clientApprovalDate: '2025-12-01',
    vettingStatus: 'published', vettedBy: 'u1', vettedAt: '2025-12-02',
    vettingNotes: 'All identifiers correct. Property description accurate.',
    publishedAt: '2025-12-03', removedAt: '2026-01-20',
    agentNameDisplayed: true, agentContactDisplayed: true, agentLicenceDisplayed: true,
    salespersonNameDisplayed: true, salespersonRegDisplayed: true,
    attachmentName: 'marina-bay-listing.pdf',
    createdAt: '2025-12-01',
  },
  {
    id: 'ad2', propertyAddress: '8 Shenton Way, #25-01',
    salespersonId: 'u5', salespersonName: 'Jason Ong', medium: 'social_media',
    description: 'Instagram post — luxury office space at Shenton Way, premium fittings',
    clientApproval: true, clientApprovalDate: '2026-02-10',
    vettingStatus: 'approved', vettedBy: 'u1', vettedAt: '2026-02-11',
    vettingNotes: 'Approved. Remind salesperson to add licence number to post.',
    agentNameDisplayed: true, agentContactDisplayed: true, agentLicenceDisplayed: true,
    salespersonNameDisplayed: true, salespersonRegDisplayed: false,
    attachmentName: 'shenton-way-ig-post.jpg',
    createdAt: '2026-02-10',
  },
  {
    id: 'ad3', propertyAddress: '55 Newton Road, #08-12, Newton Suites',
    salespersonId: 'u4', salespersonName: 'Priya Nair', medium: 'flyer_brochure',
    description: 'Printed flyer — 2BR Newton Suites, near MRT, $1.5M',
    clientApproval: false,
    vettingStatus: 'pending_vetting',
    agentNameDisplayed: true, agentContactDisplayed: true, agentLicenceDisplayed: true,
    salespersonNameDisplayed: true, salespersonRegDisplayed: true,
    createdAt: '2026-03-28',
  },
  {
    id: 'ad4', propertyAddress: '123 Bukit Timah Road, #03-01',
    salespersonId: 'u3', salespersonName: 'Ahmad bin Hassan', medium: 'newspaper',
    description: 'Straits Times classified — landed property at Bukit Timah for sale',
    clientApproval: true, clientApprovalDate: '2026-03-10',
    vettingStatus: 'rejected', vettedBy: 'u2', vettedAt: '2026-03-12',
    vettingNotes: 'Rejected: claims "best value in district" without substantiation. Remove unverifiable claim per Section 12.4.',
    agentNameDisplayed: true, agentContactDisplayed: true, agentLicenceDisplayed: false,
    salespersonNameDisplayed: true, salespersonRegDisplayed: false,
    attachmentName: 'bukit-timah-classified.pdf',
    createdAt: '2026-03-10',
  },
];

export const useStore = create<AppState>((set) => ({
  currentUser: demoUsers[0],
  users: demoUsers,
  clients: demoClients,
  cddRecords: demoCDDRecords,
  transactions: demoTransactions,
  documents: demoDocuments,
  cpeRecords: demoCPERecords,
  licence: demoLicence,
  advertisements: demoAdvertisements,
  disputes: [],
  alerts: demoAlerts,
  sanctionsScreenings: [],
  strReports: [],
  riskAssessments: [
    { id: 'ra1', scope: 'agency_wide', assessmentDate: '2026-01-15', documentPath: '/docs/agency/aml_risk.pdf', nextReview: '2027-01-15', assessedBy: 'u2', findings: 'Low-medium risk. Main risks: entity clients, foreign nationals.', mitigationMeasures: 'Enhanced CDD for entity clients, PEP screening for all clients.' },
  ],
  auditLog: demoAuditLog,
  complianceScore: { overall: 72, amlCdd: 65, licensing: 85, transactions: 80, documentRetention: 70, cpe: 62 },

  setCurrentUser: (user) => set({ currentUser: user }),
  addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
  updateClient: (id, updates) => set((s) => ({
    clients: s.clients.map((c) => c.id === id ? { ...c, ...updates } : c),
  })),
  addTransaction: (txn) => set((s) => ({ transactions: [...s.transactions, txn] })),
  updateTransaction: (id, updates) => set((s) => ({
    transactions: s.transactions.map((t) => t.id === id ? { ...t, ...updates } : t),
  })),
  addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
  addCPERecord: (record) => set((s) => ({ cpeRecords: [...s.cpeRecords, record] })),
  addAlert: (alert) => set((s) => ({ alerts: [...s.alerts, alert] })),
  dismissAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, dismissed: true } : a),
  })),
  addAuditEntry: (entry) => set((s) => ({ auditLog: [entry, ...s.auditLog] })),
  addCDDRecord: (record) => set((s) => ({ cddRecords: [...s.cddRecords, record] })),
  updateCDDRecord: (id, updates) => set((s) => ({
    cddRecords: s.cddRecords.map((r) => r.id === id ? { ...r, ...updates } : r),
  })),
  addSTRReport: (report) => set((s) => ({ strReports: [...s.strReports, report] })),
  addSanctionsScreening: (screening) => set((s) => ({ sanctionsScreenings: [...s.sanctionsScreenings, screening] })),
  addDispute: (dispute) => set((s) => ({ disputes: [...s.disputes, dispute] })),
  updateDispute: (id, updates) => set((s) => ({
    disputes: s.disputes.map((d) => d.id === id ? { ...d, ...updates } : d),
  })),
  addRiskAssessment: (ra) => set((s) => ({ riskAssessments: [...s.riskAssessments, ra] })),
  updateLicence: (updates) => set((s) => ({
    licence: s.licence ? { ...s.licence, ...updates } : s.licence,
  })),
  addAdvertisement: (ad) => set((s) => ({ advertisements: [...s.advertisements, ad] })),
  updateAdvertisement: (id, updates) => set((s) => ({
    advertisements: s.advertisements.map((a) => a.id === id ? { ...a, ...updates } : a),
  })),
}));
