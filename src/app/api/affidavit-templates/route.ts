import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic';

// Define UPLOAD_DIR near the top
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'templates');

// Define types for structure elements for better validation/parsing
const positionSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  page: z.number().optional(),
});

const stylesSchema = z.object({
  fontSize: z.number().optional(),
  fontWeight: z.enum(['normal', 'bold']).optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  color: z.string().optional(),
});

const placeholderSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['text', 'date', 'checkbox', 'signature']),
  defaultValue: z.string().optional(),
  required: z.boolean(),
  position: positionSchema.optional(),
  styles: stylesSchema.optional(),
});

const logoSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

const logoSettingsSchema = z.object({
  path: z.string().optional(),
  position: positionSchema.optional(),
  size: logoSizeSchema.optional(),
}).optional();

const textBlockSchema = z.object({
  id: z.string(),
  content: z.string(),
  position: positionSchema,
  styles: stylesSchema,
});

const signatureSettingsSchema = z.object({
  enabled: z.boolean(),
  label: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).required(),
}).optional();

const documentSettingsSchema = z.object({
  pageSize: z.enum(['Letter', 'Legal', 'A4']).optional().default('Letter'),
  orientation: z.enum(['portrait', 'landscape']).optional().default('portrait'),
}).optional();

const structureSchema = z.object({
  placeholders: z.array(placeholderSchema).optional().default([]),
  textBlocks: z.array(textBlockSchema).optional().default([]),
  signatureSettings: signatureSettingsSchema,
  documentSettings: documentSettingsSchema,
  header: z.object({ text: z.string() }).optional(),
  footer: z.object({ text: z.string() }).optional(),
  logoSettings: logoSettingsSchema,
});

const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  structure: structureSchema,
  logoPath: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
});

// GET handler for the list (no ID)
async function handleGetList() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch only active templates
    const templates = await prisma.affidavitTemplate.findMany({
      where: { isActive: true },
      orderBy: [
        { name: 'asc' },
        { version: 'desc' }
      ],
    });

    console.log('Raw templates fetched from DB:', JSON.stringify(templates, null, 2));
    console.log('Active templates fetched successfully:', templates.length);
    
    // Map to format needed by frontend
    const formattedTemplates = templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      filePath: t.filePath,
      bodyContent: t.bodyContent,
      logoPath: t.logoPath,
      structure: t.structure, 
      version: t.version,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return NextResponse.json(formattedTemplates);
  } catch (error) {
    console.error('Error fetching active templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active templates' },
      { status: 500 }
    );
  }
}

// Simplified GET handler - only handles the list
export async function GET(req: NextRequest) {
  // Always handle fetching the list
  return handleGetList();
}

