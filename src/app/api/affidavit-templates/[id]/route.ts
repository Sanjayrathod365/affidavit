import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Handler for GET requests to /api/affidavit-templates/[id]
async function handleGetById(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id; // Extract ID from path parameter

  if (!id) {
    // This condition might be redundant due to route structure, but good practice
    return NextResponse.json({ error: 'Template ID is required in the path' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log(`[GET /api/affidavit-templates/${id}] Fetching template by ID.`);
    
    const template = await prisma.affidavitTemplate.findUnique({
      where: { id: id },
      // TODO: Include relations if needed for the detailed view page 
      // e.g., include: { user: { select: { name: true } } }
    });

    if (!template) {
      console.log(`[GET /api/affidavit-templates/${id}] Template not found.`);
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
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

// Export the handler for the GET method
export { handleGetById as GET };

// Note: Add handlers for PUT/DELETE specific to this ID if needed
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { ... }
// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) { ... } 