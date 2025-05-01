import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use named import
import { v4 as uuidv4 } from 'uuid'; // Or use database auto-generated IDs if preferred
import { Prisma } from '@prisma/client';

// POST /api/custom-templates/[id]/clone
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const templateIdToClone = params.id;

    if (!templateIdToClone) {
        return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    try {
        // 1. Fetch the original template
        const originalTemplate = await prisma.customAffidavitTemplate.findUnique({
            where: { id: templateIdToClone },
        });

        if (!originalTemplate) {
            return NextResponse.json({ error: 'Original template not found' }, { status: 404 });
        }

        // Ensure elements data is valid JSON input (e.g., not null if the field requires it)
        // Prisma's InputJsonValue typically expects arrays or objects for JSON fields.
        let elementsInput: Prisma.InputJsonValue = []; // Default to empty array
        if (originalTemplate.elements && typeof originalTemplate.elements === 'object') {
            // If it's an object or array (and not null), assume it's valid input
            elementsInput = originalTemplate.elements as Prisma.InputJsonValue; 
        } else if (originalTemplate.elements) {
             // If it's some other JSON primitive (string, number, boolean), wrap it if necessary
             // or handle as an error depending on schema. For now, log warning and use default.
             console.warn(`Template ${templateIdToClone} has unexpected primitive JSON type for elements. Cloning with empty elements.`);
        }
        // If originalTemplate.elements was null and the field requires non-null, elementsInput remains []

        // 2. Prepare data for the new cloned template
        const clonedTemplateData = {
            // Don't spread originalTemplate directly if ID is auto-generated or types mismatch
            name: `${originalTemplate.name} (Copy)`, // Modify the name
            // Copy other relevant fields explicitly if needed, e.g.:
            // description: originalTemplate.description,
            // category: originalTemplate.category,
            
            // Use the validated/prepared elements input
            elements: elementsInput,
             // Let Prisma handle default createdAt/updatedAt unless you specifically need to override
             // Let Prisma handle ID generation if it's auto-incrementing or cuid()/uuid()
        };

        // 3. Create the new template in the database
        const newClone = await prisma.customAffidavitTemplate.create({
            // Cast data to the correct input type if necessary, 
            // but ideally structure `clonedTemplateData` to match.
            data: clonedTemplateData as Prisma.CustomAffidavitTemplateCreateInput,
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Template cloned successfully', 
            newTemplateId: newClone.id // Return the ID of the new clone
        }, { status: 201 });

    } catch (error) {
        console.error(`Error cloning template ${templateIdToClone}:`, error);
        // Check for specific Prisma errors if needed
        return NextResponse.json({ error: 'Failed to clone template' }, { status: 500 });
    }
} 