// POST handler updated for FormData and file upload
async function handleCreateTemplate(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - User ID missing' }, { status: 401 });
    }

    console.log('Processing template creation request');
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const structureString = formData.get('structure') as string | null;
    const baseTemplateFile = formData.get('baseTemplate') as File | null;
    const logoPath = formData.get('logoPath') as string | null;
    const description = formData.get('description') as string | null;
    const bodyContent = formData.get('bodyContent') as string | null;

    if (!name || !structureString) {
      return NextResponse.json({ error: 'Missing required fields: name and structure.' }, { status: 400 });
    }
    
    let parsedStructure: any;
    try {
      parsedStructure = JSON.parse(structureString);
      const structureValidation = structureSchema.safeParse(parsedStructure);
      if (!structureValidation.success) throw new Error('Invalid structure format');
      parsedStructure = structureValidation.data;
    } catch (e: any) {
      return NextResponse.json({ error: `Invalid structure format: ${e.message}` }, { status: 400 });
    }

    let filePath: string | null = null;

    // Handle file upload if present
    if (baseTemplateFile) {
      if (baseTemplateFile.type !== 'application/pdf') {
         return NextResponse.json({ data: null, error: 'Invalid file type. Only PDF is allowed.' }, { status: 400 });
      }

      // Wrap file operations in try-catch
      try {
        await ensureUploadDirExists();
        const fileExtension = path.extname(baseTemplateFile.name) || '.pdf'; // Default to .pdf
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const destinationPath = path.join(UPLOAD_DIR, uniqueFilename);
        filePath = `/uploads/templates/${uniqueFilename}`; // Path to store in DB

        // Read file buffer and write to disk
        const fileBuffer = Buffer.from(await baseTemplateFile.arrayBuffer());
        await fs.writeFile(destinationPath, fileBuffer);
        console.log('Base template file saved successfully:', filePath);
      } catch (uploadError) {
        console.error('Error saving base template file during creation:', uploadError);
        return NextResponse.json({ error: 'Failed to save uploaded base template file.'}, { status: 500 });
      }
    }

    const dataToCreate = {
      name,
      description: description ?? null,
      logoPath: logoPath ?? null,
      structure: parsedStructure,
      bodyContent: bodyContent ?? null,
      filePath: filePath,
      isActive: true,
      version: 1,
      userId: session.user.id,
    };

    // Log the data just before creating
    console.log('Data being sent to prisma.create:', JSON.stringify(dataToCreate, null, 2));

    const newTemplate = await prisma.affidavitTemplate.create({ data: dataToCreate });

    // Revalidate the path after successful creation
    revalidatePath('/affidavit-templates');
    console.log('Revalidated path: /affidavit-templates');

    return NextResponse.json({ data: newTemplate, error: null }, { status: 201 });

  } catch (error) {
    // Log the caught error object itself for more details
    console.error('Caught error object during template creation:', error);
    console.error('Error creating template:', error); // Keep original log
    // Add specific Prisma error handling
    if (error instanceof PrismaClientKnownRequestError) {
      // Log specific Prisma error code
      console.error(`Prisma Error Code: ${error.code}`);
      // Potentially return a more specific error based on the code
      if (error.code === 'P2002') { // Unique constraint violation
          return NextResponse.json({ error: `Failed to create template: A template with this name/version might already exist.` }, { status: 409 }); // 409 Conflict
      } 
      // Add more specific checks if needed (e.g., P2003 for foreign key again, though unlikely now)
      return NextResponse.json({ error: `Database error occurred: ${error.code}` }, { status: 500 });
    } 
    // Handle other potential errors (like unexpected errors during data prep)
    return NextResponse.json({ error: 'Failed to create template due to an unexpected server error.' }, { status: 500 });
  }
}

