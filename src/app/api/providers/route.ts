import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { withAuth } from '@/lib/middleware/auth';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Provider } from '@prisma/client';
import { ensureUploadDir } from '@/lib/utils/ensure-upload-dir';
import { writeFile } from 'fs/promises';
import logger from '@/lib/utils/logger';
import { createAuditLog } from '@/lib/services/auditLogService';
// import { AuditActionType } from '@prisma/client'; // Remove

// Define enum locally
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

type Context = {
  params: { [key: string]: string };
};

type RouteHandler = (
  request: NextRequest,
  context: Context
) => Promise<NextResponse>;

// Refactor GET handler
async function handleGetProviders(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch providers for the current page
    const providers = await prisma.provider.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination calculation
    const totalProviders = await prisma.provider.count();

    return NextResponse.json({
      data: providers,
      pagination: {
        page,
        pageSize,
        totalItems: totalProviders,
        totalPages: Math.ceil(totalProviders / pageSize),
      },
      error: null
    });
  } catch (error) {
    logger.error('Error fetching providers:', { error });
    return NextResponse.json(
      { data: null, pagination: null, error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

// Refactor POST handler
async function handleCreateProvider(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions); // Get session early
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  try {
    const formData = await req.formData();
    
    // Extract all expected fields from formData
    const name = formData.get('name') as string;
    const streetAddress = formData.get('streetAddress') as string | null;
    const zipCode = formData.get('zipCode') as string | null;
    const city = formData.get('city') as string | null;
    const state = formData.get('state') as string | null;
    const attentionInfo = formData.get('attentionInfo') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const fax = formData.get('fax') as string | null;
    const hipaaRequired = formData.get('hipaaRequired') === 'true'; // Convert string 'true'/'false' to boolean
    // Legacy submission method fields
    const usesFax = formData.get('usesFax') === 'true';
    const usesEmail = formData.get('usesEmail') === 'true';
    const usesMail = formData.get('usesMail') === 'true';
    const usesSmartPortal = formData.get('usesSmartPortal') === 'true';
    // New submission method fields
    const brSubmissionMethod = formData.get('brSubmissionMethod') as string | null;
    const mrSubmissionMethod = formData.get('mrSubmissionMethod') as string | null;
    // Contact details
    const brFaxNumber = formData.get('brFaxNumber') as string | null;
    const mrFaxNumber = formData.get('mrFaxNumber') as string | null;
    const brMailingAddress = formData.get('brMailingAddress') as string | null;
    const mrMailingAddress = formData.get('mrMailingAddress') as string | null;
    const brEmailId = formData.get('brEmailId') as string | null;
    const mrEmailId = formData.get('mrEmailId') as string | null;
    const brSmartPortal = formData.get('brSmartPortal') as string | null;
    const mrSmartPortal = formData.get('mrSmartPortal') as string | null;
    const smartFolder = formData.get('smartFolder') as string | null;
    const hipaaSampleFile = formData.get('hipaaSampleFile') as File | null;
    // Template IDs
    const brAffidavitTemplateId = formData.get('brAffidavitTemplateId') as string | null;
    const mrAffidavitTemplateId = formData.get('mrAffidavitTemplateId') as string | null;

    if (!name) {
      return NextResponse.json(
        { data: null, error: 'Provider name is required' },
        { status: 400 }
      );
    }

    // Construct provider data object, only including fields that have values
    const providerData: any = { 
      name, 
      hipaaRequired,
      // Include both legacy and new submission method fields
      usesFax,
      usesEmail,
      usesMail,
      usesSmartPortal,
      brSubmissionMethod,
      mrSubmissionMethod
    }; // Start with required/defaulted fields
    
    // Handle contact details based on submission methods
    if (streetAddress) providerData.address = streetAddress; // Map streetAddress to address field
    if (zipCode) providerData.zipCode = zipCode;
    if (city) providerData.city = city;
    if (state) providerData.state = state;
    if (attentionInfo) providerData.attentionInfo = attentionInfo;
    if (email) providerData.email = email;
    if (phone) providerData.phone = phone;
    if (fax) providerData.fax = fax;
    
    // Add contact details based on submission methods
    if (brFaxNumber) providerData.brFaxNumber = brFaxNumber;
    if (mrFaxNumber) providerData.mrFaxNumber = mrFaxNumber;
    if (brMailingAddress) providerData.brMailingAddress = brMailingAddress;
    if (mrMailingAddress) providerData.mrMailingAddress = mrMailingAddress;
    if (brEmailId) providerData.brEmailId = brEmailId;
    if (mrEmailId) providerData.mrEmailId = mrEmailId;
    if (brSmartPortal) providerData.brSmartPortal = brSmartPortal;
    if (mrSmartPortal) providerData.mrSmartPortal = mrSmartPortal;
    if (smartFolder) providerData.smartFolder = smartFolder;

    // Add Template IDs to data (set to null if empty string)
    providerData.brAffidavitTemplateId = brAffidavitTemplateId || null;
    providerData.mrAffidavitTemplateId = mrAffidavitTemplateId || null;

    // Handle file upload if exists
    if (hipaaSampleFile && hipaaSampleFile.size > 0) {
      try {
        // Basic validation
        if (hipaaSampleFile.size > 5 * 1024 * 1024) { // 5MB limit
          return NextResponse.json({ error: 'HIPAA sample file is too large.' }, { status: 400 });
        }

        // Ensure upload directory exists
        const uploadDir = await ensureUploadDir('hipaa');
        logger.info('Upload directory created/verified', { uploadDir });

        // Create a unique filename with original extension
        const originalExt = path.extname(hipaaSampleFile.name).toLowerCase();
        const fileExtension = ['.pdf', '.doc', '.docx'].includes(originalExt) ? originalExt : '.pdf';
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const destinationPath = path.join(uploadDir, uniqueFilename);
        const hipaaSamplePath = `/uploads/hipaa/${uniqueFilename}`; // Relative path for DB/URL

        // Save the file
        const fileBuffer = Buffer.from(await hipaaSampleFile.arrayBuffer());
        await writeFile(destinationPath, fileBuffer);
        
        // Verify the file was saved
        try {
          const stats = await fs.stat(destinationPath);
          logger.info('HIPAA sample file saved successfully', { 
            path: hipaaSamplePath,
            fileSize: fileBuffer.length,
            savedSize: stats.size,
            isFile: stats.isFile()
          });
        } catch (statError) {
          logger.error('Failed to verify saved file', { error: statError });
        }

        // Store the path in the database
        providerData.hipaaSample = hipaaSamplePath;
        logger.info(`HIPAA sample file saved at: ${hipaaSamplePath}`);
      } catch (fileError) {
        logger.error('Error handling HIPAA file upload:', fileError);
        return NextResponse.json(
          { error: 'Failed to process HIPAA sample file.' },
          { status: 500 }
        );
      }
    }

    const provider = await prisma.provider.create({
      data: providerData,
    });

    // --- Create Audit Log --- 
    if (userId) { // Only log if user is identified
        await createAuditLog({
            userId,
            userEmail,
            action: AuditActionType.CREATE_PROVIDER,
            targetEntityType: 'Provider',
            targetEntityId: provider.id,
            details: { providerName: provider.name } 
        });
    }
    // --- End Audit Log ---

    return NextResponse.json({ data: provider, error: null }, { status: 201 });
  } catch (error) {
    logger.error('Error creating provider:', { error }); // Keep using logger
    // Add more specific error details if possible, e.g., validation errors from Prisma
    const errorMessage = error instanceof Error ? error.message : 'Failed to create provider';
    return NextResponse.json(
      { data: null, error: errorMessage },
      { status: 500 }
    );
  }
}

// Export handlers with withAuth
export const GET = withAuth(handleGetProviders); // Default auth needed
export const POST = withAuth(handleCreateProvider, ['ADMIN', 'STAFF']); // ADMIN/STAFF needed 