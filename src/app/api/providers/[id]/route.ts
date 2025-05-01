import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/lib/utils/logger';
import { writeFile } from 'fs/promises';
import path from 'path';
import { ensureUploadDir } from '@/lib/utils/ensure-upload-dir';
import { withAuth } from '@/lib/middleware/auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import fs from 'fs/promises';
import { createAuditLog } from '@/lib/services/auditLogService';
import { Provider as PrismaProvider } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface RouteParams {
  params: {
    id: string;
  };
}

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

interface ProviderData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  fax: string | null;
  zipCode: string | null;
  city: string | null;
  state: string | null;
  attentionInfo: string | null;
  hipaaRequired: boolean;
  hipaaSample: string | null;
  usesFax: boolean;
  usesEmail: boolean;
  usesMail: boolean;
  usesSmartPortal: boolean;
  brFaxNumber: string | null;
  mrFaxNumber: string | null;
  brEmailId: string | null;
  mrEmailId: string | null;
  brMailingAddress: string | null;
  mrMailingAddress: string | null;
  brSmartPortal: string | null;
  mrSmartPortal: string | null;
  smartFolder: string | null;
  brSubmissionMethod: string | null;
  mrSubmissionMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
  brAffidavitTemplateId?: string | null;
  mrAffidavitTemplateId?: string | null;
}

