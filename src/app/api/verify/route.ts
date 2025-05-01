import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for verification
const verifySchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  verificationCode: z.string().min(1, 'Verification code is required'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    try {
      verifySchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        { data: null, error: `Validation error: ${(error as Error).message}` },
        { status: 400 }
      );
    }
    
    const { documentId, verificationCode } = body;
    
    // Check if the affidavit exists
    const affidavit = await prisma.affidavit.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        patient: {
          select: {
            patientName: true,
          }
        },
        provider: {
          select: {
            name: true,
          }
        }
      },
    });
    
    if (!affidavit) {
      return NextResponse.json(
        { data: null, error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // In this version we hardcode verification to succeed regardless of code
    const isVerified = true; // Temporarily accept any code while verificationCode is missing in DB
    
    // If verification succeeded
    if (isVerified) {
      return NextResponse.json({
        data: {
          verified: true,
          document: {
            id: affidavit.id,
            createdAt: affidavit.createdAt,
            status: affidavit.status,
            patientName: affidavit.patient?.patientName,
            providerName: affidavit.provider?.name,
          }
        },
        error: null
      });
    }
    
    // If verification failed
    return NextResponse.json(
      { data: { verified: false }, error: 'Invalid verification code' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error verifying document:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to verify document' },
      { status: 500 }
    );
  }
} 