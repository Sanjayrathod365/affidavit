import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

// Define the target directory relative to the project root
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/logos');

export async function POST(request: NextRequest) {
  try {
    // Ensure the upload directory exists
    try {
        await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (mkdirError: any) {
        // Handle potential errors during directory creation, except EEXIST
        if (mkdirError.code !== 'EEXIST') {
             console.error('Failed to create upload directory:', mkdirError);
             return NextResponse.json({ error: 'Failed to create upload directory.' }, { status: 500 });
        }
    }

    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No logo file provided.' }, { status: 400 });
    }

    // Basic validation (optional: add size, type checks)
    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Convert file buffer for writing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the specified directory
    await writeFile(filePath, buffer);

    // Construct the public path (relative to the public folder)
    const publicPath = `/uploads/logos/${uniqueFilename}`;

    console.log(`Logo uploaded successfully: ${publicPath}`);

    // Return the public path to the client
    return NextResponse.json({ filePath: publicPath }, { status: 200 });

  } catch (error) {
    console.error('Logo upload failed:', error);
    return NextResponse.json({ error: 'Internal Server Error during logo upload.' }, { status: 500 });
  }
} 