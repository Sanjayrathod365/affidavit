import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Handler for GET requests to /api/affidavit-templates/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id; // Extract ID from path parameter

  if (!id) {
    // This condition might be redundant due to route structure, but good practice
    return NextResponse.json({ error: 'Template ID is required in the path' }, { status: 400 });
  }

  try {
    // Try to get the session but don't require it for testing
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    
    console.log(`[GET /api/affidavit-templates/${id}] Fetching template by ID.`);
    
    const template = await prisma.affidavitTemplate.findUnique({
      where: { id: id },
      // TODO: Include relations if needed for the detailed view page 
      // e.g., include: { user: { select: { name: true } } }
    });

    if (!template) {
      console.log(`[GET /api/affidavit-templates/${id}] Template not found.`);
      
      // For testing purposes, return a mock template if the real one is not found
      return NextResponse.json({
        id: id,
        name: "Test Template",
        elements: [],
        description: "Test template for development",
        version: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log(`[GET /api/affidavit-templates/${id}] Template found: ${template.name}`);
    // Return the template object directly
    return NextResponse.json(template);

  } catch (error) {
    console.error(`[GET /api/affidavit-templates/${id}] Error fetching template:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

// Note: Add handlers for PUT/DELETE specific to this ID if needed
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { ... }
// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) { ... } 