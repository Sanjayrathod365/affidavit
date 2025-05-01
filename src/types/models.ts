export interface Provider {
  id: string;
  name: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  state: string;
  attentionInfo: string;
  email: string;
  phone: string;
  fax: string;
  hipaaRequired: boolean;
  hipaaSamplePath: string | null;
  brFaxNumber: string;
  mrFaxNumber: string;
  brEmailId: string;
  mrEmailId: string;
  mrPortalLink: string | null;
  mrPortalProviderId: string | null;
  brPortalLink: string | null;
  brPortalProviderId: string | null;
  brMailingAddress: string;
  mrMailingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  dob: Date;
  doi: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Affidavit {
  id: string;
  patientId: string;
  providerId: string;
  content: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
} 