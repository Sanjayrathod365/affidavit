import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { withAuth } from '@/lib/middleware/auth';
import { createAuditLog } from '@/lib/services/auditLogService';

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

// GET /api/patients/[id] - Get a specific patient
async function handleGetPatient(
  request: NextRequest,
  context: { params: { [key: string]: string } }
) {
  try {
    const { id } = context.params;
    const patient = await prisma.patient.findUnique({
      where: { id },
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
            providerId: true,
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
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Transform patient.providers to providerSelections format expected by the UI
    const providerSelections = patient.providers.map(prov => ({
      id: prov.id,
      providerId: prov.providerId,
      requestType: prov.requestType,
      dosType: prov.dosEnd ? 'custom' : 'present',
      startDate: prov.dosStart.toISOString(),
      endDate: prov.dosEnd ? prov.dosEnd.toISOString() : null
    }));

    // Format dates for response
    const formattedPatient = {
      ...patient,
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.toISOString() : null,
      dateOfInjury: patient.dateOfInjury ? patient.dateOfInjury.toISOString() : null,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      providerSelections // Add the formatted provider selections
    };

    return NextResponse.json({ data: formattedPatient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

// PUT /api/patients/[id] - Update a specific patient
async function handleUpdatePatient(
  request: NextRequest,
  context: { params: { [key: string]: string } }
) {
  const session = await getServerSession(authOptions); // Get session early
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const { id } = context.params; // Get ID early for logging

  try {
    // Auth check is handled by withAuth
    const body = await request.json();
    const { patientName, dateOfBirth, dateOfInjury, providerSelections } = body;

    console.log('Received update data:', body);

    // Validate required fields
    if (!patientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const originalPatient = await prisma.patient.findUnique({ where: { id } });
    if (!originalPatient) {
       return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const updateData: any = {
      patientName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      dateOfInjury: dateOfInjury ? new Date(dateOfInjury) : null
    };

    console.log('Updating patient with data:', updateData);

    const updatedPatient = await prisma.$transaction(async (tx) => {
       // 1. Update patient basic info
      const patientUpdateResult = await tx.patient.update({
        where: { id },
        data: updateData,
      });

      // 2. Handle provider selections synchronization
      if (Array.isArray(providerSelections)) {
        // Get existing links for comparison
        const existingLinks = await tx.patientProvider.findMany({
          where: { patientId: id },
          select: { id: true, providerId: true, requestType: true, dosStart: true, dosEnd: true }, // Select fields needed for comparison/update
        });
        const existingLinkMap = new Map(existingLinks.map(link => [link.providerId, link]));
        const incomingSelectionMap = new Map(providerSelections.map(sel => [sel.providerId, sel]));

        // Determine links to delete
        const linksToDelete = existingLinks.filter(link => !incomingSelectionMap.has(link.providerId));
        if (linksToDelete.length > 0) {
          await tx.patientProvider.deleteMany({
            where: { id: { in: linksToDelete.map(link => link.id) } },
          });
        }

        // Determine links to create or update
        for (const selection of providerSelections) {
          const existingLink = existingLinkMap.get(selection.providerId);
          
          // --- Prepare selectionData with proper date handling and dosType ---
          let dosStartValue: Date | null = null;
          let dosEndValue: Date | null = null;
          const dosType = selection.dosType; // Get dosType from selection

          // Attempt to parse the DOI from the main patient update data
          const patientDoiDate = dateOfInjury ? new Date(dateOfInjury) : null;

          // Start Date is generally the patient's DOI, but validate it
          if (patientDoiDate && !isNaN(patientDoiDate.getTime())) {
            dosStartValue = patientDoiDate;
          }
          
          // Calculate End Date based on dosType
          if (dosType === 'present' && dosStartValue) {
            dosEndValue = new Date(); // Use current date/time for Present
          } else if (dosType === 'next7days' && dosStartValue) {
            dosEndValue = new Date(dosStartValue.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
          } else if (dosType === 'custom') {
            // Use provided dates if valid, otherwise null
            dosStartValue = selection.startDate && !isNaN(new Date(selection.startDate).getTime()) ? new Date(selection.startDate) : dosStartValue; // Allow custom start date
            dosEndValue = selection.endDate && !isNaN(new Date(selection.endDate).getTime()) ? new Date(selection.endDate) : null;
          }
          
          // Fallback if dosStartValue is still null (e.g., invalid DOI)
          if (!dosStartValue) {
              console.error(`Invalid or missing DOI for patient ${id}, cannot calculate/save DOS for provider ${selection.providerId}. Skipping this provider link.`);
              // Skip this iteration if the start date is invalid/missing
              continue; 
          }
          // --- End Date Handling ---

          // Ensure providerId and requestType are present
          if (!selection.providerId || !selection.requestType) {
             console.error('Skipping provider selection due to missing providerId or requestType:', selection);
             continue; // Skip this iteration
          }

          const selectionData = {
            patientId: id,
            providerId: selection.providerId,
            requestType: selection.requestType,
            dosStart: dosStartValue, // Use calculated start date
            dosEnd: dosEndValue,     // Use calculated end date
            dosType: dosType,        // Save the dosType
          };

          if (existingLink) {
            // Check if update is needed (simple update for now)
            await tx.patientProvider.update({
              where: { id: existingLink.id },
              data: selectionData,
            });
          } else {
            // Create new link
            await tx.patientProvider.create({
              data: selectionData,
            });
          }
        }
      } else {
        // If providerSelections is not an array (e.g., null or undefined), potentially delete all existing links
        await tx.patientProvider.deleteMany({ where: { patientId: id } });
      }
      
      // 3. Return the updated patient with freshly queried relations
      return tx.patient.findUnique({
          where: { id },
          // Correct the relation name to 'providers'
          include: {
              providers: { include: { provider: true } } 
          }
      });
    });

    if (!updatedPatient) {
      throw new Error('Failed to retrieve updated patient after transaction');
    }

    // --- Create Audit Log --- 
    if (userId) { // Only log if user is identified
        // Determine changed fields for details (simple version)
        const changedFields = Object.keys(body).filter(key => key !== 'providerSelections'); 
        await createAuditLog({
            userId,
            userEmail,
            action: AuditActionType.UPDATE_PATIENT,
            targetEntityType: 'Patient',
            targetEntityId: id,
            details: { updatedFields: changedFields } 
        });
    }
    // --- End Audit Log ---

    // Transform providers to providerSelections for UI
    // Correct the relation name to 'providers' when mapping
    const updatedProviderSelections = updatedPatient.providers.map(prov => ({
      id: prov.id,
      providerId: prov.providerId,
      requestType: prov.requestType,
      dosType: prov.dosEnd ? ( (new Date().getTime() - prov.dosEnd.getTime()) < 86400000 ? 'present' : 'custom' ) : 'present', // Refined dosType logic
      startDate: prov.dosStart.toISOString(),
      endDate: prov.dosEnd ? prov.dosEnd.toISOString() : null
    }));

    // Format dates for response
    const formattedPatient = {
      ...updatedPatient,
      dateOfBirth: updatedPatient.dateOfBirth ? updatedPatient.dateOfBirth.toISOString() : null,
      dateOfInjury: updatedPatient.dateOfInjury ? updatedPatient.dateOfInjury.toISOString() : null,
      createdAt: updatedPatient.createdAt.toISOString(),
      updatedAt: updatedPatient.updatedAt.toISOString(),
      providerSelections: updatedProviderSelections
    };

    return NextResponse.json({ data: formattedPatient });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

// DELETE /api/patients/[id] - Delete a specific patient
async function handleDeletePatient(
  request: NextRequest,
  context: { params: { [key: string]: string } }
) {
  const session = await getServerSession(authOptions); // Get session early
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const { id } = context.params; // Get ID early for logging

  try {
    // Auth check is handled by withAuth

    // Check if patient exists first (needed for potential audit log details)
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
      select: { id: true, patientName: true } // Select name for audit log
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Check for related PatientProvider records
    const providerCount = await prisma.patientProvider.count({
        where: { patientId: id }
    });
    
    if (providerCount > 0) {
        return NextResponse.json(
            { error: `Cannot delete patient: ${providerCount} related provider links exist.` },
            { status: 400 }
        );
    }
    
    // Check for related Affidavit records
    const affidavitCount = await prisma.affidavit.count({
        where: { patientId: id }
    });
    
    if (affidavitCount > 0) {
        return NextResponse.json(
            { error: `Cannot delete patient: ${affidavitCount} related affidavit records exist.` },
            { status: 400 }
        );
    }

    // Proceed with deletion
    const deleteResult = await prisma.patient.delete({ where: { id } });

    // --- Create Audit Log --- 
    if (userId) { // Only log if user is identified
        await createAuditLog({
            userId,
            userEmail,
            action: AuditActionType.DELETE_PATIENT,
            targetEntityType: 'Patient',
            targetEntityId: id,
            details: { deletedEntityName: existingPatient.patientName } 
        });
    }
    // --- End Audit Log ---

    return NextResponse.json({ data: deleteResult });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}

// Re-add the export statements
export const GET = withAuth(handleGetPatient);
export const PUT = withAuth(handleUpdatePatient, ['ADMIN', 'STAFF']);
export const DELETE = withAuth(handleDeletePatient, ['ADMIN']);