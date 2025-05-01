import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Basic local file storage. Replace with cloud storage (e.g., Supabase) in production.
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    // Basic validation (optional: add more checks like size, type)
    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename (e.g., timestamp + original name)
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    // Define the path to save the file (relative to the project root)
    // IMPORTANT: Ensure the 'uploads' directory exists at the project root!
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'template-images');
    const filePath = path.join(uploadDir, filename);

    // Ensure the directory exists (consider moving this check elsewhere for efficiency)
    // In a real app, this might be handled during deployment or startup
    try {
        await require('fs/promises').mkdir(uploadDir, { recursive: true });
    } catch (mkdirError) {
        console.error("Error creating upload directory:", mkdirError);
        // Don't necessarily fail the request, maybe the dir already exists
    }

    // Write the file to the filesystem
    await writeFile(filePath, buffer);
    console.log(`Uploaded file saved to: ${filePath}`);

    // Construct the public URL (assuming 'uploads' is served statically from 'public')
    const publicUrl = `/uploads/template-images/${filename}`;

    return NextResponse.json({ success: true, imageUrl: publicUrl });

  } catch (error) {
    console.error("Error uploading template image:", error);
    return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
  }
} 