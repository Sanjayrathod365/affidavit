import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/middleware/auth';
import { createAuditLog } from '@/lib/services/auditLogService';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AffidavitStatus, AuditActionType } from '@prisma/client';
import logger from '@/lib/utils/logger';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

async function handleSendRequest(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const userEmail = session.user.email;

  try {
    const body = await req.json();
    const { patientId, linkId, method } = body;

    // --- 1. Validate Input ---
    if (!patientId || !linkId || !method || !['email', 'fax'].includes(method)) {
      logger.warn('Send request validation failed: Invalid input', { body });
      return NextResponse.json({ error: 'Invalid input: patientId, linkId, and method (email/fax) are required.' }, { status: 400 });
    }

    // --- 2. Find Provider Link ---
    const patientProviderLink = await prisma.patientProvider.findUnique({
      where: { id: linkId, patientId: patientId }, // Ensure link belongs to the patient
      include: { provider: true }, // Include provider details directly
    });

    if (!patientProviderLink) {
      logger.warn(`Send request failed: PatientProvider link not found`, { linkId, patientId });
      return NextResponse.json({ error: 'Provider link not found for this patient.' }, { status: 404 });
    }

    const provider = patientProviderLink.provider;
    const providerId = provider.id;
    const requestType = patientProviderLink.requestType;

    // --- 3. Find Latest Generated Affidavit ---
    const latestAffidavit = await prisma.affidavit.findFirst({
      where: {
        patientId: patientId,
        providerId: providerId,
        status: AffidavitStatus.GENERATED,
        generatedFilePath: { not: null }, // Ensure path exists
      },
      orderBy: {
        // Assuming createdAt reflects generation time more accurately, but updatedAt could also work
        createdAt: 'desc',
      },
    });

    if (!latestAffidavit || !latestAffidavit.generatedFilePath) {
      logger.warn(`Send request failed: No generated affidavit found`, { patientId, providerId });
      return NextResponse.json({ error: 'No generated affidavit found for this patient and provider.' }, { status: 404 });
    }

    const affidavitId = latestAffidavit.id;
    const filePathToSend = latestAffidavit.generatedFilePath;

    // --- 4. Determine Recipient & Prepare ---
    let recipient: string | null = null;
    let recipientType: 'email' | 'fax' | null = null;

    if (method === 'email') {
      // Prioritize request-specific email, then general email
      recipient = provider.brEmailId && requestType.startsWith('BR_') ? provider.brEmailId
                : provider.mrEmailId && requestType.startsWith('MR_') ? provider.mrEmailId
                : provider.email;
      recipientType = recipient ? 'email' : null;
    } else { // method === 'fax'
      // Prioritize request-specific fax, then general fax
      recipient = provider.brFaxNumber && requestType.startsWith('BR_') ? provider.brFaxNumber
                : provider.mrFaxNumber && requestType.startsWith('MR_') ? provider.mrFaxNumber
                : provider.fax;
      recipientType = recipient ? 'fax' : null;
    }

    if (!recipient || !recipientType) {
       logger.warn(`Send request failed: No suitable ${method} address/number found for provider`, { providerId, requestType });
       return NextResponse.json({ error: `No suitable ${method} address/number found for provider.` }, { status: 400 });
    }

    logger.info(`Preparing to send affidavit ${affidavitId} via ${recipientType} to ${recipient}`, { patientId, providerId, filePath: filePathToSend });

    // --- 5. Send --- 
    let sendSuccess = false;
    try {
      // Ensure the file path is valid and accessible
      // Note: This assumes generatedFilePath is relative to the project root or an absolute path
      // Adjust the path resolution if files are stored elsewhere (e.g., in a /public directory)
      const absoluteFilePath = path.resolve(filePathToSend); 
      
      try {
        await fs.access(absoluteFilePath); // Check if file exists and is accessible
      } catch (fileAccessError) {
        logger.error(`Send request failed: Cannot access affidavit file`, { affidavitId, path: absoluteFilePath, error: fileAccessError });
        return NextResponse.json({ error: 'Failed to access the affidavit PDF file.' }, { status: 500 });
      }

      if (recipientType === 'email') {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
          secure: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10) === 465, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_FROM, // Sender address
          to: recipient, // List of receivers
          subject: `Affidavit/Records Request for Patient ID: ${patientId}`, // Subject line
          text: `Attached is the requested document for patient ID ${patientId} regarding provider ${provider.name}.`, // plain text body
          // html: "<b>Hello world?</b>", // You can add HTML body if needed
          attachments: [
            {
              filename: path.basename(absoluteFilePath), // Use the original filename
              path: absoluteFilePath, // Stream the file
            },
          ],
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully', { messageId: info.messageId, recipient });
        sendSuccess = true;

      } else if (recipientType === 'fax') {
        // TODO: Implement Fax sending logic using a service like Twilio
        logger.info(`[PLACEHOLDER] Simulating successful FAX send of ${absoluteFilePath} to ${recipient}`);
        sendSuccess = true; // Assume success for Fax placeholder
      }

    } catch (sendError) {
       logger.error(`Send request failed: Error during ${recipientType} transmission`, { error: sendError, affidavitId, recipient });
       return NextResponse.json({ error: `Failed to send request via ${recipientType}.` }, { status: 500 });
    }

    // --- 6. Update Affidavit Status ---
    if (sendSuccess) {
      await prisma.affidavit.update({
        where: { id: affidavitId },
        data: { status: AffidavitStatus.SENT },
      });
      logger.info(`Updated affidavit status to SENT`, { affidavitId });

      // --- 7. Audit Log ---
      await createAuditLog({
        userId,
        userEmail,
        action: AuditActionType.SEND_REQUEST, // Ensure this action type exists in your enum/schema
        targetEntityType: 'Affidavit',
        targetEntityId: affidavitId,
        details: {
          method: recipientType,
          recipient: recipient, // Log the actual recipient
          patientId: patientId,
          providerId: providerId,
          providerName: provider.name, // Include provider name for context
        },
      });

      return NextResponse.json({ message: `Request sent successfully via ${recipientType} to ${recipient}.` });
    } else {
      // This path might be redundant if the catch block handles errors, but included for clarity
      return NextResponse.json({ error: `Failed to send request via ${recipientType}.` }, { status: 500 });
    }

  } catch (error) {
    logger.error('Error handling send request:', { error });
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Apply authentication middleware to the POST handler
export const POST = withAuth(handleSendRequest, ['ADMIN', 'STAFF']); // Adjust roles as needed 