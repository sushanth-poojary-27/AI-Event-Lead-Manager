export type FollowUpStatus =
  | "PENDING"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "CLOSED";

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  event: string;
  notes: string;
  followUpStatus: FollowUpStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  event: string;
  notes: string;
  followUpStatus: FollowUpStatus;
}

export interface LeadFilterState {
  search: string;
  status: string;
  event: string;
}