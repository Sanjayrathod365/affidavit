import { z } from 'zod';

export const AffidavitStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const createAffidavitSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  providerId: z.string().min(1, 'Provider ID is required'),
  templateId: z.string().optional(),
  content: z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    providerName: z.string().min(1, 'Provider name is required'),
    dateRange: z.string().min(1, 'Date range is required'),
    recordTypes: z.array(z.string()).min(1, 'At least one record type is required'),
  }).required(),
});

export const updateAffidavitSchema = z.object({
  id: z.string().min(1, 'Affidavit ID is required'),
  templateId: z.string().optional(),
  content: z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    providerName: z.string().min(1, 'Provider name is required'),
    dateRange: z.string().min(1, 'Date range is required'),
    recordTypes: z.array(z.string()).min(1, 'At least one record type is required'),
  }).optional(),
  status: z.enum([
    'DRAFT',
    'GENERATED',
    'SENT',
    'RECEIVED',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'ERROR',
  ]).optional(),
});

export type CreateAffidavitInput = z.infer<typeof createAffidavitSchema>;
export type UpdateAffidavitInput = z.infer<typeof updateAffidavitSchema>; 