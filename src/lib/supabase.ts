import { createClient } from '@supabase/supabase-js';

// Supabase client setup
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define database types based on the current schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          emailVerified: string | null;
          image: string | null;
          password: string | null;
          role: 'ADMIN' | 'STAFF' | 'SUPERVISOR';
          createdAt: string;
          updatedAt: string;
        };
      };
      patients: {
        Row: {
          id: string;
          patientName: string;
          dateOfBirth: string | null;
          dateOfInjury: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      providers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          brEmailId: string | null;
          mrEmailId: string | null;
          phone: string | null;
          fax: string | null;
          address: string | null;
          zipCode: string | null;
          city: string | null;
          state: string | null;
          attentionInfo: string | null;
          hipaaRequired: boolean;
          hipaaSample: string | null;
          brFaxNumber: string | null;
          mrFaxNumber: string | null;
          brMailingAddress: string | null;
          mrMailingAddress: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      patient_providers: {
        Row: {
          id: string;
          patientId: string;
          providerId: string;
          requestType: string;
          dosStart: string;
          dosEnd: string | null;
          dosType: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      affidavit_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          filePath: string | null;
          structure: any;
          version: number;
          isActive: boolean;
          logoPath: string | null;
          fontFamily: string | null;
          fontSize: number | null;
          createdAt: string;
          updatedAt: string;
          userId: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          timestamp: string;
          userId: string | null;
          userEmail: string | null;
          action: string;
          targetEntityType: string | null;
          targetEntityId: string | null;
          details: any | null;
        };
      };
      affidavits: {
        Row: {
          id: string;
          patientId: string;
          providerId: string;
          content: string;
          status: 'DRAFT' | 'GENERATED' | 'SENT' | 'RECEIVED' | 'ERROR';
          verificationCode: string | null;
          generatedFilePath: string | null;
          templateId: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
}; 