// Refactor GET handler
async function handleGetProvider(
  request: NextRequest,
  // Use generic context type matching withAuth
  { params }: { params: { [key: string]: string } }
) {
  try {
    // Auth check handled by withAuth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { id: params.id }, // Access id as before
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        brEmailId: true,
        mrEmailId: true,
        fax: true,
        zipCode: true,
        city: true,
        state: true,
        attentionInfo: true,
        hipaaRequired: true,
        hipaaSample: true,
        brFaxNumber: true,
        mrFaxNumber: true,
        brMailingAddress: true,
        mrMailingAddress: true,
        usesFax: true,
        usesEmail: true,
        usesMail: true,
        usesSmartPortal: true,
        brSmartPortal: true,
        mrSmartPortal: true,
        smartFolder: true,
        brSubmissionMethod: true,
        mrSubmissionMethod: true,
        brAffidavitTemplateId: true,
        mrAffidavitTemplateId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!provider) {
      return NextResponse.json({ data: null, error: 'Provider not found' }, { status: 404 });
    }

    return NextResponse.json({ data: provider, error: null });
  } catch (error) {
    logger.error('Failed to fetch provider', { error });
    return NextResponse.json(
      { data: null, error: 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}

// Refactor PUT handler
async function handleUpdateProvider(
  request: NextRequest,
  { params }: { params: { [key: string]: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const { id } = params;

  try {
    const formData = await request.formData();
    const providerData: Record<string, any> = {};

    // Log all form entries to help with debugging
    logger.info('Provider update - FormData entries:', {
      entries: Array.from(formData.entries()).map(([key, value]) => ({
        key,
        type: typeof value,
        isFile: value instanceof File,
        fileName: value instanceof File ? value.name : null,
        fileSize: value instanceof File ? value.size : null
      }))
    });

    // Fetch the current provider first - needed for file deletion logic
    const currentProvider = await prisma.provider.findUnique({ where: { id } });
    if (!currentProvider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Initialize updatePayload at the top level
    const updatePayload: Partial<ProviderData> = {};

    // Check if this is a request to delete HIPAA sample
    const deleteHipaaSample = formData.get('deleteHipaaSample') === 'true';
    if (deleteHipaaSample && currentProvider.hipaaSample) {
      logger.info('Request to delete HIPAA sample file received', { providerId: id });
      
      // Delete the file
      try {
        const filePath = path.join(process.cwd(), 'public', currentProvider.hipaaSample);
        await fs.unlink(filePath);
        logger.info('HIPAA sample file deleted', { providerId: id, path: filePath });
      } catch (unlinkError: any) {
        if (unlinkError.code !== 'ENOENT') {
          logger.warn('Failed to delete HIPAA sample file', { providerId: id, error: unlinkError });
        }
      }
      
      // Set the hipaaSample field to null in the database
      updatePayload.hipaaSample = null;
      
      // Return early
      const updatedProvider = await prisma.provider.update({
        where: { id: id },
        data: updatePayload,
      });
      
      return NextResponse.json(updatedProvider);
    }

    // Convert FormData entries to an array for compatible iteration
    const formDataEntries = Array.from(formData.entries());

    // Process FormData entries - handle file upload within the loop
    for (const [key, value] of formDataEntries) { // Iterate over the array
      logger.info(`Processing form field: ${key}`, {
        type: typeof value,
        isFile: value instanceof File,
        valueClass: value.constructor.name,
        value: value instanceof File ? `[File: ${value.name}, ${value.size} bytes]` : value
      });
      
      // Special handling for hipaaSample
      if (key === 'hipaaSampleFile') {
        if (value instanceof File && value.size > 0) {
          // --- Handle HIPAA Sample File Upload ---
          const hipaaSampleFile = value; // value is confirmed as File here
          logger.info('Processing HIPAA file upload', { 
            filename: hipaaSampleFile.name, 
            size: hipaaSampleFile.size, 
            type: hipaaSampleFile.type 
          });
          try {
            // Basic validation
            if (hipaaSampleFile.size > 5 * 1024 * 1024) { // 5MB limit
              throw new Error('HIPAA sample file is too large.');
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
            
            logger.info('Preparing to save file', { 
              destinationPath, 
              hipaaSamplePath,
              originalFilename: hipaaSampleFile.name,
              fileSize: hipaaSampleFile.size
            });

            // Save the file
            const fileBuffer = Buffer.from(await hipaaSampleFile.arrayBuffer());
            await writeFile(destinationPath, fileBuffer);
            
            // Verify the file was saved
            try {
              const stats = await fs.stat(destinationPath);
              logger.info('HIPAA sample file saved successfully', { 
                providerId: id, 
                path: hipaaSamplePath,
                fileSize: fileBuffer.length,
                savedSize: stats.size,
                isFile: stats.isFile()
              });
            } catch (statError) {
              logger.error('Failed to verify saved file', { error: statError });
            }
            
            // Set this value directly in updatePayload to ensure it's included in the update
            providerData.hipaaSample = hipaaSamplePath;
            updatePayload.hipaaSample = hipaaSamplePath;
            
            logger.info('Set hipaaSample path in provider data', { 
              path: hipaaSamplePath, 
              inProviderData: providerData.hipaaSample === hipaaSamplePath,
              inUpdatePayload: updatePayload.hipaaSample === hipaaSamplePath
            });

            // Delete old file if it exists
            if (currentProvider.hipaaSample) {
              const oldPath = path.join(process.cwd(), 'public', currentProvider.hipaaSample);
              try {
                await fs.unlink(oldPath);
                logger.info('Old HIPAA sample file deleted', { providerId: id, oldPath });
              } catch (unlinkError: any) {
                if (unlinkError.code !== 'ENOENT') {
                  logger.warn('Could not delete old HIPAA sample file', { providerId: id, oldPath, error: unlinkError });
                }
              }
            }
          } catch (uploadError) {
            logger.error('Failed to update HIPAA sample file', { providerId: id, error: uploadError });
            // Return error immediately if file handling fails
            throw new Error('Failed to process HIPAA sample file upload.'); 
          }
          // --- End File Handling --- 
        } else {
          logger.warn('Invalid file or empty file received for hipaaSampleFile', {
            isFile: value instanceof File,
            size: value instanceof File ? value.size : 'N/A'
          });
        }
      } else if (key === 'brSubmissionMethod' || key === 'mrSubmissionMethod') {
        // Handle submission method enum fields - explicitly cast to string
        if (typeof value === 'string') {
          providerData[key] = value;
          updatePayload[key] = value;
        }
      } else if (key === 'usesFax' || key === 'usesEmail' || key === 'usesMail' || key === 'usesSmartPortal') {
        // Handle boolean fields
        if (typeof value === 'string') {
          const boolValue = value === 'true';
          providerData[key] = boolValue;
          updatePayload[key] = boolValue;
        }
      } else if (key !== 'id' && key !== 'deleteHipaaSample') {
        // Handle other fields (avoid id and deleteHipaaSample)
        if (typeof value === 'string') {
          // Convert boolean strings
          if (key === 'hipaaRequired') {
            providerData[key] = value === 'true';
          } else {
            providerData[key] = value; 
          }
        }
      }
    } // End of loop

    // --- Construct Update Payload Explicitly --- 
    // Map known fields from providerData, applying type conversions/checks
    if (providerData.name !== undefined) updatePayload.name = String(providerData.name);
    if (providerData.email !== undefined) updatePayload.email = String(providerData.email);
    if (providerData.phone !== undefined) updatePayload.phone = String(providerData.phone);
    if (providerData.address !== undefined) updatePayload.address = String(providerData.address);
    if (providerData.fax !== undefined) updatePayload.fax = String(providerData.fax);
    if (providerData.zipCode !== undefined) updatePayload.zipCode = String(providerData.zipCode);
    if (providerData.city !== undefined) updatePayload.city = String(providerData.city);
    if (providerData.state !== undefined) updatePayload.state = String(providerData.state);
    if (providerData.attentionInfo !== undefined) updatePayload.attentionInfo = String(providerData.attentionInfo);
    if (providerData.hipaaRequired !== undefined) updatePayload.hipaaRequired = providerData.hipaaRequired;
    if (providerData.hipaaSample !== undefined) updatePayload.hipaaSample = String(providerData.hipaaSample);
    // Legacy submission method fields
    if (providerData.usesFax !== undefined) updatePayload.usesFax = providerData.usesFax;
    if (providerData.usesEmail !== undefined) updatePayload.usesEmail = providerData.usesEmail;
    if (providerData.usesMail !== undefined) updatePayload.usesMail = providerData.usesMail;
    if (providerData.usesSmartPortal !== undefined) updatePayload.usesSmartPortal = providerData.usesSmartPortal;
    // New submission method fields - handle as enum values, not strings
    if (providerData.brSubmissionMethod !== undefined) {
      // Validate that it's a valid enum value
      const validValues = ['FAX', 'EMAIL', 'MAIL', 'SMART_PORTAL', 'NONE'];
      const submissionMethod = String(providerData.brSubmissionMethod);
      if (validValues.includes(submissionMethod)) {
        updatePayload.brSubmissionMethod = submissionMethod;
        logger.info(`Setting brSubmissionMethod to enum value: ${submissionMethod}`);
      } else {
        logger.warn(`Invalid brSubmissionMethod value: ${submissionMethod}, falling back to NONE`);
        updatePayload.brSubmissionMethod = 'NONE';
      }
    }
    if (providerData.mrSubmissionMethod !== undefined) {
      // Validate that it's a valid enum value
      const validValues = ['FAX', 'EMAIL', 'MAIL', 'SMART_PORTAL', 'NONE'];
      const submissionMethod = String(providerData.mrSubmissionMethod);
      if (validValues.includes(submissionMethod)) {
        updatePayload.mrSubmissionMethod = submissionMethod;
        logger.info(`Setting mrSubmissionMethod to enum value: ${submissionMethod}`);
      } else {
        logger.warn(`Invalid mrSubmissionMethod value: ${submissionMethod}, falling back to NONE`);
        updatePayload.mrSubmissionMethod = 'NONE';
      }
    }
    // Contact fields
    if (providerData.brFaxNumber !== undefined) updatePayload.brFaxNumber = String(providerData.brFaxNumber);
    if (providerData.mrFaxNumber !== undefined) updatePayload.mrFaxNumber = String(providerData.mrFaxNumber);
    if (providerData.brEmailId !== undefined) updatePayload.brEmailId = String(providerData.brEmailId);
    if (providerData.mrEmailId !== undefined) updatePayload.mrEmailId = String(providerData.mrEmailId);
    if (providerData.brMailingAddress !== undefined) updatePayload.brMailingAddress = String(providerData.brMailingAddress);
    if (providerData.mrMailingAddress !== undefined) updatePayload.mrMailingAddress = String(providerData.mrMailingAddress);
    if (providerData.brSmartPortal !== undefined) updatePayload.brSmartPortal = String(providerData.brSmartPortal);
    if (providerData.mrSmartPortal !== undefined) updatePayload.mrSmartPortal = String(providerData.mrSmartPortal);
    if (providerData.smartFolder !== undefined) updatePayload.smartFolder = String(providerData.smartFolder);

    // Add new template ID fields
    if (providerData.brAffidavitTemplateId !== undefined) {
      updatePayload.brAffidavitTemplateId = providerData.brAffidavitTemplateId as string || null;
    }
    if (providerData.mrAffidavitTemplateId !== undefined) {
      updatePayload.mrAffidavitTemplateId = providerData.mrAffidavitTemplateId as string || null;
    }

    // --- Create Audit Log --- 
    if (userId && userEmail) {
      // Recalculate changes based on the final updatePayload
      const changes = Object.keys(updatePayload).reduce((acc: Record<string, any>, key) => {
        // Check if the key exists in currentProvider before comparing
        if (key in currentProvider) {
          const currentValue = (currentProvider as any)[key];
          const newValue = (updatePayload as any)[key];
          
          // Compare with original provider data, handle null/undefined differences
          if (currentValue !== newValue) { 
            acc[key] = { old: currentValue, new: newValue };
          }
        }
        return acc;
      }, {} as Record<string, any>);

      // Only log if there are actual changes
      if (Object.keys(changes).length > 0) {
          await createAuditLog({
              userId,
              userEmail,
              action: AuditActionType.UPDATE_PROVIDER,
              targetEntityType: 'Provider',
              targetEntityId: id,
              details: { providerName: currentProvider.name, changes } 
          });
      }
    }

    // --- Update Provider --- 
    // Only update if there are changes to avoid unnecessary writes
    logger.info('[handleUpdateProvider] Final updatePayload before Prisma update:', updatePayload);
    if (updatePayload.hipaaRequired !== undefined) {
      logger.info('[handleUpdateProvider] Value of hipaaRequired being sent to DB:', updatePayload.hipaaRequired);
    } else {
      logger.info('[handleUpdateProvider] hipaaRequired field is NOT present in the final updatePayload.');
    }
    
    if (updatePayload.hipaaSample !== undefined) {
      logger.info('[handleUpdateProvider] Value of hipaaSample being sent to DB:', updatePayload.hipaaSample);
    }

    if (Object.keys(updatePayload).length > 0) { // Check if updatePayload has keys
        const updatedProvider = await prisma.provider.update({
            where: { id: id },
            data: updatePayload, // Use the explicitly constructed payload
        });
        
        // Return the full provider data, including the potentially updated hipaaSample
        const resultProvider = await prisma.provider.findUnique({ 
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                brEmailId: true,
                mrEmailId: true,
                fax: true,
                zipCode: true,
                city: true,
                state: true,
                attentionInfo: true,
                hipaaRequired: true,
                hipaaSample: true,
                brFaxNumber: true,
                mrFaxNumber: true,
                brMailingAddress: true,
                mrMailingAddress: true,
                usesFax: true,
                usesEmail: true,
                usesMail: true,
                usesSmartPortal: true,
                brSmartPortal: true,
                mrSmartPortal: true,
                smartFolder: true,
                brSubmissionMethod: true,
                mrSubmissionMethod: true,
                brAffidavitTemplateId: true,
                mrAffidavitTemplateId: true,
                createdAt: true,
                updatedAt: true
            }
        });
        
        logger.info('[handleUpdateProvider] Provider updated successfully', { 
            id, 
            hipaaRequired: resultProvider?.hipaaRequired,
            hipaaSample: resultProvider?.hipaaSample 
        });
        
        return NextResponse.json(resultProvider); 
    } else {
        // No changes detected, return current provider data
        logger.info('No changes detected for provider update', { providerId: id });
        return NextResponse.json(currentProvider);
    }

  } catch (error) {
    // Specific error handling for JSON parsing is removed as we use formData
    logger.error('Failed to update provider:', { error, providerId: id }); 
    return NextResponse.json(
      // Provide a more specific error message if possible
      { error: error instanceof Error ? error.message : 'Failed to update provider' }, 
      { status: 500 }
    );
  }
}

// Refactor DELETE handler
const handleDeleteProvider = async (
    req: NextRequest, 
    // Use generic context type matching withAuth
    context: { params: { [key: string]: string } }
) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const { id } = context.params;

  try {
    // Verify provider exists before attempting delete (optional but good practice)
    const providerToDelete = await prisma.provider.findUnique({
      where: { id },
      select: { id: true, name: true } // Select only necessary fields
    });

    if (!providerToDelete) {
      return NextResponse.json({ data: null, error: 'Provider not found' }, { status: 404 });
    }

    // --- Create Audit Log (before delete) --- 
    if (userId && userEmail) { // Only log if user ID and email are identified
        await createAuditLog({
            userId,
            userEmail, // Now guaranteed to be a string
            action: AuditActionType.DELETE_PROVIDER,
            targetEntityType: 'Provider',
            targetEntityId: providerToDelete.id,
            details: { providerName: providerToDelete.name }
        });
    }
    // --- End Audit Log ---

    // Add transaction logic if deleting related data (e.g., patient-provider links)
    await prisma.provider.delete({ where: { id } });
    return NextResponse.json({ data: { message: 'Provider deleted successfully' }, error: null });
  } catch (error) {
    logger.error(`Error deleting provider ${id}:`, { error });
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete provider, it is linked to patients.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete provider' }, { status: 500 });
  }
};

// Export handlers with withAuth
export const GET = withAuth(handleGetProvider); // Default auth needed
export const PUT = withAuth(handleUpdateProvider, ['ADMIN', 'STAFF']); // ADMIN/STAFF needed
export const DELETE = withAuth(handleDeleteProvider, ['ADMIN']); // ADMIN needed 