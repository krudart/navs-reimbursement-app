export type UserRole = 'user' | 'admin';

export type RequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export type ReimbursementType = 'medical_consultation' | 'pharmaceutical' | 'lab_tests' | 'hospitalization' | 'dental' | 'other';

export const REIMBURSEMENT_TYPE_LABELS: Record<ReimbursementType, string> = {
  medical_consultation: 'Consulta Médica',
  pharmaceutical: 'Farmacéutico',
  lab_tests: 'Exámenes de Laboratorio',
  hospitalization: 'Hospitalización',
  dental: 'Dental',
  other: 'Otro',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  in_review: 'En Revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

export const STATUS_COLORS: Record<RequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface ReimbursementRequest {
  id: string;
  user_id: string;
  type: ReimbursementType;
  description: string;
  provider_name: string;
  service_date: string;
  amount: number;
  coverage_percentage: number;
  covered_amount: number;
  status: RequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  documents?: Document[];
}

export interface Document {
  id: string;
  request_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}
