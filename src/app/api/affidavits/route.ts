import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth'; // Assuming consistent auth middleware
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path if needed
import logger from '@/lib/utils/logger';
import { z } from 'zod';
import { AffidavitStatus } from '@/types/affidavit'; // Import our custom enum

// GET /api/affidavits - Fetch list of generated affidavits
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add pagination similar to providers?
    const affidavits = await prisma.affidavit.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: { id: true, patientName: true }
        },
        provider: {
          select: { id: true, name: true }
        },
        template: { // Include template info if needed
            select: { id: true, name: true, version: true }
        }
      }
    });

    // Format the response
    const formattedAffidavits = affidavits.map(aff => ({
      id: aff.id,
      patientName: aff.patient.patientName,
      providerName: aff.provider.name,
      templateName: aff.template ? `${aff.template.name} (v${aff.template.version})` : 'N/A',
      status: aff.status,
      generatedFilePath: aff.generatedFilePath,
      createdAt: aff.createdAt.toISOString(),
    }));

    return NextResponse.json({ data: formattedAffidavits, error: null });

  } catch (error) {
    logger.error('Error fetching affidavits:', { error });
    return NextResponse.json(
      { data: null, error: 'Failed to fetch affidavits' },
      { status: 500 }
    );
  }
}

// --- POST /api/affidavits --- Create a new Affidavit Record ---

// Define validation schema for creating an affidavit
const createAffidavitSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  providerId: z.string().min(1, 'Provider ID is required'),
  templateId: z.string().optional().nullable(), // Allow template to be optional initially
  content: z.record(z.any()).optional().nullable(), // Store the initial form content (placeholder data)
});

async function createAffidavitHandler(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = createAffidavitSchema.safeParse(body);

    if (!validationResult.success) {
      logger.warn('Create affidavit validation failed:', { errors: validationResult.error.flatten() });
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { patientId, providerId, templateId, content } = validationResult.data;

    const newAffidavit = await prisma.affidavit.create({
      data: {
        patientId,
        providerId,
        templateId: templateId || null, // Handle optional templateId
        status: AffidavitStatus.DRAFT, // Set initial status to DRAFT
        content: content ? JSON.stringify(content) : JSON.stringify({}), // Store content as JSON string
        generatedFilePath: null, // No file path initially
        // verificationCode can be added later if needed
      },
    });

    logger.info('New affidavit created:', { affidavitId: newAffidavit.id, patientId, providerId });
    return NextResponse.json({ data: newAffidavit, error: null }, { status: 201 }); // 201 Created

  } catch (error) {
    logger.error('Error creating affidavit:', { error });
    return NextResponse.json(
      { data: null, error: 'Failed to create affidavit' },
      { status: 500 }
    );
  }
}

// Assign the handler to the POST method, wrapped with auth
export const POST = withAuth(createAffidavitHandler, ['ADMIN', 'STAFF']);

// TODO: Add PUT/PATCH handler for updating status if needed 