-- Create enum types
CREATE TYPE public.role_type AS ENUM ('ADMIN', 'STAFF', 'SUPERVISOR');
CREATE TYPE public.affidavit_status AS ENUM ('DRAFT', 'GENERATED', 'SENT', 'RECEIVED', 'ERROR');
CREATE TYPE public.audit_action_type AS ENUM (
  'LOGIN_SUCCESS', 'LOGIN_FAILURE',
  'CREATE_PATIENT', 'UPDATE_PATIENT', 'DELETE_PATIENT',
  'CREATE_PROVIDER', 'UPDATE_PROVIDER', 'DELETE_PROVIDER',
  'CREATE_TEMPLATE', 'UPDATE_TEMPLATE', 'DELETE_TEMPLATE',
  'GENERATE_AFFIDAVIT', 'UPDATE_AFFIDAVIT_STATUS', 'DELETE_AFFIDAVIT',
  'SEND_REQUEST'
);

-- Create tables

-- Users table (storing custom user profile data)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMP WITH TIME ZONE,
  image TEXT,
  password TEXT,
  role role_type NOT NULL DEFAULT 'STAFF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Patient table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  date_of_birth TIMESTAMP WITH TIME ZONE,
  date_of_injury TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Provider table
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  br_email_id TEXT,
  mr_email_id TEXT,
  phone TEXT,
  fax TEXT,
  address TEXT,
  zip_code TEXT,
  city TEXT,
  state TEXT,
  attention_info TEXT,
  hipaa_required BOOLEAN NOT NULL DEFAULT FALSE,
  hipaa_sample TEXT,
  br_fax_number TEXT,
  mr_fax_number TEXT,
  br_mailing_address TEXT,
  mr_mailing_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Patient-Provider junction table
CREATE TABLE public.patient_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  dos_start TIMESTAMP WITH TIME ZONE NOT NULL,
  dos_end TIMESTAMP WITH TIME ZONE,
  dos_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Affidavit template table
CREATE TABLE public.affidavit_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  structure JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  logo_path TEXT,
  font_family TEXT DEFAULT 'Arial',
  font_size INTEGER DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);

-- Audit log table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action audit_action_type NOT NULL,
  target_entity_type TEXT,
  target_entity_id TEXT,
  details JSONB
);

-- Affidavit table
CREATE TABLE public.affidavits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status affidavit_status NOT NULL DEFAULT 'DRAFT',
  verification_code TEXT,
  generated_file_path TEXT,
  template_id UUID REFERENCES public.affidavit_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_patient_providers_patient_id ON public.patient_providers(patient_id);
CREATE INDEX idx_patient_providers_provider_id ON public.patient_providers(provider_id);
CREATE INDEX idx_affidavits_patient_id ON public.affidavits(patient_id);
CREATE INDEX idx_affidavits_provider_id ON public.affidavits(provider_id);
CREATE INDEX idx_affidavit_templates_user_id ON public.affidavit_templates(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);

-- Storage bucket for PDFs and other uploads
-- Note: This is handled through Supabase dashboard or CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('affidavits', 'affidavits', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('templates', 'templates', false);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affidavit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affidavits ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Patient policies
CREATE POLICY "All authenticated users can view patients" ON public.patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patients" ON public.patients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" ON public.patients
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Provider policies
CREATE POLICY "All authenticated users can view providers" ON public.providers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert providers" ON public.providers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update providers" ON public.providers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Patient-Provider policies
CREATE POLICY "All authenticated users can view patient_providers" ON public.patient_providers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patient_providers" ON public.patient_providers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patient_providers" ON public.patient_providers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Affidavit template policies
CREATE POLICY "All authenticated users can view affidavit_templates" ON public.affidavit_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert their templates" ON public.affidavit_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON public.affidavit_templates
  FOR UPDATE USING (auth.uid() = user_id);

-- Audit log policies
CREATE POLICY "All authenticated users can view audit_logs" ON public.audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert audit_logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Affidavit policies
CREATE POLICY "All authenticated users can view affidavits" ON public.affidavits
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert affidavits" ON public.affidavits
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update affidavits" ON public.affidavits
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create triggers for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();

CREATE TRIGGER update_patients_timestamp
BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();

CREATE TRIGGER update_providers_timestamp
BEFORE UPDATE ON public.providers
FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();

CREATE TRIGGER update_patient_providers_timestamp
BEFORE UPDATE ON public.patient_providers
FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();

CREATE TRIGGER update_affidavit_templates_timestamp
BEFORE UPDATE ON public.affidavit_templates
FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();

CREATE TRIGGER update_affidavits_timestamp
BEFORE UPDATE ON public.affidavits
FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp(); 