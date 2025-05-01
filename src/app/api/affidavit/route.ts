import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handleApiResponse, createApiError, ApiResponse } from '@/lib/utils/api';
import { withAuth } from '@/lib/middleware/auth';
import { validateRequestBody } from '@/lib/middleware/auth';
import { createAffidavitSchema, updateAffidavitSchema } from '@/lib/validations/affidavit';
import logger from '@/lib/utils/logger';
import { AffidavitStatus } from '@/types/affidavit';

// Helper function to fetch patient with all details
async function fetchPatientWithDetails(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      providers: {
        include: {
          provider: true
        }
      }
    }
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  return patient;
}

// Helper function to fetch patients with pagination and filters
async function fetchPatientsWithFilters(params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = search ? {
    OR: [
      { patientName: { contains: search, mode: 'insensitive' } },
      { providers: { some: { provider: { name: { contains: search, mode: 'insensitive' } } } } }
    ]
  } : {};

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      select: {
        id: true,
        patientName: true,
        dateOfBirth: true,
        dateOfInjury: true,
        createdAt: true,
        updatedAt: true,
        providers: {
          select: {
            id: true,
            requestType: true,
            dosStart: true,
            dosEnd: true,
            providerId: true,
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true
              }
            }
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    }),
    prisma.patient.count({ where })
  ]);

  return {
    patients,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

async function handleGetAffidavits(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const patientId = searchParams.get('patientId');

    if (id) {
      const affidavit = await prisma.affidavit.findUnique({
        where: { id },
        select: {
          id: true,
          patientId: true,
          providerId: true,
          templateId: true,
          template: {
            select: {
              id: true,
              name: true,
              description: true,
              version: true
            }
          },
          content: true,
          status: true,
          verificationCode: true,
          createdAt: true,
          updatedAt: true,
          patient: {
            select: {
              id: true,
              patientName: true,
              dateOfBirth: true,
              dateOfInjury: true,
              createdAt: true,
              updatedAt: true,
              providers: {
                select: {
                  id: true,
                  requestType: true,
                  dosStart: true,
                  dosEnd: true,
                  provider: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true,
                      address: true,
                      createdAt: true,
                      updatedAt: true
                    }
                  }
                }
              }
            }
          },
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              createdAt: true,
              updatedAt: true
            }
          },
        },
      });
      
      if (!affidavit) {
        return NextResponse.json(
          { data: null, error: 'Affidavit not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: affidavit, error: null });
    }

    // If patientId is provided, fetch affidavits for that patient
    if (patientId) {
      const affidavits = await prisma.affidavit.findMany({
        where: { patientId },
        select: {
          id: true,
          patientId: true,
          providerId: true,
          content: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          patient: {
            select: {
              id: true,
              patientName: true,
              dateOfBirth: true,
              dateOfInjury: true,
              createdAt: true,
              updatedAt: true,
              providers: {
                select: {
                  id: true,
                  requestType: true,
                  dosStart: true,
                  dosEnd: true,
                  provider: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true,
                      address: true,
                      createdAt: true,
                      updatedAt: true
                    }
                  }
                }
              }
            }
          },
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              createdAt: true,
              updatedAt: true
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ data: affidavits, error: null });
    }

    // --- Fetch all affidavits with related data --- 
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    // Add search/filter/sort logic if needed for affidavits specifically
    // const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    // const where = search ? { ... } : {}; // Example: Add where clause if searching affidavits

    const [allAffidavits, total] = await Promise.all([
      prisma.affidavit.findMany({
        // where, // Add where clause if needed
        skip,
        take: limit,
        select: {
          id: true,
          patientId: true,
          providerId: true,
          templateId: true,
          status: true,
          generatedFilePath: true,
          createdAt: true,
          updatedAt: true,
          patient: { // Include patient relation
            select: {
              id: true,
              patientName: true
            }
          },
          provider: { // Include provider relation
            select: {
              id: true,
              name: true
            }
          },
          template: { // Include template relation (for template name)
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.affidavit.count({ /* where */ }) // Count affidavits
    ]);

    return NextResponse.json({
      data: allAffidavits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      error: null,
    });
    // --- End fetch all affidavits ---

  } catch (error: unknown) {
    logger.error('Error fetching affidavits:', { error }); 
    // Ensure a default status code if ApiError doesn't provide one
    const status = (error as any)?.status || 500;
    const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { data: null, error: message }, 
      { status } 
    );
  }
}

// Add this function to generate a random verification code
function generateVerificationCode(length = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters like 0, O, 1, I
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function handleUpdateAffidavit(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = validateRequestBody(body, updateAffidavitSchema.parse);

    const existingAffidavit = await prisma.affidavit.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        patientId: true,
        providerId: true,
        content: true,
        status: true
      }
    });

    if (!existingAffidavit) {
      return NextResponse.json(
        { data: null, error: 'Affidavit not found' },
        { status: 404 }
      );
    }

    const updatedAffidavit = await prisma.affidavit.update({
      where: { id: data.id },
      data: {
        ...(data.content && { content: JSON.stringify(data.content) }),
        ...(data.status && { status: data.status as AffidavitStatus }),
      },
      select: {
        id: true,
        patientId: true, 
        providerId: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            patientName: true,
            dateOfBirth: true,
            dateOfInjury: true,
            createdAt: true,
            updatedAt: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    return NextResponse.json({ data: updatedAffidavit, error: null });
  } catch (error) {
    logger.error('Failed to update affidavit:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to update affidavit' },
      { status: 500 }
    );
  }
}

async function handleCreateAffidavit(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const data = validateRequestBody(body, createAffidavitSchema.parse);
    
    // Check if the patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });
    
    if (!patient) {
      return NextResponse.json(
        { data: null, error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Check if the provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: data.providerId },
    });
    
    if (!provider) {
      return NextResponse.json(
        { data: null, error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    // Check if template exists if templateId is provided
    if (data.templateId) {
      const template = await prisma.affidavitTemplate.findUnique({
        where: { id: data.templateId },
      });
      
      if (!template) {
        return NextResponse.json(
          { data: null, error: 'Template not found' },
          { status: 404 }
        );
      }
    }
    
    const newAffidavit = await prisma.affidavit.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        templateId: data.templateId || null,
        content: JSON.stringify(data.content),
        status: 'DRAFT',
      },
      select: {
        id: true,
        patientId: true, 
        providerId: true,
        templateId: true,
        template: {
          select: {
            id: true,
            name: true,
            version: true,
          }
        },
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            patientName: true,
            dateOfBirth: true,
            dateOfInjury: true,
            createdAt: true,
            updatedAt: true,
            providers: {
              select: {
                id: true,
                requestType: true,
                dosStart: true,
                dosEnd: true,
                provider: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true
                  }
                }
              }
            }
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
      },
    });

    console.log('Created affidavit:', { id: newAffidavit.id });
    
    return NextResponse.json({ data: newAffidavit, error: null });
  } catch (error) {
    logger.error('Failed to create affidavit:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to create affidavit' },
      { status: 500 }
    );
  }
}

async function handleDeleteAffidavit(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { data: null, error: 'Affidavit ID is required' },
        { status: 400 }
      );
    }

    const existingAffidavit = await prisma.affidavit.findUnique({
      where: { id },
      select: {
        id: true
      }
    });

    if (!existingAffidavit) {
      return NextResponse.json(
        { data: null, error: 'Affidavit not found' },
        { status: 404 }
      );
    }

    await prisma.affidavit.delete({
      where: { id },
    });

    return NextResponse.json({ data: { message: 'Affidavit deleted successfully' }, error: null });
  } catch (error) {
    logger.error('Failed to delete affidavit:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to delete affidavit' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGetAffidavits);
export const PUT = withAuth(handleUpdateAffidavit, ['ADMIN', 'STAFF']);
export const POST = withAuth(handleCreateAffidavit, ['ADMIN', 'STAFF']);
export const DELETE = withAuth(handleDeleteAffidavit, ['ADMIN']); 