import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AffidavitStatus } from '@/types/affidavit';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import { format as formatDate, isValid as isDateValid } from 'date-fns';
import { parse, HTMLElement } from 'node-html-parser';
import { z } from 'zod';
import { TemplateElement } from '@/components/template-editor/TemplateEditor';
import { fetch } from 'node-fetch'; // Use node-fetch for fetching images in Node.js environment

// --- Constants ---
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'affidavits');
const LOGO_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'logos');

// --- Helper Functions ---
// formatSubmissionMethod, parseColor, ensureUploadDirExists, getPlaceholderValue, replacePlaceholdersInHtml
// ... (Keep existing helper functions) ...

// Helper function to parse color strings (e.g., #RRGGBB)
function parseColor(colorStr?: string): { red: number; green: number; blue: number } | undefined {
  if (!colorStr || !/^#[0-9A-Fa-f]{6}$/.test(colorStr)) {
    return undefined; // Default black will be used by pdf-lib
  }
  const r = parseInt(colorStr.substring(1, 3), 16) / 255;
  const g = parseInt(colorStr.substring(3, 5), 16) / 255;
  const b = parseInt(colorStr.substring(5, 7), 16) / 255;
  return { red: r, green: g, blue: b };
}

async function ensureUploadDirExists() {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
        console.error("Error creating upload directory:", error);
        // Handle the error appropriately
    }
}

function getPlaceholderValue(placeholderName: string, data: any): string {
  // Simple example, expand with more fields and formatting
  switch (placeholderName) {
    case 'patientName': return data.patientName || 'N/A';
    case 'providerName': return data.providerName || 'N/A';
    case 'patientDOB': return data.patientDOB && isDateValid(new Date(data.patientDOB)) ? formatDate(new Date(data.patientDOB), 'MM/dd/yyyy') : 'N/A';
    case 'patientDOI': return data.patientDOI && isDateValid(new Date(data.patientDOI)) ? formatDate(new Date(data.patientDOI), 'MM/dd/yyyy') : 'N/A';
    case 'providerAddress': return data.providerAddress || 'N/A';
    case 'currentDate': return formatDate(new Date(), 'MM/dd/yyyy');
    case 'dosRange':
      const start = data.dosStart && isDateValid(new Date(data.dosStart)) ? formatDate(new Date(data.dosStart), 'MM/dd/yyyy') : null;
      const end = data.dosEnd && isDateValid(new Date(data.dosEnd)) ? formatDate(new Date(data.dosEnd), 'MM/dd/yyyy') : null;
      if (start && end) return `${start} - ${end}`;
      if (start) return `From ${start}`;
      return 'N/A';
    // Add more cases as needed
    default: return `[${placeholderName}]`; // Return placeholder name if not found
  }
}

function replacePlaceholdersInHtml(html: string, data: any): string {
  if (!html) return '';
  // Replace placeholders like {{patientName}}
  return html.replace(/{{([^}]+)}}/g, (match, placeholderName) => {
    return getPlaceholderValue(placeholderName.trim(), data);
  });
}

// Zod schema for validating the request body
const generateBodySchema = z.object({
  templateId: z.string(),
  templateType: z.enum(['STANDARD', 'CUSTOM']),
  // placeholderData: z.record(z.any()).optional(), // Keep or remove based on final logic
});