// PUT handler - updated for versioning
async function handleUpdateTemplate(req: NextRequest): Promise<NextResponse> {
    const url = new URL(req.url);
    const id = url.searchParams.get('id'); // ID of the template being updated (the previous version)

    if (!id) {
        return NextResponse.json({ error: 'Template ID is required for update.' }, { status: 400 });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized - Missing user ID in session' }, { status: 401 });
        }

        console.log(`Processing template update request for ID: ${id}`);
        console.log(`User ID from session: ${session.user.id}`);

        const formData = await req.formData();
        const name = formData.get('name') as string | null;
        const structureString = formData.get('structure') as string | null;
        const baseTemplateFile = formData.get('baseTemplate') as File | null;
        const logoPath = formData.get('logoPath') as string | null;
        const description = formData.get('description') as string | null;
        const bodyContent = formData.get('bodyContent') as string | null; // Get bodyContent

        // --- Basic Validation --- 
        if (!name || !structureString) {
            return NextResponse.json({ error: 'Missing required fields: name and structure.' }, { status: 400 });
        }
        
        let parsedStructure: any;
        try {
            parsedStructure = JSON.parse(structureString);
            const structureValidation = structureSchema.safeParse(parsedStructure);
            if (!structureValidation.success) throw new Error('Invalid structure format');
            parsedStructure = structureValidation.data;
        } catch (e: any) {
            return NextResponse.json({ error: `Invalid structure format: ${e.message}` }, { status: 400 });
        }

        // --- Fetch Previous Version --- 
        const previousVersion = await prisma.affidavitTemplate.findUnique({
            where: { id },
        });

        if (!previousVersion) {
            return NextResponse.json({ error: `Template with ID ${id} not found.` }, { status: 404 });
        }

        // --- Handle File Upload (If new file provided) --- 
        let newFilePath: string | null = null;
        if (baseTemplateFile) {
           if (baseTemplateFile.type !== 'application/pdf') {
              return NextResponse.json({ data: null, error: 'Invalid file type. Only PDF is allowed.' }, { status: 400 });
           }
           try {
              await ensureUploadDirExists();
              const fileExtension = path.extname(baseTemplateFile.name) || '.pdf';
              const uniqueFilename = `${uuidv4()}${fileExtension}`;
              const destinationPath = path.join(UPLOAD_DIR, uniqueFilename);
              newFilePath = `/uploads/templates/${uniqueFilename}`;

              const fileBuffer = Buffer.from(await baseTemplateFile.arrayBuffer());
              await fs.writeFile(destinationPath, fileBuffer);
              console.log('New base template file saved successfully:', newFilePath);

              // Optional: Delete old file if it exists and a new one is uploaded
              if (previousVersion.filePath) {
                 try {
                    const oldPath = path.join(process.cwd(), 'public', previousVersion.filePath);
                    await fs.unlink(oldPath);
                    console.log('Old base template file deleted:', oldPath);
                 } catch (deleteError: any) {
                    // Log error but don't fail the update if deletion fails
                    console.warn(`Could not delete old file ${previousVersion.filePath}:`, deleteError.message);
                 }
              }
           } catch (uploadError) {
              console.error('Error saving new base template file during update:', uploadError);
              return NextResponse.json({ error: 'Failed to save uploaded base template file.' }, { status: 500 });
           }
        }

        // Create new template data
        const newTemplateData = {
            name: name ?? previousVersion.name, // Use new name or keep old
            description: description ?? previousVersion.description,
            logoPath: logoPath ?? previousVersion.logoPath,
            structure: parsedStructure, // Always use the new structure from the form
            bodyContent: bodyContent ?? previousVersion.bodyContent, // Include bodyContent
            filePath: newFilePath ?? previousVersion.filePath, // Use new file path or keep old one
            version: previousVersion.version + 1,
            isActive: true,
            // IMPORTANT: Always use the original template's userId to maintain correct relationship
            // This preserves the template's ownership and prevents foreign key constraint errors
            userId: previousVersion.userId,
        };
        
        console.log('Creating new template version with data:', JSON.stringify(newTemplateData, null, 2));

        // --- Transaction: Deactivate old, Create new --- 
        const [_, newTemplate] = await prisma.$transaction([
            // 1. Deactivate the previous version
            prisma.affidavitTemplate.update({
                where: { id: previousVersion.id },
                data: { isActive: false },
            }),
            // 2. Create the new version
            prisma.affidavitTemplate.create({
                data: newTemplateData,
            }),
        ]);

        // Revalidate the path after successful update
        revalidatePath('/affidavit-templates');
        console.log('Revalidated path: /affidavit-templates');

        return NextResponse.json({ data: newTemplate, error: null }, { status: 200 });

    } catch (error) {
        console.error('Error updating template:', error);
        // Add more detailed error handling
        if (error instanceof PrismaClientKnownRequestError) {
            console.error(`Prisma error code: ${error.code}`);
            console.error(`Prisma error meta:`, error.meta);
            
            if (error.code === 'P2003') {
                return NextResponse.json({ 
                    error: `Foreign key constraint failed - Likely issue with userId reference` 
                }, { status: 500 });
            }
        }
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}

// DELETE handler (needs to extract ID from query param)
async function handleDeleteTemplate(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const id = url.searchParams.get('id'); // Get ID from query param

  if (!id) {
      return NextResponse.json({ error: 'Template ID is required for deletion.' }, { status: 400 });
  }
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if template exists before deleting
    const existingTemplate = await prisma.affidavitTemplate.findUnique({ where: { id } });
    if (!existingTemplate) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Perform deletion
    await prisma.affidavitTemplate.delete({ where: { id } });

    return NextResponse.json({ message: 'Template deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting template:', error);
    // Handle potential errors (e.g., related records constraint)
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        return NextResponse.json({ error: 'Cannot delete template: It might be linked to existing affidavits.' }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}

// Function to ensure upload directory exists
const ensureUploadDirExists = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    // Directory does not exist, create it
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Export route handlers
export const POST = withAuth(handleCreateTemplate, ["ADMIN", "SUPERVISOR"]);
export const PUT = withAuth(handleUpdateTemplate, ["ADMIN", "SUPERVISOR"]); // Assuming PUT is for update
export const DELETE = withAuth(handleDeleteTemplate, ["ADMIN", "SUPERVISOR"]); // Assuming DELETE is for deletion 