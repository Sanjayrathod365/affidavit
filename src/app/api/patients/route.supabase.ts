import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAuditLog } from '@/lib/services/auditLogService'; // Keep using the audit log service
import { Database } from '@/lib/supabase'; // Import our Database type

// Define the types we're working with (can be moved to a separate types file)
type PatientWithProviders = {
  id: string;
  patientName: string;
  dateOfBirth: string | null;
  dateOfInjury: string | null;
  createdAt: string;
  updatedAt: string;
  providers: {
    linkId: string;
    providerId: string;
    name: string;
    requestType: string;
  }[];
  affidavitTypes?: string;
};

type SinglePatientWithDetails = {
  id: string;
  patientName: string;
  dateOfBirth: string | null;
  dateOfInjury: string | null;
  createdAt: string;
  updatedAt: string;
  affidavits: {
    id: string;
    status: string;
    createdAt: string;
    generatedFilePath: string | null;
    template: {
      id: string;
      name: string;
    } | null;
  }[];
  providers: {
    id: string;
    requestType: string;
    dosStart: string;
    dosEnd: string | null;
    providerId: string;
    providerName: string;
  }[];
};

// Define types for the Supabase query results
type AffidavitWithTemplate = {
  id: string;
  status: string;
  created_at: string;
  generated_file_path: string | null;
  template_id: string | null;
  template: {
    id: string;
    name: string;
  } | null;
};

type PatientProviderWithProvider = {
  id: string;
  patient_id: string;
  request_type: string;
  dos_start: string;
  dos_end: string | null;
  provider: {
    id: string;
    name: string;
  };
};

type AffidavitWithTemplateBasic = {
  id: string;
  patient_id: string;
  template: {
    id: string;
    name: string;
  } | null;
};

