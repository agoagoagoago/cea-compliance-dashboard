export type UserRole = 'admin' | 'compliance_officer' | 'salesperson';

export type RiskLevel = 'low' | 'medium' | 'high';

export type CDDStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

export type TransactionType = 'sale' | 'sub_sale' | 'resale' | 'lease' | 'sub_lease';

export type ClientRole = 'purchaser' | 'vendor' | 'landlord' | 'tenant' | 'sub_tenant';

export type PropertyType = 'condominium' | 'apartment' | 'executive_condominium' | 'landed' | 'strata_landed' | 'hdb_flat';

export type DisputeStage = 'pending' | 'mediation' | 'arbitration' | 'resolved' | 'withdrawn';

export type DocumentCategory =
  | 'cdd'
  | 'training'
  | 'investigation'
  | 'risk_assessment'
  | 'compliance_audit'
  | 'estate_agency_agreement'
  | 'insurance'
  | 'cpe'
  | 'other';

export type AlertType = 'licence_expiry' | 'registration_expiry' | 'insurance_expiry' | 'cpe_deadline' | 'cdd_review' | 'document_retention' | 'dispute_deadline' | 'general';

export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationNumber?: string;
  licenceNumber?: string;
  status: 'active' | 'suspended' | 'expired';
  agentCardIssued: boolean;
  joinDate: string;
  registrationExpiry?: string;
  qualifications: string;
  cpeHoursCompleted: number;
  cpeHoursRequired: number;
}

export interface Client {
  id: string;
  name: string;
  type: 'individual' | 'entity';
  riskLevel: RiskLevel;
  pepStatus: boolean;
  cddCompleted: boolean;
  createdAt: string;
  assignedTo: string;
  nationality?: string;
  idNumber?: string;
  dateOfBirth?: string;
  occupation?: string;
  actingOnBehalf: boolean;
  entityDetails?: {
    legalForm: string;
    registeredAddress: string;
    principalBusinessAddress: string;
    beneficialOwners: string[];
  };
}

export interface CDDRecord {
  id: string;
  clientId: string;
  userId: string;
  checkType: string;
  status: CDDStatus;
  completedAt?: string;
  nextReview?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  userId: string;
  clientRole: ClientRole;
  transactionType: TransactionType;
  propertyType: PropertyType;
  propertyAddress: string;
  location: string;
  hdbTown?: string;
  uraDistrict?: string;
  completedAt?: string;
  reportedToCea: boolean;
  ceaReportDate?: string;
  ceaReportRef?: string;
  licenceNumber: string;
  salespersonRegNumbers: string[];
  agreementForm?: string;
  agreementStartDate?: string;
  agreementEndDate?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Document {
  id: string;
  entityType: 'client' | 'user' | 'transaction' | 'agency';
  entityId: string;
  category: DocumentCategory;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  uploadedBy: string;
  retentionExpiry: string;
  description?: string;
}

export interface CPERecord {
  id: string;
  userId: string;
  activityName: string;
  accredited: boolean;
  hours: number;
  completedAt: string;
  certificatePath?: string;
  activityClass?: string;
  verified: boolean;
}

export interface Licence {
  id: string;
  licenceNumber: string;
  grantedAt: string;
  expiresAt: string;
  insuranceAmount: number;
  insuranceExpiry: string;
  insuranceProvider?: string;
  securityAmount?: number;
  registeredAddress: string;
  keoName: string;
  keoAppointmentDate: string;
  repCount: number;
}

export interface Dispute {
  id: string;
  clientId: string;
  clientName: string;
  transactionId?: string;
  stage: DisputeStage;
  mediationCentre?: 'CASE' | 'SISV' | 'SMC';
  arbitrationCentre?: 'SIArb' | 'SISV';
  startedAt: string;
  mediationDeadline?: string;
  arbitrationDeadline?: string;
  salespersonId: string;
  notes?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  message: string;
  dueDate?: string;
  entityType?: string;
  entityId?: string;
  dismissed: boolean;
  createdAt: string;
}

export interface SanctionsScreening {
  id: string;
  clientId: string;
  screenedBy: string;
  result: 'clear' | 'match' | 'potential_match';
  screenedAt: string;
  lists: string[];
  notes?: string;
}

export interface STRReport {
  id: string;
  clientId: string;
  clientName: string;
  filedBy: string;
  reason: string;
  filedAt: string;
  stroReference?: string;
  status: 'draft' | 'filed' | 'acknowledged';
}

export interface RiskAssessment {
  id: string;
  scope: 'agency_wide' | 'transaction' | 'new_technology';
  assessmentDate: string;
  documentPath?: string;
  nextReview: string;
  assessedBy: string;
  findings?: string;
  mitigationMeasures?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface ComplianceScore {
  overall: number;
  amlCdd: number;
  licensing: number;
  transactions: number;
  documentRetention: number;
  cpe: number;
}
