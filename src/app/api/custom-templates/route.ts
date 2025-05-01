import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma'; // Assuming prisma client is setup here

// Zod schema for validating the element structure within the JSON
const elementSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'data']),
  content: z.string(), // Content might be text, data key, or image URL
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  // Optional Styling Properties
  fontSize: z.number().optional(),
  fontWeight: z.enum(['normal', 'bold']).optional(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(), // Validate hex color format
  // Optional Type-Specific Properties
  imageUrl: z.string().url().optional(), // Validate URL format if provided
  dataFieldKey: z.string().optional(),
});

// Zod schema for validating the request body for POST
const createTemplateSchema = z.object({
  name: z.string().min(1, { message: 'Template name cannot be empty' }),
  // Validate that elements is an array of objects matching the elementSchema
  elements: z.array(elementSchema).min(1, { message: 'Template must contain at least one element' }),
});

// POST /api/custom-templates - Create a new custom template
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }

    const { name, elements } = validation.data;

    // Prisma expects the JSON field to be provided directly
    const newTemplate = await prisma.customAffidavitTemplate.create({
      data: {
        name,
        elements: elements as any, // Cast needed as Prisma types JSON as Prisma.JsonValue
      },
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error("Error creating custom template:", error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

// GET /api/custom-templates - Get all custom templates (basic info)
export async function GET(request: Request) {
  try {
    const templates = await prisma.customAffidavitTemplate.findMany({
      select: { // Only select basic info for the list view
        id: true,
        name: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching custom templates:", error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
} 