// Format request type strings
const formatRequestType = (type: string): string => {
  if (!type) return 'N/A';
  return type
    .split('_') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  try {
    const url = new URL(req.url);
    const patientId = url.searchParams.get('id');

    // First, check if the user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (patientId) {
      // --- Handle fetching a single patient with details ---
      
      // 1. Get the patient data
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (patientError) {
        return NextResponse.json({ data: null, error: 'Patient not found' }, { status: 404 });
      }

      // 2. Get all affidavits for this patient
      const { data: affidavits, error: affidavitsError } = await supabase
        .from('affidavits')
        .select(`
          id, 
          status, 
          created_at,
          generated_file_path,
          template_id,
          template:affidavit_templates(id, name)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      // 3. Get all patient-provider relationships with provider details
      const { data: patientProviders, error: providersError } = await supabase
        .from('patient_providers')
        .select(`
          id,
          request_type,
          dos_start,
          dos_end,
          provider:providers(id, name)
        `)
        .eq('patient_id', patientId);

      // Format the response data
      const formattedPatient: SinglePatientWithDetails = {
        id: patient.id,
        patientName: patient.patient_name,
        dateOfBirth: patient.date_of_birth,
        dateOfInjury: patient.date_of_injury,
        createdAt: patient.created_at,
        updatedAt: patient.updated_at,
        affidavits: (affidavits || []).map((aff) => ({
          id: aff.id,
          status: aff.status,
          createdAt: aff.created_at,
          generatedFilePath: aff.generated_file_path,
          template: aff.template ? {
            id: aff.template.id,
            name: aff.template.name
          } : null
        })),
        providers: (patientProviders || []).map((p) => ({
          id: p.id,
          requestType: p.request_type,
          dosStart: p.dos_start,
          dosEnd: p.dos_end,
          providerId: p.provider.id,
          providerName: p.provider.name
        }))
      };

      return NextResponse.json({ data: formattedPatient, error: null });
    } else {
      // --- Handle fetching all patients with pagination ---
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
      const startRow = (page - 1) * pageSize;
      const endRow = startRow + pageSize - 1;
      
      // 1. Get paginated patients
      const { data: patients, error: patientsError, count } = await supabase
        .from('patients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(startRow, endRow);
      
      if (patientsError) {
        return NextResponse.json({ 
          error: `Error fetching patients: ${patientsError.message}` 
        }, { status: 500 });
      }

      if (!patients || patients.length === 0) {
        return NextResponse.json({ 
          data: [], 
          pagination: {
            page,
            pageSize,
            totalItems: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
          },
          error: null 
        });
      }

      // 2. For each patient, get their providers
      const patientIds = patients.map(p => p.id);
      
      // 3. Get all patient-provider relationships for these patients
      const { data: patientProviders, error: providersError } = await supabase
        .from('patient_providers')
        .select(`
          id,
          patient_id,
          request_type,
          provider:providers(id, name)
        `)
        .in('patient_id', patientIds);

      // 4. Get all affidavits with templates for these patients
      const { data: affidavits, error: affidavitsError } = await supabase
        .from('affidavits')
        .select(`
          id, 
          patient_id,
          template:affidavit_templates(id, name)
        `)
        .in('patient_id', patientIds);

      // Format the response
      const formattedPatients: PatientWithProviders[] = patients.map(patient => {
        // Get providers for this patient
        const providers = (patientProviders || [])
          .filter(p => p.patient_id === patient.id)
          .map(p => ({
            linkId: p.id,
            providerId: p.provider?.id || '',
            name: p.provider?.name || '',
            requestType: formatRequestType(p.request_type)
          }));
        
        // Get affidavit template names
        const affidavitTypes = (affidavits || [])
          .filter(a => a.patient_id === patient.id)
          .map(a => a.template?.name || 'Unknown')
          .filter(Boolean)
          .join(', ') || 'N/A';

        return {
          id: patient.id,
          patientName: patient.patient_name,
          dateOfBirth: patient.date_of_birth,
          dateOfInjury: patient.date_of_injury,
          createdAt: patient.created_at,
          updatedAt: patient.updated_at,
          providers,
          affidavitTypes
        };
      });

      return NextResponse.json({ 
        data: formattedPatients, 
        pagination: {
          page,
          pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
        error: null 
      });
    }

  } catch (error) {
    console.error('Error in patients API:', error);
    return NextResponse.json({ 
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body
    const json = await req.json();
    const { patientName, dateOfBirth, dateOfInjury } = json;

    // Validate required fields
    if (!patientName) {
      return NextResponse.json({ error: 'Patient name is required' }, { status: 400 });
    }

    // Insert the new patient
    const { data: patient, error } = await supabase
      .from('patients')
      .insert({
        patient_name: patientName,
        date_of_birth: dateOfBirth || null,
        date_of_injury: dateOfInjury || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating patient:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    // Create audit log entry
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'CREATE_PATIENT',
      targetEntityType: 'Patient',
      targetEntityId: patient.id,
      details: { patientName }
    });

    return NextResponse.json({ data: patient, error: null });

  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ 
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body
    const json = await req.json();
    const { id, patientName, dateOfBirth, dateOfInjury } = json;

    // Validate required fields
    if (!id || !patientName) {
      return NextResponse.json({ error: 'Patient ID and name are required' }, { status: 400 });
    }

    // Update the patient
    const { data: patient, error } = await supabase
      .from('patients')
      .update({
        patient_name: patientName,
        date_of_birth: dateOfBirth || null,
        date_of_injury: dateOfInjury || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating patient:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    // Create audit log entry
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'UPDATE_PATIENT',
      targetEntityType: 'Patient',
      targetEntityId: id,
      details: { patientName, dateOfBirth, dateOfInjury }
    });

    return NextResponse.json({ data: patient, error: null });

  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ 
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Get patient details for the audit log
    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('patient_name')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching patient:', fetchError);
      return NextResponse.json({ error: `Database error: ${fetchError.message}` }, { status: 500 });
    }

    // Delete the patient
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting patient:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    // Create audit log entry
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'DELETE_PATIENT',
      targetEntityType: 'Patient',
      targetEntityId: id,
      details: { patientName: patient?.patient_name || 'Unknown' }
    });

    return NextResponse.json({ success: true, error: null });

  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ 
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
} 