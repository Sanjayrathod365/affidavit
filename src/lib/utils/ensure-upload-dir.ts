import { mkdir } from 'fs/promises';
import { join } from 'path';

export async function ensureUploadDir(subdirectory?: string) {
  const baseUploadDir = join(process.cwd(), 'public', 'uploads');
  let uploadDir = baseUploadDir;
  
  // Create the base uploads directory
  try {
    await mkdir(baseUploadDir, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
  
  // Create subdirectory if specified
  if (subdirectory) {
    uploadDir = join(baseUploadDir, subdirectory);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      if ((error as any).code !== 'EEXIST') {
        throw error;
      }
    }
  }
  
  return uploadDir;
} 