// --- API Handler ---
async function handler(
  req: NextRequest,
  context: { params: { [key: string]: string | string[] | undefined } }
): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const affidavitId = context.params?.id as string | undefined;
  if (!affidavitId) {
    return NextResponse.json({ error: 'Affidavit ID is required' }, { status: 400 });
  }

  console.log(`[Generate Affidavit API] Received request for ID: ${affidavitId}`);

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const validation = generateBodySchema.safeParse(requestBody);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
  }

  const { templateId, templateType } = validation.data;
  console.log(`[Generate Affidavit API] Using Template ID: ${templateId}, Type: ${templateType}`);

  try {
    // --- 1. Fetch Affidavit and Related Data (Patient, Provider) ---
    const affidavit = await prisma.affidavit.findUnique({
      where: { id: affidavitId },
      include: {
        patient: true,
        provider: true,
        // Note: We fetch the specific template (standard or custom) below based on type
      },
    });

    if (!affidavit) {
      return NextResponse.json({ error: 'Affidavit not found' }, { status: 404 });
    }
    if (affidavit.status !== AffidavitStatus.DRAFT) {
      return NextResponse.json({ error: `Affidavit is not in DRAFT status. Current status: ${affidavit.status}` }, { status: 400 });
    }

    // --- 1b. Fetch Template Data (Standard or Custom) ---
    let standardTemplate: any = null;
    let customTemplate: any = null;
    let templateNameForError = 'Template'; // For error messages

    if (templateType === 'STANDARD') {
      standardTemplate = await prisma.affidavitTemplate.findUnique({
        where: { id: templateId },
      });
      templateNameForError = 'Standard template';
      if (!standardTemplate) {
        return NextResponse.json({ error: `${templateNameForError} not found (ID: ${templateId})` }, { status: 404 });
      }
      if (!standardTemplate.filePath && !standardTemplate.bodyContent) {
         console.error(`[Generate Affidavit API] Standard template ${templateId} has neither filePath nor bodyContent.`);
         return NextResponse.json({ error: 'Standard template is missing both base PDF file path and body content. Cannot generate.' }, { status: 400 });
      }
    } else { // templateType === 'CUSTOM'
      customTemplate = await prisma.customAffidavitTemplate.findUnique({
        where: { id: templateId },
      });
      templateNameForError = 'Custom template';
      if (!customTemplate) {
        return NextResponse.json({ error: `${templateNameForError} not found (ID: ${templateId})` }, { status: 404 });
      }
      if (!customTemplate.elements || typeof customTemplate.elements !== 'object' || !Array.isArray(customTemplate.elements) || customTemplate.elements.length === 0) {
        return NextResponse.json({ error: 'Custom template is invalid or empty.' }, { status: 400 });
      }
    }

    // --- Fetch PatientProvider Link for DOS --- 
    const patientProviderLink = await prisma.patientProvider.findFirst({
        where: {
            patientId: affidavit.patientId,
            providerId: affidavit.providerId,
        },
        select: {
            dosStart: true,
            dosEnd: true,
        }
    });
    
    if (!patientProviderLink) {
        console.error(`[Generate Affidavit API] Could not find matching PatientProvider link for Patient ${affidavit.patientId} and Provider ${affidavit.providerId}.`);
        // Decide how to handle this - return error or proceed with 'N/A' for DOS?
        // Returning error for now:
         return NextResponse.json({ error: 'Failed to find associated Date of Service information for this affidavit.' }, { status: 400 });
    }
    // --- End Fetch PatientProvider ---

    // --- Prepare Data For PDF --- 
    const dataForPdf = {
        patientName: affidavit.patient.patientName,
        providerName: affidavit.provider.name,
        patientDOB: affidavit.patient.dateOfBirth,
        patientDOI: affidavit.patient.dateOfInjury,
        providerAddress: affidavit.provider.address, 
        dosStart: patientProviderLink.dosStart, // Add DOS dates from the link
        dosEnd: patientProviderLink.dosEnd,
        // New submission methods
        brSubmissionMethod: affidavit.provider.brSubmissionMethod || 'NONE',
        mrSubmissionMethod: affidavit.provider.mrSubmissionMethod || 'NONE',
        // Legacy submission methods - keeping for backward compatibility
        usesFax: affidavit.provider.usesFax ?? false,
        usesEmail: affidavit.provider.usesEmail ?? false,
        usesMail: affidavit.provider.usesMail ?? false,
        usesSmartPortal: affidavit.provider.usesSmartPortal ?? false,
        // Fax numbers
        brFaxNumber: affidavit.provider.brFaxNumber ?? '',
        mrFaxNumber: affidavit.provider.mrFaxNumber ?? '',
        // Email addresses
        brEmailId: affidavit.provider.brEmailId ?? '',
        mrEmailId: affidavit.provider.mrEmailId ?? '',
        // Mailing addresses
        brMailingAddress: affidavit.provider.brMailingAddress ?? '',
        mrMailingAddress: affidavit.provider.mrMailingAddress ?? '',
        // Smart portal links
        brSmartPortal: affidavit.provider.brSmartPortal ?? '',
        mrSmartPortal: affidavit.provider.mrSmartPortal ?? '',
        smartFolder: affidavit.provider.smartFolder ?? '',
        // dosType: patientProviderLink.dosType, // Include if needed by getPlaceholderValue
        // Add more fields as needed
    };

    // --- PDF Generation Logic --- 
    // TODO: Modify this section significantly based on templateType

    let pdfDoc: PDFDocument;
    
    // Placeholder: Determine which template data to use (replace with actual conditional logic later)
    const activeTemplate = templateType === 'STANDARD' ? standardTemplate : customTemplate; 
    const templateStructure = activeTemplate?.structure as any; // Example - needs refinement
    const bodyContentHtml = standardTemplate?.bodyContent; // Only from standard for now
    const basePdfPath = standardTemplate?.filePath ? path.join(process.cwd(), 'public', standardTemplate.filePath) : null;

    // --- Load/Create PDF Document --- 
    if (basePdfPath) {
        // Load existing standard PDF
        const existingPdfBytes = await fs.readFile(basePdfPath);
        pdfDoc = await PDFDocument.load(existingPdfBytes);
    } else {
        // Create new PDF (for custom or standard without base file)
        pdfDoc = await PDFDocument.create();
        pdfDoc.addPage();
    }
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Embed fonts
    const defaultFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const defaultBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const defaultItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const defaultBoldItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

    console.log(`Proceeding with ${templateType} template generation...`);

    // --- Drawing Logic (Highly Simplified - Requires Full Implementation Later) ---
    if (templateType === 'STANDARD') {
        // Apply existing drawing logic for standard templates using standardTemplate data
        console.log("Applying standard drawing logic (Not fully implemented in this edit)");
        // ... (Existing standard drawing logic would go here) ... 
    } else {
        // Apply new drawing logic for custom templates using customTemplate.elements
        console.log("Applying custom drawing logic (Not fully implemented in this edit)");
        const customElements = customTemplate.elements as TemplateElement[]; // Assert type from import

        for (const element of customElements) {
            try {
                // Calculate coordinates (bottom-left origin)
                const elX = element.x;
                const elY = height - element.y - element.height;
                const elWidth = element.width;
                const elHeight = element.height;

                // Determine Font
                let font = defaultFont;
                const isBold = element.fontWeight === 'bold';
                const isItalic = element.fontStyle === 'italic';
                if (isBold && isItalic) font = defaultBoldItalicFont;
                else if (isBold) font = defaultBoldFont;
                else if (isItalic) font = defaultItalicFont;

                // Determine Style Properties
                const fontSize = element.fontSize ?? 12;
                const colorRgb = parseColor(element.color ?? '#000000') ?? { red: 0, green: 0, blue: 0 };
                const alignment = element.textAlign ?? 'left';
                const lineSpacingFactor = 1.2; // Adjust for line height relative to font size
                const lineHeight = fontSize * lineSpacingFactor;

                switch (element.type) {
                    case 'text':
                    case 'data':
                        const text = element.type === 'data' 
                            ? getPlaceholderValue(element.dataFieldKey ?? element.content, dataForPdf)
                            : element.content;
                        
                        // Basic Alignment Handling (adjust X based on text width)
                        let drawX = elX + 5; // Default padding
                        const textWidth = font.widthOfTextAtSize(text, fontSize);
                        if (alignment === 'center') {
                            drawX = elX + (elWidth - textWidth) / 2;
                        } else if (alignment === 'right') {
                            drawX = elX + elWidth - textWidth - 5; // padding on right
                        }
                        // Ensure drawX is not less than elX
                        drawX = Math.max(elX, drawX);

                        // Draw text (adjust Y for baseline - top alignment for now)
                        // pdf-lib draws text based on the baseline. 
                        // Simple top alignment: start drawing near the top of the box.
                        const drawY = elY + elHeight - fontSize; // Adjust based on desired vertical alignment 
                        
                        firstPage.drawText(text, {
                            x: drawX,
                    y: drawY,
                    size: fontSize,
                    font: font,
                            color: rgb(colorRgb.red, colorRgb.green, colorRgb.blue),
                            maxWidth: elWidth - 10, // Basic wrapping
                            lineHeight: lineHeight,
                            // wordBreaks: [] // More advanced wrapping if needed
                        });
                        break;
                        
                    case 'image':
                        if (element.imageUrl) {
                            try {
                                console.log(`[Generate Affidavit API] Fetching image: ${element.imageUrl}`);
                                // Fetch image data
                                const imageResponse = await fetch(element.imageUrl);
                                if (!imageResponse.ok) {
                                    throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
                                }
                                const imageBytes = await imageResponse.arrayBuffer();
                                
                                // Determine image type and embed
                                let embeddedImage;
                                const contentType = imageResponse.headers.get('content-type') || '';
                                if (contentType.includes('png') || element.imageUrl.toLowerCase().endsWith('.png')) {
                                    embeddedImage = await pdfDoc.embedPng(imageBytes);
                                } else if (contentType.includes('jpeg') || element.imageUrl.toLowerCase().endsWith('.jpg') || element.imageUrl.toLowerCase().endsWith('.jpeg')) {
                                    embeddedImage = await pdfDoc.embedJpg(imageBytes);
                                } else {
                                    console.warn(`[Generate Affidavit API] Unsupported image type for element ${element.id}: ${contentType || 'unknown'}`);
                                    throw new Error('Unsupported image type');
                                }
                                
                                // Calculate aspect ratio to fit within the element bounds
                                const { width: imgWidth, height: imgHeight } = embeddedImage.scaleToFit(elWidth, elHeight);
                                
                                // Center image within the element bounds (optional)
                                const imgDrawX = elX + (elWidth - imgWidth) / 2;
                                const imgDrawY = elY + (elHeight - imgHeight) / 2;

                                // Draw the image
                                firstPage.drawImage(embeddedImage, {
                                    x: imgDrawX,
                                    y: imgDrawY,
                                    width: imgWidth,
                                    height: imgHeight,
                                });
                                console.log(`[Generate Affidavit API] Drew image element ${element.id}`);

                            } catch (imgError) {
                                console.error(`[Generate Affidavit API] Error processing image element ${element.id} (URL: ${element.imageUrl}):`, imgError);
                                // Draw placeholder on error
                                firstPage.drawRectangle({ x: elX, y: elY, width: elWidth, height: elHeight, borderColor: rgb(1, 0, 0), borderWidth: 1 });
                                firstPage.drawText(`[ERR Image Load: ${element.id}]`, { x: elX + 5, y: elY + 5, size: 9, color: rgb(1, 0, 0) });
                            }
                    } else {
                            // Draw placeholder if no URL
                            firstPage.drawRectangle({ x: elX, y: elY, width: elWidth, height: elHeight, borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 1 });
                            firstPage.drawText(`[No Image URL: ${element.id}]`, { x: elX + 5, y: elY + 5, size: 9, color: rgb(0.5, 0.5, 0.5) });
                        }
                        break;
                }
            } catch (drawError) {
                console.error(`[Generate Affidavit API] Error drawing custom element ${element.id}:`, drawError);
                // Draw an error indicator on the PDF
                const errorY = height - element.y - 10;
                firstPage.drawText(`[ERR ${element.id}]`, { x: element.x, y: errorY, size: 8, color: rgb(1, 0, 0) });
            }
        }
        console.log(`[Generate Affidavit API] Finished drawing ${customElements.length} custom elements.`);
    }

    // --- Save PDF --- 
    const pdfBytes = await pdfDoc.save();
    await ensureUploadDirExists();
    const uniqueFilename = `${uuidv4()}.pdf`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueFilename);
    const publicFilePath = `/uploads/affidavits/${uniqueFilename}`;
    await fs.writeFile(destinationPath, pdfBytes);

    // --- Update Affidavit Record --- 
    const updatedAffidavit = await prisma.affidavit.update({
      where: { id: affidavitId },
      data: {
        status: AffidavitStatus.GENERATED,
        generatedFilePath: publicFilePath,
      },
    });

    // --- Return Success Response --- 
    return NextResponse.json({ 
        message: 'Affidavit generated successfully!',
        generatedFilePath: publicFilePath,
        updatedAffidavit // Send back the updated record
    }, { status: 200 });

  } catch (error) {
    console.error(`[Generate Affidavit API] Error generating affidavit for ID: ${affidavitId}`, error);
    // Add specific error handling
    let errorStatus = 500;
    let errorMessage = 'Failed to generate affidavit';
    if (error instanceof Error && error.message.includes('base PDF')) { // More specific check
      errorStatus = 400; // Bad request if base PDF is missing/invalid
      errorMessage = 'Base PDF template file is missing or could not be loaded.';
    } else if (error instanceof Error && error.message.includes('ENOENT')) { // File not found
       errorStatus = 404; // Not Found if file path is wrong
       errorMessage = 'A required file (template, font, or logo) was not found.';
    }
    // Add more specific checks (e.g., PDF generation library errors)

    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : String(error) },
      { status: errorStatus }
    );
  }
}

// Apply authentication middleware
export const POST = withAuth(handler, ["ADMIN", "SUPERVISOR", "STAFF"]);

// Removed pdfmake specific TODOs

// TODO: Import necessary PDF generation logic/libraries (e.g., pdfmake, fs, path)
// TODO: Import function to generate PDF content based on template and data 