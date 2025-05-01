import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createAuditLog } from '@/lib/services/auditLogService';
// import { AuditActionType } from '@prisma/client'; // Remove problematic import

// Define enum locally as a workaround for type resolution issues
enum AuditActionType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  CREATE_PATIENT = 'CREATE_PATIENT',
  UPDATE_PATIENT = 'UPDATE_PATIENT',
  DELETE_PATIENT = 'DELETE_PATIENT',
  CREATE_PROVIDER = 'CREATE_PROVIDER',
  UPDATE_PROVIDER = 'UPDATE_PROVIDER',
  DELETE_PROVIDER = 'DELETE_PROVIDER',
  CREATE_TEMPLATE = 'CREATE_TEMPLATE',
  UPDATE_TEMPLATE = 'UPDATE_TEMPLATE',
  DELETE_TEMPLATE = 'DELETE_TEMPLATE',
  GENERATE_AFFIDAVIT = 'GENERATE_AFFIDAVIT',
  UPDATE_AFFIDAVIT_STATUS = 'UPDATE_AFFIDAVIT_STATUS',
  DELETE_AFFIDAVIT = 'DELETE_AFFIDAVIT'
}

// Helper function to format request type strings (copied from PatientList)
const formatRequestType = (type: string): string => {
  if (!type) return 'N/A';
  return type
    .split('_') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

type Context = {
  params: { [key: string]: string };
};

type RouteHandler = (
  request: NextRequest,
  context: Context
) => Promise<NextResponse>;

// Define the specific type returned by the GET query based on structure
type PatientWithProviderInfo = {
  id: string;
  patientName: string;
  dateOfBirth: Date | null;
  dateOfInjury: Date | null;
  createdAt: Date;
  updatedAt: Date;
  providers: {
    id: string;
    requestType: string;
    providerId: string;
    provider: {
      id: string;
      name: string;
      // Add other selected provider fields here if needed
    };
  }[];
};

// Define the type for the selected affidavit structure
type AffidavitWithTemplate = {
  id: string;
  status: string;
  createdAt: Date;
  generatedFilePath: string | null;
  template: {
    id: string;
    name: string;
  } | null;
};

// Define the type for a single patient with affidavits and template info
type SinglePatientWithAffidavits = {
  id: string;
  patientName: string;
  dateOfBirth: Date | null;
  dateOfInjury: Date | null;
  createdAt: Date;
  updatedAt: Date;
  affidavits: AffidavitWithTemplate[];
  // Include providers if needed on detail page, otherwise omit for simplicity
  providers?: {
    id: string;
    requestType: string;
    provider: {
      id: string;
      name: string;
    };
  }[];
};

// Refactor GET handler
async function handleGetPatients(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const patientId = url.searchParams.get('id');

    if (patientId) {
      // --- Handle fetching a single patient --- 
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          affidavits: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              generatedFilePath: true,
              template: {
                select: {
                  id: true,
                  name: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          providers: { 
            select: {
              id: true,
              requestType: true,
              dosStart: true,
              dosEnd: true,
              provider: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!patient) {
        return NextResponse.json({ data: null, error: 'Patient not found' }, { status: 404 });
      }

      // Format single patient data (including providers)
      const formattedPatient = {
        ...patient,
        dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
        dateOfInjury: patient.dateOfInjury?.toISOString() ?? null,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
        affidavits: patient.affidavits.map((aff: any) => ({
          ...aff,
          createdAt: aff.createdAt.toISOString(),
        })),
        providers: patient.providers?.map((p: any) => ({
          id: p.id,
          requestType: p.requestType,
          dosStart: p.dosStart.toISOString(),
          dosEnd: p.dosEnd?.toISOString() ?? null,
          providerId: p.provider.id,
          providerName: p.provider.name
        })) || []
      };

      return NextResponse.json({ data: formattedPatient, error: null });

    } else {
      // --- Handle fetching all patients with PAGINATION --- 
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      
      // Query Patients again
      const patients = await prisma.patient.findMany({
        skip,
        take,
        include: {
          providers: { // Include providers relation
            select: {
              id: true, // Include link ID if needed later
              requestType: true,
              provider: { // Include provider details
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          affidavits: { // Include affidavits relation
            select: {
              id: true,
              status: true,
              template: { // Include template details within affidavit
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' } 
      });

      // Use patient count again
      const totalPatients = await prisma.patient.count();

      // Map the results back to Patient structure with detailed providers array
      const formattedPatients = patients.map((patient) => {
          // Keep the detailed provider information including requestType
          const providersList = patient.providers?.map((p) => ({
              linkId: p.id, // ID of the PatientProvider record
              providerId: p.provider.id,
              name: p.provider.name,
              requestType: p.requestType, // Include the request type
          })) || [];
          
          // Map affidavit template names to a string
          const affidavitTypes = patient.affidavits?.map(aff => aff.template?.name || 'Unknown').filter(Boolean).join(', ') || 'N/A';

          return {
              id: patient.id,
              patientName: patient.patientName,
              dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
              dateOfInjury: patient.dateOfInjury?.toISOString() ?? null,
              createdAt: patient.createdAt.toISOString(),
              updatedAt: patient.updatedAt.toISOString(),
              providers: providersList, // Use the detailed list
              affidavitTypes: affidavitTypes, 
          }
      });

      return NextResponse.json({ 
          data: formattedPatients, 
          pagination: {
            page,
            pageSize,
            totalItems: totalPatients, // Use total patients
            totalPages: Math.ceil(totalPatients / pageSize),
          },
          error: null 
      });
    }

  } catch (error) {
    console.error('Error fetching patients API:', error);
    const patientId = req.nextUrl.searchParams.get('id');
    const contextMessage = patientId ? `(fetching ID: ${patientId})` : '(fetching all)';
    return NextResponse.json(
      { data: null, error: `Failed to fetch patients ${contextMessage}` },
      { status: 500 }
    );
  }
}

// Refactor POST handler
async function handleCreatePatient(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  try {
    const { patientName, dateOfBirth, dateOfInjury } = await req.json();

    if (!patientName) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const patientData: any = { patientName };
    if (dateOfBirth) patientData.dateOfBirth = new Date(dateOfBirth);
    if (dateOfInjury) patientData.dateOfInjury = new Date(dateOfInjury);

    const patient = await prisma.patient.create({
      data: patientData
    });

    // --- Create Audit Log --- 
    if (userId) {
        await createAuditLog({
            userId,
            userEmail,
            action: AuditActionType.CREATE_PATIENT,
            targetEntityType: 'Patient',
            targetEntityId: patient.id,
            details: { patientName: patient.patientName } 
        });
    }
    // --- End Audit Log ---

    return NextResponse.json({ 
      data: {
        ...patient,
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.toISOString() : null,
        dateOfInjury: patient.dateOfInjury ? patient.dateOfInjury.toISOString() : null,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString()
      }, 
      error: null 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}

// Export handlers with withAuth
export const GET = withAuth(handleGetPatients); // Default auth needed
export const POST = withAuth(handleCreatePatient, ['ADMIN', 'STAFF']); // ADMIN/STAFF needed 