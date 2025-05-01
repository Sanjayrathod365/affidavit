import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Re-use or redefine validation schemas if needed, ensure consistency
const elementSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'image', 'data']),
    content: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    // Optional Styling Properties
    fontSize: z.number().optional(),
    fontWeight: z.enum(['normal', 'bold']).optional(),
    fontStyle: z.enum(['normal', 'italic']).optional(),
    textAlign: z.enum(['left', 'center', 'right']).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    // Optional Type-Specific Properties
    imageUrl: z.string().url().optional(),
    dataFieldKey: z.string().optional(),
});

const updateTemplateSchema = z.object({
    name: z.string().min(1).optional(),
    elements: z.array(elementSchema).min(1).optional(),
});

interface RouteParams {
    params: {
        id: string;
    }
}

// GET /api/custom-templates/[id] - Get a specific template
export async function GET(request: Request, { params }: RouteParams) {
    const { id } = params;
    try {
        const template = await prisma.customAffidavitTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // The `elements` field will be JSON, needs parsing on the client if needed
        return NextResponse.json(template);
    } catch (error) {
        console.error(`Error fetching custom template ${id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }
}

// PUT /api/custom-templates/[id] - Update a specific template
export async function PUT(request: Request, { params }: RouteParams) {
    const { id } = params;
    try {
        const body = await request.json();
        const validation = updateTemplateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
        }

        // Check if template exists before updating
        const existingTemplate = await prisma.customAffidavitTemplate.findUnique({ where: { id } });
        if (!existingTemplate) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        const updateData: { name?: string; elements?: any } = {};
        if (validation.data.name) {
            updateData.name = validation.data.name;
        }
        if (validation.data.elements) {
            updateData.elements = validation.data.elements as any; // Cast needed for JSON
        }

        if (Object.keys(updateData).length === 0) {
             return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
        }

        const updatedTemplate = await prisma.customAffidavitTemplate.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedTemplate);
    } catch (error) {
        console.error(`Error updating custom template ${id}:`, error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}

// DELETE /api/custom-templates/[id] - Delete a specific template
export async function DELETE(request: Request, { params }: RouteParams) {
    const { id } = params;
    try {
        // Check if template exists before deleting
        const existingTemplate = await prisma.customAffidavitTemplate.findUnique({ where: { id } });
        if (!existingTemplate) {
            // Idempotent: If it doesn't exist, consider it successfully deleted
            return NextResponse.json({ message: 'Template not found or already deleted' }, { status: 200 }); 
        }

        await prisma.customAffidavitTemplate.delete({ 
            where: { id },
         });

        return NextResponse.json({ message: 'Template deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting custom template ${id}:`, error);
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
} 